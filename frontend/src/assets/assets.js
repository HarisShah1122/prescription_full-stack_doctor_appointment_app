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
        degree: 'MBBS, FCPS (Gynae)',
        experience: '3 Years',
        about: 'Dr. Fatima Zahra is a compassionate gynecologist specializing in women\'s health, prenatal care, and reproductive medicine. She is committed to providing personalized care to women at all stages of life.',
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
        degree: 'MBBS, MCPS (Dermatology)',
        experience: '1 Years',
        about: 'Dr. Ayesha Siddiqui is a skilled dermatologist specializing in medical and cosmetic dermatology. She provides expert treatment for skin conditions and offers advanced aesthetic procedures.',
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
        speciality: 'Pediatricians',
        degree: 'MBBS, DCH',
        experience: '2 Years',
        about: 'Dr. Muhammad Ali is a caring pediatrician dedicated to children\'s health and well-being. He specializes in pediatric care, vaccinations, and child development monitoring.',
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
        experience: '4 Years',
        about: 'Dr. Sara Hassan is an experienced neurologist specializing in the diagnosis and treatment of neurological disorders. She has expertise in stroke management, epilepsy, and neurodegenerative diseases.',
        fees: 2500,
        address: {
            line1: 'Neuro Care Center',
            line2: 'Blue Area, Islamabad'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Bilal Ahmed',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS, MRCP (Neurology)',
        experience: '4 Years',
        about: 'Dr. Bilal Ahmed is a renowned neurologist with expertise in treating complex neurological conditions. He specializes in movement disorders, headaches, and neurocritical care.',
        fees: 2500,
        address: {
            line1: 'Aga Khan Hospital',
            line2: 'Karachi, Sindh'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Omar Farooq',
        image: doc7,
        speciality: 'General Physician',
        degree: 'MBBS, MCPS',
        experience: '4 Years',
        about: 'Dr. Omar Farooq is a dedicated general physician with expertise in internal medicine. He provides comprehensive healthcare services with a focus on preventive care and health education.',
        fees: 1500,
        address: {
            line1: 'Medical Center',
            line2: 'Model Town, Lahore'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Khadija Rehman',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS, MRCOG',
        experience: '3 Years',
        about: 'Dr. Khadija Rehman is a skilled gynecologist specializing in high-risk pregnancies, infertility treatments, and minimally invasive gynecological surgeries.',
        fees: 2000,
        address: {
            line1: 'Women\'s Health Center',
            line2: 'Defense Housing Authority, Lahore'
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
        speciality: 'Pediatricians',
        degree: 'MBBS, DCH, FCPS',
        experience: '2 Years',
        about: 'Dr. Hamza Malik is a dedicated pediatrician with expertise in pediatric emergency care and child nutrition. He is passionate about promoting children\'s health and development.',
        fees: 1000,
        address: {
            line1: 'Kids Care Hospital',
            line2: 'Gulberg, Lahore'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Zainab Abbas',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS, FCPS (Neurology)',
        experience: '4 Years',
        about: 'Dr. Zainab Abbas is an expert neurologist specializing in neurophysiology, epilepsy management, and sleep disorders. She is committed to providing comprehensive neurological care.',
        fees: 2500,
        address: {
            line1: 'Neurology Institute',
            line2: 'PECHS, Karachi'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Usman Ghani',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS, FRCP (Neurology)',
        experience: '4 Years',
        about: 'Dr. Usman Ghani is a highly experienced neurologist with expertise in stroke care, multiple sclerosis, and neuroimmunology. He is known for his patient-centered approach.',
        fees: 2500,
        address: {
            line1: 'Shifa International Hospital',
            line2: 'Islamabad'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Hira Tariq',
        image: doc13,
        speciality: 'General Physician',
        degree: 'MBBS, ACP',
        experience: '4 Years',
        about: 'Dr. Hira Tariq is a compassionate general physician with expertise in family medicine, chronic disease management, and preventive healthcare.',
        fees: 1500,
        address: {
            line1: 'Family Health Clinic',
            line2: 'Faisalabad, Punjab'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Ali Raza',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS, FCPS (Gynae & Obs)',
        experience: '3 Years',
        about: 'Dr. Ali Raza is a skilled gynecologist specializing in reproductive medicine, laparoscopic surgeries, and high-risk obstetrics.',
        fees: 2000,
        address: {
            line1: 'Maternity & Child Care Hospital',
            line2: 'Rawalpindi, Punjab'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Sana Khan',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS, DDVL',
        experience: '1 Years',
        about: 'Dr. Sana Khan is a dedicated dermatologist specializing in medical dermatology, aesthetic procedures, and skin rejuvenation treatments.',
        fees: 1200,
        address: {
            line1: 'Derma Care Clinic',
            line2: 'Johar Town, Lahore'
        }
    },
]
