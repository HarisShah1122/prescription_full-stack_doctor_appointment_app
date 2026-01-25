import mongoose from 'mongoose';
import doctorModel from './models/doctorModel.js';

// Doctors from frontend assets.js
const doctorsData = [
    {
        name: 'Dr. Ahmed Khan',
        email: 'dr.ahmed@prescription.com',
        password: 'doctor123',
        speciality: 'General Physician',
        degree: 'MBBS, FCPS',
        experience: '4 Years',
        about: 'Dr. Ahmed Khan is a dedicated general physician with extensive experience in primary care. He specializes in preventive medicine, chronic disease management, and provides comprehensive healthcare services to patients of all ages.',
        fees: 1500,
        address: {
            line1: 'DHA Medical Center, Phase 5',
            line2: 'Lahore, Punjab'
        },
        available: true,
        image: 'doc1.png',
        date: Date.now()
    },
    {
        name: 'Dr. Fatima Zahra',
        email: 'dr.fatima@prescription.com',
        password: 'doctor123',
        speciality: 'Gynecologist',
        degree: 'MBBS, FCPS (Gynecology)',
        experience: '7 Years',
        about: 'Dr. Fatima Zahra is an experienced gynecologist specializing in women\'s health, maternal care, and reproductive medicine. She provides comprehensive gynecological services with compassion and expertise.',
        fees: 2000,
        address: {
            line1: 'Islamabad Medical Complex',
            line2: 'Sector F-8, Islamabad'
        },
        available: true,
        image: 'doc2.png',
        date: Date.now()
    },
    {
        name: 'Dr. Ayesha Siddiqui',
        email: 'dr.ayesha@prescription.com',
        password: 'doctor123',
        speciality: 'Dermatologist',
        degree: 'MBBS, FCPS (Dermatology)',
        experience: '5 Years',
        about: 'Dr. Ayesha Siddiqui is a skilled dermatologist specializing in medical and cosmetic dermatology. She offers advanced treatments for skin conditions and aesthetic procedures.',
        fees: 1200,
        address: {
            line1: 'Skin Care Clinic',
            line2: 'Clifton, Karachi'
        },
        available: true,
        image: 'doc3.png',
        date: Date.now()
    },
    {
        name: 'Dr. Muhammad Ali',
        email: 'dr.muhammad@prescription.com',
        password: 'doctor123',
        speciality: 'Pediatrician',
        degree: 'MBBS, FCPS (Pediatrics)',
        experience: '6 Years',
        about: 'Dr. Muhammad Ali is a compassionate pediatrician dedicated to children\'s health and well-being. He specializes in pediatric care, vaccinations, and child development.',
        fees: 1000,
        address: {
            line1: 'Children\'s Hospital',
            line2: 'Gulshan-e-Iqbal, Karachi'
        },
        available: true,
        image: 'doc4.png',
        date: Date.now()
    },
    {
        name: 'Dr. Sara Hassan',
        email: 'dr.sara@prescription.com',
        password: 'doctor123',
        speciality: 'Neurologist',
        degree: 'MBBS, FCPS (Neurology)',
        experience: '8 Years',
        about: 'Dr. Sara Hassan is a renowned neurologist with expertise in treating neurological disorders. She specializes in brain and nervous system conditions with advanced diagnostic skills.',
        fees: 2500,
        address: {
            line1: 'Neuro Care Center',
            line2: 'Blue Area, Islamabad'
        },
        available: true,
        image: 'doc5.png',
        date: Date.now()
    },
    {
        name: 'Dr. Omar Farooq',
        email: 'dr.omar@prescription.com',
        password: 'doctor123',
        speciality: 'General Physician',
        degree: 'MBBS, MCPS',
        experience: '10 Years',
        about: 'Dr. Omar Farooq is an experienced general physician with expertise in internal medicine and chronic disease management.',
        fees: 1500,
        address: {
            line1: 'Medical Center',
            line2: 'Model Town, Lahore'
        },
        available: true,
        image: 'doc6.png',
        date: Date.now()
    },
    {
        name: 'Dr. Hira Tariq',
        email: 'dr.hira@prescription.com',
        password: 'doctor123',
        speciality: 'General Physician',
        degree: 'MBBS, FCPS',
        experience: '3 Years',
        about: 'Dr. Hira Tariq is a dedicated general physician focused on preventive care and family medicine.',
        fees: 1500,
        address: {
            line1: 'Family Health Clinic',
            line2: 'Faisalabad'
        },
        available: true,
        image: 'doc7.png',
        date: Date.now()
    },
    {
        name: 'Dr. Ali Raza',
        email: 'dr.ali@prescription.com',
        password: 'doctor123',
        speciality: 'Gynecologist',
        degree: 'MBBS, FCPS (Gynecology)',
        experience: '9 Years',
        about: 'Dr. Ali Raza is a skilled gynecologist specializing in high-risk pregnancies and advanced gynecological surgeries.',
        fees: 2000,
        address: {
            line1: 'Maternity & Child Care Hospital',
            line2: 'Rawalpindi'
        },
        available: true,
        image: 'doc8.png',
        date: Date.now()
    },
    {
        name: 'Dr. Mariam Yousuf',
        email: 'dr.mariam@prescription.com',
        password: 'doctor123',
        speciality: 'Dermatologist',
        degree: 'MBBS, FCPS (Dermatology)',
        experience: '1 Years',
        about: 'Dr. Mariam Yousuf is a talented dermatologist specializing in cosmetic dermatology, laser treatments, and advanced skin care procedures.',
        fees: 1200,
        address: {
            line1: 'Laser & Skin Clinic',
            line2: 'Bahria Town, Islamabad'
        },
        available: true,
        image: 'doc9.png',
        date: Date.now()
    },
    {
        name: 'Dr. Hamza Malik',
        email: 'dr.hamza@prescription.com',
        password: 'doctor123',
        speciality: 'Pediatrician',
        degree: 'MBBS, FCPS (Pediatrics)',
        experience: '5 Years',
        about: 'Dr. Hamza Malik is a dedicated pediatrician with expertise in neonatal care and pediatric emergencies.',
        fees: 1000,
        address: {
            line1: 'Kids Care Hospital',
            line2: 'Gulberg, Lahore'
        },
        available: true,
        image: 'doc10.png',
        date: Date.now()
    },
    {
        name: 'Dr. Bilal Ahmed',
        email: 'dr.bilal@prescription.com',
        password: 'doctor123',
        speciality: 'Neurologist',
        degree: 'MBBS, FCPS (Neurology)',
        experience: '12 Years',
        about: 'Dr. Bilal Ahmed is a senior neurologist with extensive experience in treating complex neurological disorders and stroke management.',
        fees: 2500,
        address: {
            line1: 'Aga Khan Hospital',
            line2: 'Karachi'
        },
        available: true,
        image: 'doc11.png',
        date: Date.now()
    },
    {
        name: 'Dr. Sana Khan',
        email: 'dr.sana@prescription.com',
        password: 'doctor123',
        speciality: 'Dermatologist',
        degree: 'MBBS, FCPS (Dermatology)',
        experience: '4 Years',
        about: 'Dr. Sana Khan is a skilled dermatologist specializing in medical dermatology and aesthetic treatments.',
        fees: 1200,
        address: {
            line1: 'Derma Care Clinic',
            line2: 'Johar Town, Lahore'
        },
        available: true,
        image: 'doc12.png',
        date: Date.now()
    }
];

async function seedDoctors() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/prescription_full-stack_doctor');
        console.log('Connected to MongoDB');

        // Clear existing doctors
        await doctorModel.deleteMany({});
        console.log('Cleared existing doctors');

        // Insert new doctors
        const insertedDoctors = await doctorModel.insertMany(doctorsData);
        console.log(`Inserted ${insertedDoctors.length} doctors:`);
        
        insertedDoctors.forEach(doc => {
            console.log(`- ${doc.name} (${doc.speciality}) - ID: ${doc._id}`);
        });

        mongoose.connection.close();
        console.log('Database seeding completed!');
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
}

seedDoctors();
