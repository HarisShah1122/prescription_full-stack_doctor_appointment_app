// AI Controller for handling chatbot requests
import doctorModel from '../models/doctorModel.js';

// AI chatbot response handler with automatic language detection
const getAIResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.json({ success: false, message: "Message is required" });
        }

        // Get doctors data for contextual responses
        const doctors = await doctorModel.find({});
        
        // Automatic language detection using Unicode characters
        const isUrdu = /[ا-ے]/.test(message);
        const isMixed = /[ا-ے]/.test(message) && /[a-zA-Z]/.test(message);
        
        let response = "";
        const lowerMessage = message.toLowerCase();

        // Smart responses with automatic language detection
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('assalam') || lowerMessage.includes('salam')) {
            response = isUrdu ? 
                "السلام علیکم! پریسکریپشن میڈیکل سنٹر میں خوش آمدید۔ میں آپ کی میڈیکل اپائنٹمنٹس اور صحت کے سوالات میں مدد کرنے کے لیے ہوں۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟" :
                "Hello! Welcome to Prescription Medical Center. I'm here to help you with medical appointments and health questions. How can I assist you today?";
        }
        
        else if (lowerMessage.includes('how are you') || lowerMessage.includes('kese ho') || lowerMessage.includes('kia haal hai')) {
            response = isUrdu ? 
                "میں بہت اچھا ہوں، شکریہ! میں آپ کی میڈیکل سوالات کے جواب دینے کے لیے ہر وقت موجود ہوں۔ آپ مجھ سے کیا پوچھنا چاہیں گے؟" :
                "I'm doing great, thank you! I'm here 24/7 to help you with any medical or health-related questions. What can I help you with today?";
        }
        
        else if (lowerMessage.includes('time') || lowerMessage.includes('waqt') || lowerMessage.includes('tarikh')) {
            const now = new Date();
            response = isUrdu ? 
                `موجودہ وقت ${now.toLocaleTimeString()} ہے۔ کلنک پیر سے جمعہ 9 صبح سے 8 شام تک کھلتا ہے۔` :
                `The current time is ${now.toLocaleTimeString()}. Our clinic is open Monday-Friday 9 AM-8 PM.`;
        }
        
        else if (lowerMessage.includes('emergency') || lowerMessage.includes('fori') || lowerMessage.includes('jaldi')) {
            response = isUrdu ? 
                "🚨 ایمرجنسی کے لیے فوری طور پر 1122 کو کال کریں۔ اگر یہ ایمرجنسی نہیں ہے، تو میں آپ کی اپائنٹمنٹ شیڈول کر سکتا ہوں۔" :
                "🚨 For emergencies, call 1122 immediately. If not an emergency, I can help schedule an appointment.";
        }
        
        // Doctor queries with language detection
        else if (lowerMessage.includes('doctor') || lowerMessage.includes('daktar') || lowerMessage.includes('dr.')) {
            
            if (lowerMessage.includes('ahmed') || lowerMessage.includes('ahmad')) {
                const doctor = doctors.find(d => d.name.toLowerCase().includes('ahmed'));
                if (doctor) {
                    response = isUrdu ? 
                        `👨‍⚕️ ڈاکٹر ${doctor.name} - ${doctor.speciality}\n📅 دستاب: پیر سے جمعہ 9 صبح - 8 شام\n💰 فی: Rs. ${doctor.fees}\n📍 مقام: ${doctor.address.line1}\n\nکیا آپ اپائنٹمنٹ بکوانا چاہیں گے؟` :
                        `👨‍⚕️ Dr. ${doctor.name} - ${doctor.speciality}\n📅 Available: Monday-Friday 9 AM-8 PM\n💰 Fee: Rs. ${doctor.fees}\n📍 Location: ${doctor.address.line1}\n\nWould you like to book an appointment?`;
                }
            }
            
            if (!response) {
                const specialties = [...new Set(doctors.map(doc => doc.speciality))];
                response = isUrdu ? 
                    `ہمارے پاس مختلف سپیشلٹیز کے ڈاکٹر ہیں:\n${specialties.map(spec => `• ${spec}`).join('\n')}\n\nآپ کس سپیشلٹی کے لیے ڈاکٹر تلاش کرنا چاہیں گے؟` :
                    `We have doctors across various specialties:\n${specialties.map(spec => `• ${spec}`).join('\n')}\n\nWhich specialty are you looking for?`;
            }
        }
        
        else if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('mila karna')) {
            response = isUrdu ? 
                "میں آپ کی اپائنٹمنٹ بکوانے میں مدد کر سکتا ہوں! آپ کو کس قسم کا ڈاکٹر چاہیے؟" :
                "I can help you book an appointment! What type of doctor do you need?";
        }
        
        else if (lowerMessage.includes('fever') || lowerMessage.includes('bukhar') || lowerMessage.includes('sar dard')) {
            response = isUrdu ? 
                "سمجھتا ہوں کہ آپ علامات سے گزر رہے ہیں۔ صحیح تشخیص کے لیے ڈاکٹر سے مشورہ کریں۔ کیا میں آپ کی اپائنٹمنٹ بکوا دوں؟" :
                "I understand you're experiencing symptoms. For proper diagnosis, please consult a doctor. Would you like me to book an appointment?";
        }
        
        else if (lowerMessage.includes('thank') || lowerMessage.includes('shukria') || lowerMessage.includes('meherbani')) {
            response = isUrdu ? 
                "آپ کا بہت شکریہ! کیا اور کوئی مدد چاہیے؟" :
                "You're very welcome! Is there anything else I can help you with?";
        }
        
        else if (lowerMessage.includes('bye') || lowerMessage.includes('allah hafiz') || lowerMessage.includes('khuda hafiz')) {
            response = isUrdu ? 
                "اللہ حافظ! آپ اپنی صحت کا خیال رکھیں۔ میں ہر وقت آپ کی خدمت میں موجود ہوں۔" :
                "Goodbye! Take care of your health. I'm here 24/7 if you need help.";
        }
        
        // Default response with language detection
        else {
            response = isUrdu ? 
                "میں آپ کی میڈیکل سوالات میں مدد کرنے کے لیے ہوں! آپ مجھ سے اپائنٹمنٹ، ڈاکٹر کی معلومات، یا صحت سے متعلق کچھ بھی پوچھ سکتے ہیں۔" :
                "I'm here to help with your medical questions! You can ask me about appointments, doctor information, or health-related topics.";
        }

        res.json({ 
            success: true, 
            response,
            detectedLanguage: isUrdu ? 'Urdu' : 'English',
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
