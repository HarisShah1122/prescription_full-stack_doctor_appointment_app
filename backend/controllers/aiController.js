// AI Controller for handling chatbot requests
import doctorModel from '../models/doctorModel.js';

// AI chatbot response handler
const getAIResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        console.log("Received message:", message);
        console.log("Message type:", typeof message);
        
        if (!message) {
            return res.json({ success: false, message: "Message is required" });
        }

        const lowerMessage = message.toLowerCase();
        console.log("Lowercase message:", lowerMessage);
        let response = "";

        // Get doctors data for contextual responses
        const doctors = await doctorModel.find({});
        
        // Greetings - English & Urdu
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
            lowerMessage.includes('assalam') || lowerMessage.includes('salam') || lowerMessage.includes('assalam o alaikum') || 
            lowerMessage.includes('assalamualaikum') || lowerMessage.includes('adaab') || lowerMessage.includes('salam alaikum')) {
            response = "Hello! Welcome to Prescription Medical Center. I'm here to help you with medical appointments, doctor information, and general health questions. How can I assist you today?";
        }
        
        // How are you - English & Urdu
        else if (lowerMessage.includes('how are you') || lowerMessage.includes('kese ho') || lowerMessage.includes('kia haal hai') || 
                 lowerMessage.includes('kya hal hai') || lowerMessage.includes('ap kese hain') || lowerMessage.includes('aap kaise hain') ||
                 lowerMessage.includes('kese hain ap') || lowerMessage.includes('khairiyat')) {
            response = "I'm doing great, thank you for asking! I'm here 24/7 to help you with any medical or health-related questions. What can I help you with today?";
        }
        
        // Time/Date - English & Urdu
        else if (lowerMessage.includes('time') || lowerMessage.includes('date') || lowerMessage.includes('what time') || 
                 lowerMessage.includes('kitna time') || lowerMessage.includes('kya waqt hai') || lowerMessage.includes('waqt') || 
                 lowerMessage.includes('tarikh') || lowerMessage.includes('aaj ki tarikh') || lowerMessage.includes('kya time ho raha hai')) {
            const now = new Date();
            response = `The current time is ${now.toLocaleTimeString()} and today is ${now.toLocaleDateString()}. Our clinic is open Monday-Friday 9 AM-8 PM, Saturday 10 AM-6 PM, and Sunday 10 AM-4 PM.`;
        }
        
        // Weather - English & Urdu
        else if (lowerMessage.includes('weather') || lowerMessage.includes('mosam') || lowerMessage.includes('mausam') || 
                 lowerMessage.includes('hawa') || lowerMessage.includes('aaj ka mosam') || lowerMessage.includes('mosam kaisa hai')) {
            response = "I don't have access to real-time weather information, but I can help you book an appointment regardless of the weather! Would you like to see our available doctors?";
        }
        
        // Help/Support - English & Urdu
        else if (lowerMessage.includes('help') || lowerMessage.includes('madad') || lowerMessage.support || 
                 lowerMessage.includes('ki madad') || lowerMessage.includes('mujhe madad chahiye') || 
                 lowerMessage.includes('meri madad karo') || lowerMessage.includes('support chahiye')) {
            response = "I'm here to help! I can assist you with:\n• Booking appointments with doctors\n• Finding specialists by specialty\n• General health information\n• Clinic services and hours\n• Contact information\n• Payment methods\n\nWhat specific help do you need?";
        }
        
        // What can you do - English & Urdu
        else if (lowerMessage.includes('what can you do') || lowerMessage.includes('kya kar sakte ho') || 
                 lowerMessage.includes('your features') || lowerMessage.includes('ap kya kar sakte hain') || 
                 lowerMessage.includes('tum kya kar sakte ho') || lowerMessage.includes('apki kya khasiyat hai')) {
            response = "I'm your AI medical assistant! I can help you:\n\n🏥 **Medical Services:**\n• Book appointments with specialists\n• Find doctors by specialty\n• Get general health information\n• Answer medical questions\n\n📋 **Clinic Information:**\n• Clinic hours and location\n• Doctor availability\n• Payment methods\n• Contact details\n\n💬 **General Chat:**\n• Answer general questions\n• Provide helpful information\n• Guide you through our services\n\nHow can I help you today?";
        }
        
        // Who are you - English & Urdu
        else if (lowerMessage.includes('who are you') || lowerMessage.includes('what is your name') || 
                 lowerMessage.includes('ap ka naam kya hai') || lowerMessage.includes('ap kon ho') || 
                 lowerMessage.includes('tum kaun ho') || lowerMessage.includes('aap kaun hain') || 
                 lowerMessage.includes('yeh kaun hai') || lowerMessage.includes('apka naam kya hai')) {
            response = "I'm your AI Medical Assistant at Prescription Medical Center. I'm designed to help you with healthcare-related questions, appointment booking, and provide information about our medical services. I'm available 24/7 to assist you!";
        }
        
        // Location/Address - English & Urdu
        else if (lowerMessage.includes('where are you') || lowerMessage.includes('location') || lowerMessage.includes('pata') || 
                 lowerMessage.includes('address') || lowerMessage.includes('kahan ho') || lowerMessage.includes('ap kahan ho') || 
                 lowerMessage.includes('clinic kahan hai') || lowerMessage.includes('pata batao') || lowerMessage.includes('address batao')) {
            response = "We're located at 123 Medical Street, Healthcare City. We have multiple branches in major cities including Lahore, Karachi, Islamabad, and Rawalpindi. Would you like directions to any specific branch?";
        }
        
        // Services - English & Urdu
        else if (lowerMessage.includes('services') || lowerMessage.includes('what services') || lowerMessage.includes('khidmat') || 
                 lowerMessage.includes('ki khidmat') || lowerMessage.includes('kya khidmat milti hai') || 
                 lowerMessage.includes('apki kya services hain') || lowerMessage.includes('yahan kya kya hota hai')) {
            response = "We offer comprehensive medical services:\n\n🏥 **Medical Specialties:**\n• General Medicine\n• Gynecology & Obstetrics\n• Dermatology\n• Pediatrics\n• Neurology\n• Gastroenterology\n\n💳 **Additional Services:**\n• Online appointments\n• Home consultations\n• Laboratory services\n• Pharmacy\n• Emergency care\n\nWhich service are you interested in?";
        }
        
        // Emergency - English & Urdu
        else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('immediate') || 
                 lowerMessage.includes('hatmi') || lowerMessage.includes('fori') || lowerMessage.includes('emergency hai') || 
                 lowerMessage.includes('jaldi') || lowerMessage.includes('turant') || lowerMessage.includes('immediate help chahiye')) {
            response = "🚨 **For Medical Emergencies:**\n• Call emergency services: 1122\n• Visit nearest hospital emergency\n• For non-emergency urgent care, call our hotline: +92 300 1234567\n\nIf this is not an emergency, I can help you schedule an appointment. What's your situation?";
        }
        
        // Cost/Fees - English & Urdu
        else if (lowerMessage.includes('cost') || lowerMessage.includes('fees') || lowerMessage.includes('price') || 
                 lowerMessage.includes('qimat') || lowerMessage.includes('paise') || lowerMessage.includes('rate') || 
                 lowerMessage.includes('kitna paisa') || lowerMessage.includes('fees kitne hain') || lowerMessage.includes('qimat kya hai') ||
                 lowerMessage.includes('paise kitne lagenge') || lowerMessage.includes('charge')) {
            response = "Our consultation fees vary by specialty:\n• General Physician: Rs. 1,500\n• Gynecologist: Rs. 2,000\n• Dermatologist: Rs. 1,200\n• Pediatrician: Rs. 1,000\n• Neurologist: Rs. 2,500\n\nWe accept multiple payment methods: Cash, Stripe, EasyPaisa, and JazzCash. Would you like to book an appointment?";
        }
        
        // Appointment booking - English & Urdu
        else if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('reserve') || 
                 lowerMessage.includes('book karna') || lowerMessage.includes('appointment book karna') || 
                 lowerMessage.includes('mila karna') || lowerMessage.includes('time milana') || lowerMessage.includes('daktar se milna') ||
                 lowerMessage.includes('doctor se appointment') || lowerMessage.includes('appointment chahiye')) {
            response = "I can help you book an appointment! Please tell me:\n• What type of doctor do you need?\n• Preferred day and time?\n• Is this your first visit?\n\nOr you can visit our doctors page to see all available specialists. Which specialty are you looking for?";
        }
        
        // Find doctors
        else if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist') || lowerMessage.includes('dr.') || lowerMessage.includes('doctor sahab')) {
            response = "We have excellent doctors across various specialties:\n\n👨‍⚕️ **Available Specialists:**\n• General Physicians\n• Gynecologists\n• Dermatologists\n• Pediatricians\n• Neurologists\n• Gastroenterologists\n\nWould you like me to show you available doctors for a specific specialty, or do you have a particular health concern?";
        }
        
        // Symptoms and medical concerns
        else if (lowerMessage.includes('fever') || lowerMessage.includes('headache') || lowerMessage.includes('pain') || lowerMessage.includes('bukhar') || lowerMessage.includes('sar dard') || lowerMessage.includes('dard')) {
            response = "I understand you're experiencing symptoms. While I can provide general information, it's always best to consult with a qualified doctor for proper diagnosis and treatment.\n\n**General Advice:**\n• Rest and stay hydrated\n• Monitor your symptoms\n• If symptoms persist or worsen, see a doctor\n\nWould you like me to help you book an appointment with a general physician?";
        }
        
        // Medicine information
        else if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('dawai') || lowerMessage.includes('tablet')) {
            response = "For medication information and prescriptions, it's crucial to consult with healthcare professionals. Our doctors can provide proper guidance based on your specific condition and medical history.\n\n**Important:** Never take medication without professional medical advice. Would you like to schedule a consultation?";
        }
        
        // Working hours
        else if (lowerMessage.includes('hours') || lowerMessage.includes('timing') || lowerMessage.includes('open') || lowerMessage.includes('timing') || lowerMessage.includes('khulay') || lowerMessage.includes('waqt')) {
            response = "Our clinic hours are:\n\n📅 **Regular Hours:**\n• Monday - Friday: 9:00 AM - 8:00 PM\n• Saturday: 10:00 AM - 6:00 PM\n• Sunday: 10:00 AM - 4:00 PM\n\n🚨 **Emergency Services:** Available 24/7\n\nWould you like to book an appointment during these hours?";
        }
        
        // Contact information
        else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('rabta') || lowerMessage.includes('phone number')) {
            response = "You can reach us through:\n\n📞 **Phone:** +92 300 1234567\n📧 **Email:** info@prescription.com\n📍 **Main Address:** 123 Medical Street, Healthcare City\n\n🌐 **Online:**\n• Website: www.prescription.com\n• WhatsApp: +92 300 1234568\n\nHow would you like to contact us?";
        }
        
        // Payment methods
        else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('chukai') || lowerMessage.includes('payment method')) {
            response = "We offer multiple convenient payment methods:\n\n💳 **Digital Payments:**\n• Stripe (Credit/Debit Cards)\n• EasyPaisa\n• JazzCash\n\n💵 **Traditional:**\n• Cash Payment\n\nAll payments are secure and encrypted. You can pay online when booking or pay at the clinic. Which payment method do you prefer?";
        }
        
        // Thank you
        else if (lowerMessage.includes('thank') || lowerMessage.includes('shukria') || lowerMessage.includes('thanks') || lowerMessage.includes('meherbani')) {
            response = "You're very welcome! I'm glad I could help you. Is there anything else I can assist you with regarding your healthcare needs or our services?";
        }
        
        // Goodbye
        else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('allah hafiz') || lowerMessage.includes('khuda hafiz')) {
            response = "Goodbye! Take care of your health. Remember, I'm here 24/7 if you need any medical assistance or have questions. Stay healthy! 🌟";
        }
        
        // General conversation
        else if (lowerMessage.includes('how are you doing') || lowerMessage.includes('what\'s up') || lowerMessage.includes('kya chal raha hai')) {
            response = "I'm doing great and ready to help! I'm here to assist with any medical questions or appointment booking. What's on your mind today?";
        }
        
        // Weekend/Holiday
        else if (lowerMessage.includes('weekend') || lowerMessage.includes('holiday') || lowerMessage.includes('off day')) {
            response = "We're open on weekends with reduced hours:\n• Saturday: 10 AM - 6 PM\n• Sunday: 10 AM - 4 PM\n\nEmergency services are available 24/7. Would you like to book a weekend appointment?";
        }
        
        // Insurance
        else if (lowerMessage.includes('insurance') || lowerMessage.includes('bima') || lowerMessage.includes('takaful')) {
            response = "We accept various insurance plans. Please bring your insurance card when visiting. For specific insurance coverage questions, our billing department can help at +92 300 1234569. Would you like to know about our cash consultation fees?";
        }
        
        // Find doctors with detailed info - English & Urdu
        else if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist') || lowerMessage.includes('dr.') || 
                 lowerMessage.includes('doctor sahab') || lowerMessage.includes('daktar') || lowerMessage.includes('dr sahib') ||
                 lowerMessage.includes('doctor saheb') || lowerMessage.includes('hakeem') || lowerMessage.includes('tabib')) {
            
            // Dr. Ahmed Khan - General Physician
            if (lowerMessage.includes('ahmed khan') || lowerMessage.includes('ahmad khan') || lowerMessage.includes('dr ahmed') ||
                lowerMessage.includes('dr ahmad') || lowerMessage.includes('ahmed') || lowerMessage.includes('ahmad') ||
                lowerMessage.includes('ahmed khan se milna') || lowerMessage.includes('ahmed khan ka time') ||
                lowerMessage.includes('ahmad khan se milna') || lowerMessage.includes('ahmad khan ka time') ||
                lowerMessage.includes('ahmed doctor') || lowerMessage.includes('ahmad doctor') ||
                lowerMessage.includes('dr ahmed khan') || lowerMessage.includes('dr ahmad khan')) {
                response = "👨‍⚕️ **Dr. Ahmed Khan** - General Physician\n\n📅 **Available Times:**\n• Monday: 9:00 AM - 1:00 PM, 3:00 PM - 8:00 PM\n• Tuesday: 9:00 AM - 1:00 PM, 3:00 PM - 8:00 PM\n• Wednesday: 9:00 AM - 1:00 PM, 3:00 PM - 8:00 PM\n• Thursday: 9:00 AM - 1:00 PM, 3:00 PM - 8:00 PM\n• Friday: 9:00 AM - 1:00 PM, 3:00 PM - 8:00 PM\n• Saturday: 10:00 AM - 2:00 PM\n\n💰 **Consultation Fee:** Rs. 1,500\n📍 **Location:** DHA Medical Center, Phase 5, Lahore\n\nWould you like me to help you book an appointment with Dr. Ahmed Khan?";
            }
            
            // Dr. Fatima Zahra - Gynecologist
            else if (lowerMessage.includes('fatima') || lowerMessage.includes('zahra') || lowerMessage.includes('dr fatima') ||
                       lowerMessage.includes('fatima zahra se milna') || lowerMessage.includes('fatima ka time') ||
                       lowerMessage.includes('dr fatima zahra') || lowerMessage.includes('fatima doctor')) {
                response = "👩‍⚕️ **Dr. Fatima Zahra** - Gynecologist\n\n📅 **Available Times:**\n• Monday: 10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM\n• Tuesday: 10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM\n• Wednesday: 10:00 AM - 2:00 PM\n• Thursday: 10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM\n• Friday: 10:00 AM - 2:00 PM\n• Saturday: 11:00 AM - 3:00 PM\n\n💰 **Consultation Fee:** Rs. 2,000\n📍 **Location:** Islamabad Medical Complex, Sector F-8, Islamabad\n\nWould you like me to help you book an appointment with Dr. Fatima Zahra?";
            }
            
            // Dr. Ayesha Siddiqui - Dermatologist
            else if (lowerMessage.includes('ayesha') || lowerMessage.includes('siddiqui') || lowerMessage.includes('dr ayesha') ||
                       lowerMessage.includes('ayesha siddiqui se milna') || lowerMessage.includes('ayesha ka time') ||
                       lowerMessage.includes('dr ayesha siddiqui') || lowerMessage.includes('ayesha doctor')) {
                response = "👩‍⚕️ **Dr. Ayesha Siddiqui** - Dermatologist\n\n📅 **Available Times:**\n• Monday: 11:00 AM - 4:00 PM\n• Tuesday: 11:00 AM - 4:00 PM\n• Wednesday: 11:00 AM - 4:00 PM\n• Thursday: 11:00 AM - 4:00 PM\n• Friday: 11:00 AM - 4:00 PM\n• Saturday: 12:00 PM - 5:00 PM\n\n💰 **Consultation Fee:** Rs. 1,200\n📍 **Location:** Skin Care Clinic, Clifton, Karachi\n\nWould you like me to help you book an appointment with Dr. Ayesha Siddiqui?";
            }
            
            // Dr. Muhammad Ali - Pediatrician
            else if (lowerMessage.includes('muhammad ali') || lowerMessage.includes('m ali') || lowerMessage.includes('dr muhammad') ||
                       lowerMessage.includes('muhammad ali se milna') || lowerMessage.includes('muhammad ali ka time') ||
                       lowerMessage.includes('dr muhammad ali') || lowerMessage.includes('muhammad doctor') ||
                       lowerMessage.includes('ali doctor') || lowerMessage.includes('m ali doctor')) {
                response = "👨‍⚕️ **Dr. Muhammad Ali** - Pediatrician\n\n📅 **Available Times:**\n• Monday: 9:00 AM - 1:00 PM, 3:00 PM - 6:00 PM\n• Tuesday: 9:00 AM - 1:00 PM, 3:00 PM - 6:00 PM\n• Wednesday: 9:00 AM - 1:00 PM, 3:00 PM - 6:00 PM\n• Thursday: 9:00 AM - 1:00 PM, 3:00 PM - 6:00 PM\n• Friday: 9:00 AM - 1:00 PM\n• Saturday: 10:00 AM - 2:00 PM\n\n💰 **Consultation Fee:** Rs. 1,000\n📍 **Location:** Children's Hospital, Gulshan-e-Iqbal, Karachi\n\nWould you like me to help you book an appointment with Dr. Muhammad Ali?";
            }
            
            // Dr. Sara Hassan - Neurologist
            else if (lowerMessage.includes('sara') || lowerMessage.includes('hassan') || lowerMessage.includes('dr sara') ||
                       lowerMessage.includes('sara hassan se milna') || lowerMessage.includes('sara ka time') ||
                       lowerMessage.includes('dr sara hassan') || lowerMessage.includes('sara doctor') ||
                       lowerMessage.includes('hassan doctor')) {
                response = "👩‍⚕️ **Dr. Sara Hassan** - Neurologist\n\n📅 **Available Times:**\n• Monday: 2:00 PM - 6:00 PM\n• Tuesday: 2:00 PM - 6:00 PM\n• Wednesday: 2:00 PM - 6:00 PM\n• Thursday: 2:00 PM - 6:00 PM\n• Friday: 2:00 PM - 6:00 PM\n• Saturday: 10:00 AM - 2:00 PM\n\n💰 **Consultation Fee:** Rs. 2,500\n📍 **Location:** Neuro Care Center, Blue Area, Islamabad\n\nWould you like me to help you book an appointment with Dr. Sara Hassan?";
            }
            
            // Specialty-based responses
            else if (lowerMessage.includes('dermatologist') || lowerMessage.includes('skin') || lowerMessage.includes('jild') ||
                       lowerMessage.includes('skin doctor') || lowerMessage.includes('jild ka doctor') || lowerMessage.includes('jild specialist')) {
                response = "👩‍⚕️ **Our Dermatologists:**\n\n**Dr. Ayesha Siddiqui**\n📅 Available: Monday-Friday 11:00 AM - 4:00 PM, Saturday 12:00 PM - 5:00 PM\n💰 Fee: Rs. 1,200\n📍 Location: Skin Care Clinic, Clifton, Karachi\n\n**Dr. Sana Khan**\n📅 Available: Monday-Friday 11:00 AM - 4:00 PM\n💰 Fee: Rs. 1,200\n📍 Location: Derma Care Clinic, Johar Town, Lahore\n\nWould you like to book an appointment with one of our dermatologists?";
            }
            
            else if (lowerMessage.includes('general physician') || lowerMessage.includes('general doctor') || lowerMessage.includes('family doctor') ||
                       lowerMessage.includes('amoomi doctor') || lowerMessage.includes('family physician') || lowerMessage.includes('gp')) {
                response = "👨‍⚕️ **Our General Physicians:**\n\n**Dr. Ahmed Khan**\n📅 Available: Monday-Friday 9:00 AM - 1:00 PM, 3:00 PM - 8:00 PM, Saturday 10:00 AM - 2:00 PM\n💰 Fee: Rs. 1,500\n📍 Location: DHA Medical Center, Phase 5, Lahore\n\n**Dr. Omar Farooq**\n📅 Available: Monday-Friday 9:00 AM - 5:00 PM\n💰 Fee: Rs. 1,500\n📍 Location: Medical Center, Model Town, Lahore\n\n**Dr. Hira Tariq**\n📅 Available: Monday-Friday 9:00 AM - 5:00 PM\n💰 Fee: Rs. 1,500\n📍 Location: Family Health Clinic, Faisalabad\n\nWould you like to book an appointment with one of our general physicians?";
            }
            
            else if (lowerMessage.includes('gynecologist') || lowerMessage.includes('women doctor') || lowerMessage.includes('ladies doctor') ||
                       lowerMessage.includes('mahila doctor') || lowerMessage.includes('pregnancy') || lowerMessage.includes('women health')) {
                response = "👩‍⚕️ **Our Gynecologists:**\n\n**Dr. Fatima Zahra**\n📅 Available: Monday-Tuesday 10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM, Wednesday 10:00 AM - 2:00 PM, Thursday 10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM, Friday 10:00 AM - 2:00 PM, Saturday 11:00 AM - 3:00 PM\n💰 Fee: Rs. 2,000\n📍 Location: Islamabad Medical Complex, Sector F-8, Islamabad\n\n**Dr. Ali Raza**\n📅 Available: Monday-Friday 10:00 AM - 4:00 PM\n💰 Fee: Rs. 2,000\n📍 Location: Maternity & Child Care Hospital, Rawalpindi\n\nWould you like to book an appointment with one of our gynecologists?";
            }
            
            else if (lowerMessage.includes('pediatrician') || lowerMessage.includes('child doctor') || lowerMessage.includes('kids doctor') ||
                       lowerMessage.includes('bachon ka doctor') || lowerMessage.includes('child specialist') || lowerMessage.includes('infant doctor')) {
                response = "👨‍⚕️ **Our Pediatricians:**\n\n**Dr. Muhammad Ali**\n📅 Available: Monday-Thursday 9:00 AM - 1:00 PM, 3:00 PM - 6:00 PM, Friday 9:00 AM - 1:00 PM, Saturday 10:00 AM - 2:00 PM\n💰 Fee: Rs. 1,000\n📍 Location: Children's Hospital, Gulshan-e-Iqbal, Karachi\n\n**Dr. Hamza Malik**\n📅 Available: Monday-Friday 9:00 AM - 5:00 PM\n💰 Fee: Rs. 1,000\n📍 Location: Kids Care Hospital, Gulberg, Lahore\n\nWould you like to book an appointment with one of our pediatricians?";
            }
            
            else if (lowerMessage.includes('neurologist') || lowerMessage.includes('brain doctor') || lowerMessage.includes('nerves doctor') ||
                       lowerMessage.includes('dimagh ka doctor') || lowerMessage.includes('brain specialist') || lowerMessage.includes('neuro specialist')) {
                response = "👩‍⚕️ **Our Neurologists:**\n\n**Dr. Sara Hassan**\n📅 Available: Monday-Friday 2:00 PM - 6:00 PM, Saturday 10:00 AM - 2:00 PM\n💰 Fee: Rs. 2,500\n📍 Location: Neuro Care Center, Blue Area, Islamabad\n\n**Dr. Bilal Ahmed**\n📅 Available: Monday-Friday 2:00 PM - 6:00 PM\n💰 Fee: Rs. 2,500\n📍 Location: Aga Khan Hospital, Karachi\n\nWould you like to book an appointment with one of our neurologists?";
            }
            
            else {
                const specialties = [...new Set(doctors.map(doc => doc.speciality))];
                response = `We have excellent doctors across various specialties:\n\n👨‍⚕️ **Available Specialists:**\n• General Physicians\n• Gynecologists\n• Dermatologists\n• Pediatricians\n• Neurologists\n• Gastroenterologists\n\n**Popular Doctors:**\n• Dr. Ahmed Khan (General Physician)\n• Dr. Fatima Zahra (Gynecologist)\n• Dr. Ayesha Siddiqui (Dermatologist)\n• Dr. Muhammad Ali (Pediatrician)\n• Dr. Sara Hassan (Neurologist)\n\nWhich doctor would you like to know about or book an appointment with?`;
            }
        }
        
        // Symptoms and medical concerns - English & Urdu
        else if (lowerMessage.includes('fever') || lowerMessage.includes('headache') || lowerMessage.includes('pain') || 
                 lowerMessage.includes('bukhar') || lowerMessage.includes('sar dard') || lowerMessage.includes('dard') ||
                 lowerMessage.includes('bimar') || lowerMessage.includes('tabiyat kharab') || lowerMessage.includes('meri tabiyat theek nahi') ||
                 lowerMessage.includes('bukhar hai') || lowerMessage.includes('sar main dard') || lowerMessage.includes('badan dard') ||
                 lowerMessage.includes('pain hai') || lowerMessage.includes('allergy') || lowerMessage.includes('khansi')) {
            response = "I understand you're experiencing symptoms. While I can provide general information, it's always best to consult with a qualified doctor for proper diagnosis and treatment.\n\n**General Advice:**\n• Rest and stay hydrated\n• Monitor your symptoms\n• If symptoms persist or worsen, see a doctor\n\nWould you like me to help you book an appointment with a general physician?";
        }
        
        // Medicine information - English & Urdu
        else if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('dawai') || 
                 lowerMessage.includes('tablet') || lowerMessage.includes('dawai ka naam') || lowerMessage.includes('medicine chahiye') ||
                 lowerMessage.includes('dawai bataye') || lowerMessage.includes('tablet leni hai') || lowerMessage.includes('dawai ki information')) {
            response = "For medication information and prescriptions, it's crucial to consult with healthcare professionals. Our doctors can provide proper guidance based on your specific condition and medical history.\n\n**Important:** Never take medication without professional medical advice. Would you like to schedule a consultation?";
        }
        
        // Working hours - English & Urdu
        else if (lowerMessage.includes('hours') || lowerMessage.includes('timing') || lowerMessage.includes('open') || 
                 lowerMessage.includes('timing') || lowerMessage.includes('khulay') || lowerMessage.includes('waqt') ||
                 lowerMessage.includes('clinic kitne baje khulti hai') || lowerMessage.includes('timing kya hai') ||
                 lowerMessage.includes('khulne ka waqt') || lowerMessage.includes('band hone ka waqt')) {
            response = "Our clinic hours are:\n\n📅 **Regular Hours:**\n• Monday - Friday: 9:00 AM - 8:00 PM\n• Saturday: 10:00 AM - 6:00 PM\n• Sunday: 10:00 AM - 4:00 PM\n\n🚨 **Emergency Services:** Available 24/7\n\nWould you like to book an appointment during these hours?";
        }
        
        // Contact information - English & Urdu
        else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call') || 
                 lowerMessage.includes('rabta') || lowerMessage.includes('phone number') || lowerMessage.includes('number') ||
                 lowerMessage.includes('phone bataye') || lowerMessage.includes('contact number') || lowerMessage.includes('call karna hai') ||
                 lowerMessage.includes('phone kya hai') || lowerMessage.includes('rabta kaise karein')) {
            response = "You can reach us through:\n\n📞 **Phone:** +92 300 1234567\n📧 **Email:** info@prescription.com\n📍 **Main Address:** 123 Medical Street, Healthcare City\n\n🌐 **Online:**\n• Website: www.prescription.com\n• WhatsApp: +92 300 1234568\n\nHow would you like to contact us?";
        }
        
        // Payment methods - English & Urdu
        else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('chukai') || 
                 lowerMessage.includes('payment method') || lowerMessage.includes('paise kaise den') || lowerMessage.includes('payment karna hai') ||
                 lowerMessage.includes('online payment') || lowerMessage.includes('cash payment') || lowerMessage.includes('paisa dena hai') ||
                 lowerMessage.includes('payment options') || lowerMessage.includes('chukai ke tareeqay')) {
            response = "We offer multiple convenient payment methods:\n\n💳 **Digital Payments:**\n• Stripe (Credit/Debit Cards)\n• EasyPaisa\n• JazzCash\n\n💵 **Traditional:**\n• Cash Payment\n\nAll payments are secure and encrypted. You can pay online when booking or pay at the clinic. Which payment method do you prefer?";
        }
        
        // Thank you - English & Urdu
        else if (lowerMessage.includes('thank') || lowerMessage.includes('shukria') || lowerMessage.includes('thanks') || 
                 lowerMessage.includes('meherbani') || lowerMessage.includes('shukran') || lowerMessage.includes('bahut shukria') ||
                 lowerMessage.includes('thanks a lot') || lowerMessage.includes('bohot shukria') || lowerMessage.includes('dhanyavad')) {
            response = "You're very welcome! I'm glad I could help you. Is there anything else I can assist you with regarding your healthcare needs or our services?";
        }
        
        // Goodbye - English & Urdu
        else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('allah hafiz') || 
                 lowerMessage.includes('khuda hafiz') || lowerMessage.includes('allaha hafiz') || lowerMessage.includes('khuda hafiz') ||
                 lowerMessage.includes('allaha hafiz') || lowerMessage.includes('allah hafiz') || lowerMessage.includes('good bye') ||
                 lowerMessage.includes('fir milenge') || lowerMessage.includes('baad mein milenge') || lowerMessage.includes('phir milenge')) {
            response = "Goodbye! Take care of your health. Remember, I'm here 24/7 if you need any medical assistance or have questions. Stay healthy! 🌟";
        }
        
        // General conversation - English & Urdu
        else if (lowerMessage.includes('how are you doing') || lowerMessage.includes('what\'s up') || lowerMessage.includes('kya chal raha hai') ||
                 lowerMessage.includes('kya scene hai') || lowerMessage.includes('kya hal chal hai') || lowerMessage.includes('kia program') ||
                 lowerMessage.includes('kya baat hai') || lowerMessage.includes('sab khairiyat') || lowerMessage.includes('sab theek')) {
            response = "I'm doing great and ready to help! I'm here to assist with any medical questions or appointment booking. What's on your mind today?";
        }
        
        // Weekend/Holiday - English & Urdu
        else if (lowerMessage.includes('weekend') || lowerMessage.includes('holiday') || lowerMessage.includes('off day') ||
                 lowerMessage.includes('weekend per khulta hai') || lowerMessage.includes('holiday per clinic') || lowerMessage.includes('chutti') ||
                 lowerMessage.includes('off day hai') || lowerMessage.includes('sunday khulta hai') || lowerMessage.includes('saturday khulta hai')) {
            response = "We're open on weekends with reduced hours:\n• Saturday: 10 AM - 6 PM\n• Sunday: 10 AM - 4 PM\n\nEmergency services are available 24/7. Would you like to book a weekend appointment?";
        }
        
        // Insurance - English & Urdu
        else if (lowerMessage.includes('insurance') || lowerMessage.includes('bima') || lowerMessage.includes('takaful') ||
                 lowerMessage.includes('bima policy') || lowerMessage.includes('insurance accept karte hain') || lowerMessage.includes('bima se treatment') ||
                 lowerMessage.includes('takaful') || lowerMessage.includes('insurance card') || lowerMessage.includes('bima ka faida')) {
            response = "We accept various insurance plans. Please bring your insurance card when visiting. For specific insurance coverage questions, our billing department can help at +92 300 1234569. Would you like to know about our cash consultation fees?";
        }

        res.json({ 
            success: true, 
            response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("AI Controller Error:", error);
        res.json({ 
            success: false, 
            message: "I'm having trouble processing your request right now. Please try again later." 
        });
    }
};

// Get available doctors for AI context
const getAvailableDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ available: true }).select('name speciality degree experience fees');
        res.json({ success: true, doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json({ success: false, message: "Failed to fetch doctors" });
    }
};

export { getAIResponse, getAvailableDoctors };
