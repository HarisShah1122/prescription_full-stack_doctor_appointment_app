import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { doctors as staticDoctors } from '../assets/assets'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext)

  // Function to get doctor image
  const getDoctorImage = (doctor, index) => {
    console.log('Getting image for doctor:', doctor.name, doctor._id, 'index:', index);
    
    // If doctor has image from backend (Cloudinary URL), use it
    if (doctor.image && typeof doctor.image === 'string' && (doctor.image.startsWith('http') || doctor.image.startsWith('https'))) {
      console.log('Using backend image URL:', doctor.image);
      return doctor.image;
    }
    
    // If doctor has _id starting with 'doc', use corresponding static image
    if (doctor._id && doctor._id.startsWith('doc')) {
      const staticDoctor = staticDoctors.find(d => d._id === doctor._id);
      if (staticDoctor && staticDoctor.image) {
        console.log('Using static image for ID:', doctor._id, staticDoctor.image);
        return staticDoctor.image;
      }
    }
    
    // Fallback: try to match by name with static doctors
    const staticDoctor = staticDoctors.find(d => d.name === doctor.name);
    if (staticDoctor && staticDoctor.image) {
      console.log('Using static image for name match:', doctor.name, staticDoctor.image);
      return staticDoctor.image;
    }
    
    // If no match, use index-based selection to ensure variety
    const imageIndex = index % staticDoctors.length;
    const fallbackImage = staticDoctors[imageIndex]?.image;
    console.log('Using index-based fallback image:', imageIndex, fallbackImage);
    return fallbackImage || 'https://via.placeholder.com/150x150?text=Doctor';
  }

  // Function to get complete doctor data (merge static and backend data)
  const getCompleteDoctorData = (doctor, index) => {
    // If it's a static doctor (has _id starting with 'doc'), return as is
    if (doctor._id && doctor._id.startsWith('doc')) {
      return doctor;
    }
    
    // Otherwise, merge with static data for missing fields
    const staticDoctor = staticDoctors.find(d => d.name === doctor.name);
    return {
      ...doctor,
      image: getDoctorImage(doctor, index),
      // Add missing fields from static data if available
      degree: doctor.degree || staticDoctor?.degree || 'MBBS',
      experience: doctor.experience || staticDoctor?.experience || '5 Years',
      about: doctor.about || staticDoctor?.about || 'Experienced medical professional',
      address: doctor.address || staticDoctor?.address || { line1: 'Medical Center', line2: 'City' }
    };
  }

  const applyFilter = () => {
    console.log("Selected speciality from URL:", speciality);
    console.log("All doctors list:", doctors.map(d => ({ name: d.name, speciality: d.speciality })));

    let allDoctors = doctors;
    
    // If no doctors from backend, use static doctors
    if (!allDoctors || allDoctors.length === 0) {
      allDoctors = staticDoctors;
      console.log("Using static doctors as fallback");
    }

    if (speciality) {
      const filtered = allDoctors.filter(
        doc => doc.speciality.toLowerCase() === speciality.toLowerCase()
      )
      console.log("Filtered doctors:", filtered);
      setFilterDoc(filtered);
    } else {
      setFilterDoc(allDoctors);
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialists.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>
          Filters
        </button>
        {/* Sidebar filters */}
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {['General Physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist'].map(sp => (
            <p
              key={sp}
              onClick={() => speciality === sp ? navigate('/doctors') : navigate(`/doctors/${sp}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded cursor-pointer ${speciality === sp ? 'bg-[#E2E5FF] text-black ' : ''}`}>
              {sp}
            </p>
          ))}
        </div>
        {/* Doctors Grid */}
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => {
            const completeDoctor = getCompleteDoctorData(item, index);
            return (
              <div
                key={completeDoctor._id || `doctor-${index}`}
                onClick={() => { navigate(`/appointment/${completeDoctor._id}`); scrollTo(0, 0) }}
                className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                <img 
                  className='bg-[#EAEFFF] w-full h-48 object-cover' 
                  src={completeDoctor.image} 
                  alt={completeDoctor.name}
                  key={`img-${completeDoctor._id || index}`}
                  onError={(e) => {
                    console.log('Image failed to load for:', completeDoctor.name, 'Trying fallback...');
                    // Try to get a different static image using index
                    const fallbackIndex = (index + 1) % staticDoctors.length;
                    e.target.src = staticDoctors[fallbackIndex]?.image || 'https://via.placeholder.com/150x150?text=Doctor';
                  }}
                />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm ${completeDoctor.available ? 'text-green-500' : "text-gray-500"}`}>
                    <p className={`w-2 h-2 rounded-full ${completeDoctor.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
                    <p>{completeDoctor.available ? 'Available' : "Not Available"}</p>
                  </div>
                  <p className='text-[#262626] text-lg font-medium'>{completeDoctor.name}</p>
                  <p className='text-[#5C5C5C] text-sm'>{completeDoctor.speciality}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Doctors
