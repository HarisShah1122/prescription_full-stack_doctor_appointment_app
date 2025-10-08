import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currency, backendUrl, token, getDoctosData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate();

  // 🩺 Fetch selected doctor info
  const fetchDocInfo = async () => {
    const info = doctors.find((doc) => doc._id === docId);
    if (info) setDocInfo(info);
  };

  // 🕒 Generate available slots
  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setDocSlots([]);

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const isSlotAvailable = !docInfo.slots_booked?.[slotDate]?.includes(formattedTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  // 📅 Book appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Please login to book an appointment.');
      return navigate('/login');
    }

    if (!docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
      toast.error('No available time slots found.');
      return;
    }

    if (!slotTime) {
      toast.error('Please select a time slot.');
      return;
    }

    const date = docSlots[slotIndex][0].datetime;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const slotDate = `${day}_${month}_${year}`;

    console.log("📡 Booking API:", `${backendUrl}/api/user/book-appointment`);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ updated header
      );

      if (data.success) {
        toast.success(data.message || 'Appointment booked successfully!');
        getDoctosData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error("❌ Booking Error:", error);
      toast.error('Booking failed. Please try again later.');
    }
  };

  useEffect(() => {
    if (doctors.length > 0) fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  return docInfo ? (
    <div className="p-4 sm:p-6">
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className="flex-1 border border-gray-300 rounded-lg p-6 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="verified" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>

          <div className="mt-3">
            <p className="flex items-center gap-1 text-sm font-medium text-gray-800">
              About <img className="w-3" src={assets.info_icon} alt="info" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Appointment fee: <span className="text-gray-800">{currency} {docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              key={index}
              className={`text-center py-4 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index ? 'bg-primary text-white' : 'border border-gray-300'
              }`}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots[slotIndex]?.map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              key={index}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                item.time === slotTime ? 'bg-primary text-white' : 'text-gray-500 border border-gray-400'
              }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
        >
          Book an Appointment
        </button>
      </div>

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : (
    <p className="text-center mt-20 text-gray-500">Loading doctor data...</p>
  );
};

export default Appointment;
