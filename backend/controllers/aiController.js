// AI Controller for handling chatbot requests
import doctorModel from '../models/doctorModel.js';

// AI chatbot response handler
const getAIResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.json({ success: false, message: "Message is required" });
        }

        const lowerMessage = message.toLowerCase();
        let response = "";

        // Get doctors data for contextual responses
        const doctors = await doctorModel.find({});
        
        // Appointment booking
        if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
            response = "I can help you book an appointment! Please visit our doctors page to select a specialist, or tell me what type of doctor you need and I'll guide you there.";
        }
        
        // Find doctors by specialty
        else if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist')) {
            const specialties = [...new Set(doctors.map(doc => doc.speciality))];
            response = `We have excellent doctors across various specialties including:\n${specialties.map(spec => `• ${spec}`).join('\n')}\n\nWould you like me to show you our doctors list?`;
        }
        
        // Symptoms and medical concerns
        else if (lowerMessage.includes('fever') || lowerMessage.includes('headache') || lowerMessage.includes('pain')) {
            response = "I understand you're experiencing symptoms. While I can provide general information, it's always best to consult with a qualified doctor for proper diagnosis and treatment. Would you like me to help you book an appointment with a general physician?";
        }
        
        // Medicine information
        else if (lowerMessage.includes('medicine') || lowerMessage.includes('medication')) {
            response = "For medication information, it's important to consult with healthcare professionals. Our doctors can provide proper guidance based on your specific condition. Would you like to schedule a consultation?";
        }
        
        // Emergency
        else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
            response = "For medical emergencies, please call emergency services immediately or visit the nearest hospital emergency room. If this is not an emergency, I can help you schedule an appointment.";
        }
        
        // Contact information
        else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('address')) {
            response = "You can reach us at:\n📞 Phone: +92 300 1234567\n📧 Email: info@prescription.com\n📍 Address: 123 Medical Street, Healthcare City\n\nOr visit our contact page for more details.";
        }
        
        // Working hours
        else if (lowerMessage.includes('hours') || lowerMessage.includes('timing') || lowerMessage.includes('open')) {
            response = "Our clinic hours are:\nMonday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM\n\nEmergency services available 24/7.";
        }
        
        // Available doctors
        else if (lowerMessage.includes('available') || lowerMessage.includes('today')) {
            const availableDoctors = doctors.filter(doc => doc.available);
            if (availableDoctors.length > 0) {
                response = `Today we have ${availableDoctors.length} doctors available:\n${availableDoctors.slice(0, 3).map(doc => `• Dr. ${doc.name} - ${doc.speciality}`).join('\n')}\n\nWould you like to book an appointment?`;
            } else {
                response = "I apologize, but all our doctors are currently booked for today. Would you like to check availability for tomorrow?";
            }
        }
        
        // Default response
        else {
            response = "I'm here to help with your medical needs! You can ask me about:\n• Booking appointments\n• Finding specialists\n• General health information\n• Clinic services\n• Contact details\n\nWhat would you like to know?";
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
