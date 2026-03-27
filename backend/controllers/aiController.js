// AI Controller with Fixed Core Logic
import doctorModel from '../models/doctorModel.js';
import ChatbotLogic from '../utils/chatbotLogic.js';

// Initialize chatbot logic
const chatbotLogic = new ChatbotLogic();

// Get doctors by specialty with availability check (FIXED)
const getDoctorsBySpecialty = async (specialty) => {
    console.log(`🔍 DEBUG: Looking for doctors with specialty: "${specialty}"`);
    
    // First, get all available doctors to debug
    const allAvailableDoctors = await doctorModel.find({ available: true });
    console.log(`🔍 DEBUG: All available doctors in DB:`, allAvailableDoctors.map(d => ({ name: d.name, speciality: d.speciality })));
    
    // Case-insensitive matching with normalization
    const normalizedTarget = specialty.toLowerCase().trim();
    console.log(`🔍 DEBUG: Normalized target specialty: "${normalizedTarget}"`);
    
    const matchedDoctors = allAvailableDoctors.filter(doctor => {
        const normalizedDbSpecialty = doctor.speciality.toLowerCase().trim();
        console.log(`🔍 DEBUG: Comparing "${normalizedDbSpecialty}" with "${normalizedTarget}"`);
        return normalizedDbSpecialty === normalizedTarget;
    });
    
    console.log(`🏥 Found ${matchedDoctors.length} available ${specialty}s`);
    console.log(`🔍 DEBUG: Matched doctors:`, matchedDoctors.map(d => d.name));
    
    return matchedDoctors;
};

// Generate session ID from request
const getSessionId = (req) => {
    const sessionId = req.headers['x-session-id'] || 
                   req.cookies?.sessionId || 
                   req.ip + '-' + Date.now();
    return sessionId;
};

