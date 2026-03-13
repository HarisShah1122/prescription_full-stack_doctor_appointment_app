import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General Physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Ahmed Khan',
        image: doc1,
        speciality: 'General Physician',
        degree: 'MBBS, FCPS',
        experience: '4 Years',
        about: 'Dr. Ahmed Khan is a dedicated general physician with extensive experience in primary care. He specializes in preventive medicine, chronic disease management, and provides comprehensive healthcare services to patients of all ages.',
        fees: 1500,
        address: {
            line1: 'DHA Medical Center, Phase 5',
            line2: 'Lahore, Punjab'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Fatima Zahra',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS, FCPS (Gynecology)',
        experience: '7 Years',
        about: 'Dr. Fatima Zahra is an experienced gynecologist specializing in women\'s health, maternal care, and reproductive medicine. She provides comprehensive gynecological services with compassion and expertise.',
        fees: 2000,
        address: {
            line1: 'Islamabad Medical Complex',
            line2: 'Sector F-8, Islamabad'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Ayesha Siddiqui',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS, FCPS (Dermatology)',
        experience: '5 Years',
        about: 'Dr. Ayesha Siddiqui is a skilled dermatologist specializing in medical and cosmetic dermatology. She offers advanced treatments for skin conditions and aesthetic procedures.',
        fees: 1200,
        address: {
            line1: 'Skin Care Clinic',
            line2: 'Clifton, Karachi'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Muhammad Ali',
        image: doc4,
        speciality: 'Pediatrician',
        degree: 'MBBS, FCPS (Pediatrics)',
        experience: '6 Years',
        about: 'Dr. Muhammad Ali is a compassionate pediatrician dedicated to children\'s health and well-being. He specializes in pediatric care, vaccinations, and child development.',
        fees: 1000,
        address: {
            line1: 'Children\'s Hospital',
            line2: 'Gulshan-e-Iqbal, Karachi'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Sara Hassan',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS, FCPS (Neurology)',
        experience: '8 Years',
        about: 'Dr. Sara Hassan is a renowned neurologist with expertise in treating neurological disorders. She specializes in brain and nervous system conditions with advanced diagnostic skills.',
        fees: 2500,
        address: {
            line1: 'Neuro Care Center',
            line2: 'Blue Area, Islamabad'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Omar Farooq',
        image: doc6,
        speciality: 'General Physician',
        degree: 'MBBS, MCPS',
        experience: '10 Years',
        about: 'Dr. Omar Farooq is an experienced general physician with expertise in internal medicine and chronic disease management.',
        fees: 1500,
        address: {
            line1: 'Medical Center',
            line2: 'Model Town, Lahore'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Hira Tariq',
        image: doc7,
        speciality: 'General Physician',
        degree: 'MBBS, FCPS',
        experience: '3 Years',
        about: 'Dr. Hira Tariq is a dedicated general physician focused on preventive care and family medicine.',
        fees: 1500,
        address: {
            line1: 'Family Health Clinic',
            line2: 'Faisalabad'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Ali Raza',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS, FCPS (Gynecology)',
        experience: '9 Years',
        about: 'Dr. Ali Raza is a skilled gynecologist specializing in high-risk pregnancies and advanced gynecological surgeries.',
        fees: 2000,
        address: {
            line1: 'Maternity & Child Care Hospital',
            line2: 'Rawalpindi'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Mariam Yousuf',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS, FCPS (Dermatology)',
        experience: '1 Years',
        about: 'Dr. Mariam Yousuf is a talented dermatologist specializing in cosmetic dermatology, laser treatments, and advanced skin care procedures.',
        fees: 1200,
        address: {
            line1: 'Laser & Skin Clinic',
            line2: 'Bahria Town, Islamabad'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Hamza Malik',
        image: doc10,
        speciality: 'Pediatrician',
        degree: 'MBBS, FCPS (Pediatrics)',
        experience: '5 Years',
        about: 'Dr. Hamza Malik is a dedicated pediatrician with expertise in neonatal care and pediatric emergencies.',
        fees: 1000,
        address: {
            line1: 'Kids Care Hospital',
            line2: 'Gulberg, Lahore'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Bilal Ahmed',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS, FCPS (Neurology)',
        experience: '12 Years',
        about: 'Dr. Bilal Ahmed is a senior neurologist with extensive experience in treating complex neurological disorders and stroke management.',
        fees: 2500,
        address: {
            line1: 'Aga Khan Hospital',
            line2: 'Karachi'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Sana Khan',
        image: doc12,
        speciality: 'Dermatologist',
        degree: 'MBBS, FCPS (Dermatology)',
        experience: '4 Years',
        about: 'Dr. Sana Khan is a skilled dermatologist specializing in medical dermatology and aesthetic treatments.',
        fees: 1200,
        address: {
            line1: 'Derma Care Clinic',
            line2: 'Johar Town, Lahore'
        }
    }
]