// AI chatbot response handler with intelligent medical assistant behavior
const getAIResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.json({ success: false, message: "Message is required" });
        }

        console.log('\n🚀 === INTELLIGENT MEDICAL ASSISTANT ===');
        console.log(`📩 User input: "${message}"`);

        // Get or create session
        const sessionId = getSessionId(req);
        console.log(`🆔 Session ID: ${sessionId}`);
        
        // Set session ID in chatbot logic for context awareness
        chatbotLogic.setCurrentSessionId(sessionId);

        // Get all doctors for context and debug specialties
        const doctors = await doctorModel.find({});
        console.log(`👥 Total doctors in database: ${doctors.length}`);
        
        // DEBUG: Log all available specialties in database
        const availableSpecialties = [...new Set(doctors.map(d => d.speciality))];
        console.log(`🔍 DEBUG: Available specialties in DB:`, availableSpecialties);

        // Automatic language detection
        const isUrdu = /[ا-ے]/.test(message);
        console.log(`🌐 Language detected: ${isUrdu ? 'Urdu' : 'English'}`);

        // Initialize response variables
        let response = "";
        let recommendedDoctors = [];
        let detectedSpecialty = null;
        let detectedIntent = null;

        // STEP 1: DETECT INTENT (First step in processing flow)
        console.log(`\n📍 STEP 1: Detecting intent...`);
        detectedIntent = chatbotLogic.detectIntent(message);
        console.log(`🎯 Detected intent: ${detectedIntent}`);
        
        // STEP 2: MAP SYMPTOM TO SPECIALTY (Second step)
        console.log(`\n📍 STEP 2: Mapping symptom to specialty...`);
        detectedSpecialty = chatbotLogic.mapSymptomToSpecialty(message);
        console.log(`🏥 Detected specialty: ${detectedSpecialty}`);
        
        // STEP 3: FETCH DOCTORS FROM API (Third step)
        console.log(`\n📍 STEP 3: Fetching doctors from API...`);
        if (detectedSpecialty) {
            recommendedDoctors = await getDoctorsBySpecialty(detectedSpecialty);
            
            // If no doctors for this specialty, fallback to General Physician
            if (recommendedDoctors.length === 0) {
                console.log(`⚠️ No ${detectedSpecialty} available, falling back to General Physician`);
                recommendedDoctors = await getDoctorsBySpecialty('General Physician');
                detectedSpecialty = 'General Physician';
            }
        } else if (detectedIntent === 'doctor_search') {
            // For direct doctor requests, show all available doctors
            recommendedDoctors = await doctorModel.find({ available: true });
            detectedSpecialty = 'All Available Doctors';
        } else if (detectedIntent === 'unknown') {
            // Fallback to General Physician for unknown intents
            console.log(`⚠️ Unknown intent, falling back to General Physician`);
            recommendedDoctors = await getDoctorsBySpecialty('General Physician');
            detectedSpecialty = 'General Physician';
        }
        console.log(`👨‍⚕️ Doctors fetched: ${recommendedDoctors.length}`);

        // STEP 4: GENERATE INTELLIGENT RESPONSE (Fourth step)
        console.log(`\n📍 STEP 4: Generating intelligent response...`);
        
        // PRIORITY OVERRIDE: Force data-driven response if doctors and specialty exist
        if (recommendedDoctors.length > 0 && detectedSpecialty) {
            console.log(`🚀 PRIORITY OVERRIDE: Using real doctor data`);
            console.log(`🔍 DEBUG - Doctors: ${recommendedDoctors.length}`);
            console.log(`🔍 DEBUG - Specialty: ${detectedSpecialty}`);
            
            // Generate intelligent data-driven response based on intent
            if (detectedIntent === 'symptoms') {
                response = isUrdu ? 
                    `🩺 آپ کی علامات کی بنیاد پر، آپ کو ${detectedSpecialty} سے مشاورت کرنی چاہیے۔ یہاں دستیاب ڈاکٹر ہیں:\n\n${recommendedDoctors.map((doc, index) => 
                        `${index + 1}. ڈاکٹر ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ دستیاب' : '❌ غیر دستیاب'}`
                    ).join('\n\n')}\n\nکیا آپ ان میں سے کسی کے ساتھ اپائنٹمنٹ بکوانا چاہیں گے؟` :
                    `🩺 Based on your symptoms, you should consult a ${detectedSpecialty}. Here are available doctors:\n\n${recommendedDoctors.map((doc, index) => 
                        `${index + 1}. Dr. ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ Available' : '❌ Unavailable'}`
                    ).join('\n\n')}\n\nWould you like to book an appointment with any of these doctors?`;
            } else if (detectedIntent === 'doctor_search') {
                response = isUrdu ? 
                    `🩺 یہاں دستیاب ڈاکٹر ہیں:\n\n${recommendedDoctors.map((doc, index) => 
                        `${index + 1}. ڈاکٹر ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ دستیاب' : '❌ غیر دستیاب'}`
                    ).join('\n\n')}\n\nکیا آپ ان میں سے کسی کے ساتھ اپائنٹمنٹ بکوانا چاہیں گے؟` :
                    `🩺 Here are available doctors:\n\n${recommendedDoctors.map((doc, index) => 
                        `${index + 1}. Dr. ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ Available' : '❌ Unavailable'}`
                    ).join('\n\n')}\n\nWould you like to book an appointment with any of these doctors?`;
            } else if (detectedIntent === 'booking') {
                response = isUrdu ? 
                    `📅 اچھا! ${detectedSpecialty} کے لیے اپائنٹمنٹ بکوانے کے لیے، براہ کرم بتائیں کہ آپ کس ڈاکٹر کو ترجیح دیں گے؟\n\n${recommendedDoctors.map((doc, index) => 
                        `${index + 1}. ڈاکٹر ${doc.name} - ${doc.fees} روپے`
                    ).join('\n')}` :
                    `📅 Great! To book an appointment with a ${detectedSpecialty}, please let me know which doctor you prefer:\n\n${recommendedDoctors.map((doc, index) => 
                        `${index + 1}. Dr. ${doc.name} - Rs. ${doc.fees}`
                    ).join('\n')}`;
            } else {
                // Default data-driven response
                response = isUrdu ? 
                    `🩺 آپ کی علامات کی بنیاد پر، آپ کو ${detectedSpecialty} سے مشاورت کرنی چاہیے۔ یہاں دستیاب ڈاکٹر ہیں:\n\n${recommendedDoctors.map((doc, index) => 
                        `${index + 1}. ڈاکٹر ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ دستیاب' : '❌ غیر دستیاب'}`
                    ).join('\n\n')}\n\nکیا آپ ان میں سے کسی کے ساتھ اپائنٹمنٹ بکوانا چاہیں گے؟` :
                    `🩺 Based on your symptoms, you should consult a ${detectedSpecialty}. Here are available doctors:\n\n${recommendedDoctors.map((doc, index) => 
                        `${index + 1}. Dr. ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ Available' : '❌ Unavailable'}`
                    ).join('\n\n')}\n\nWould you like to book an appointment with any of these doctors?`;
            }
            
            console.log(`✅ Data-driven response generated: ${response.length} characters`);
        } else {
            // Fallback to chatbot logic only if no doctors or specialty
            console.log(`⚠️ No doctors or specialty detected, using chatbot logic`);
            response = chatbotLogic.generateResponse(sessionId, message, recommendedDoctors, isUrdu);
        }

        console.log(`💬 Generated response type: ${detectedIntent}`);
        console.log(`🏥 Final specialty: ${detectedSpecialty}`);
        console.log(`👨‍⚕️ Doctors returned: ${recommendedDoctors.length}`);
        console.log(`📝 Response length: ${response.length} characters`);
        console.log('🏁 === INTELLIGENT ASSISTANT COMPLETE ===\n');

        res.json({ 
            success: true, 
            response,
            detectedSpecialty,
            detectedIntent,
            recommendedDoctors: recommendedDoctors.map(doc => ({
                _id: doc._id,
                name: doc.name,
                speciality: doc.speciality,
                degree: doc.degree,
                fees: doc.fees,
                address: doc.address,
                available: doc.available
            })),
            sessionId: sessionId,
            detectedLanguage: isUrdu ? 'Urdu' : 'English',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ AI Controller Error:", error);
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
