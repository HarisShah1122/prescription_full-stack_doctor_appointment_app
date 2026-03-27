// Core Chatbot Logic - Fixed Implementation
class ChatbotLogic {
    constructor() {
        // Initialize symptom to specialty mapping
        this.symptomToSpecialtyMap = {
            // General Physician symptoms
            'fever': 'General Physician',
            'bukhar': 'General Physician',
            'cough': 'General Physician',
            'khansi': 'General Physician',
            'cold': 'General Physician',
            'zukam': 'General Physician',
            'flu': 'General Physician',
            'body pain': 'General Physician',
            'badan dard': 'General Physician',
            'pain': 'General Physician',
            'dard': 'General Physician',
            'weakness': 'General Physician',
            'kamzori': 'General Physician',
            'fatigue': 'General Physician',
            'thakan': 'General Physician',
            'palpitations': 'General Physician',
            'heart racing': 'General Physician',
            'checkup': 'General Physician',
            'general checkup': 'General Physician',
            'not feeling well': 'General Physician',
            'sick': 'General Physician',
            'ill': 'General Physician',
            'bimar': 'General Physician',
            
            // Neurologist symptoms
            'headache': 'Neurologist',
            'sar dard': 'Neurologist',
            'head ache': 'Neurologist',
            'head pain': 'Neurologist',
            'migraine': 'Neurologist',
            'dizziness': 'Neurologist',
            'chakar': 'Neurologist',
            'vertigo': 'Neurologist',
            'numbness': 'Neurologist',
            'sunn pan': 'Neurologist',
            'tingling': 'Neurologist',
            'seizure': 'Neurologist',
            'epilepsy': 'Neurologist',
            'memory loss': 'Neurologist',
            'yad na rahna': 'Neurologist',
            'confusion': 'Neurologist',
            'brain': 'Neurologist',
            'dimaagh': 'Neurologist',
            'stroke': 'Neurologist',
            'paralysis': 'Neurologist',
            
            // Dermatologist symptoms
            'skin': 'Dermatologist',
            'skin issues': 'Dermatologist',
            'skin problem': 'Dermatologist',
            'rash': 'Dermatologist',
            'khujli': 'Dermatologist',
            'itching': 'Dermatologist',
            'acne': 'Dermatologist',
            'pimples': 'Dermatologist',
            'muhase': 'Dermatologist',
            'allergy': 'Dermatologist',
            'allergic': 'Dermatologist',
            'allergic reaction': 'Dermatologist',
            'hair loss': 'Dermatologist',
            'hair fall': 'Dermatologist',
            'bal girna': 'Dermatologist',
            'dandruff': 'Dermatologist',
            'scalp': 'Dermatologist',
            'dry skin': 'Dermatologist',
            'oily skin': 'Dermatologist',
            'eczema': 'Dermatologist',
            'psoriasis': 'Dermatologist',
            
            // Gastroenterologist symptoms
            'stomach': 'Gastroenterologist',
            'pet': 'Gastroenterologist',
            'stomach pain': 'Gastroenterologist',
            'pet dard': 'Gastroenterologist',
            'stomach ache': 'Gastroenterologist',
            'belly pain': 'Gastroenterologist',
            'pait dard': 'Gastroenterologist',
            'indigestion': 'Gastroenterologist',
            'bad hazmi': 'Gastroenterologist',
            'digestion': 'Gastroenterologist',
            'gas': 'Gastroenterologist',
            'bloating': 'Gastroenterologist',
            'acidity': 'Gastroenterologist',
            'tezabiyat': 'Gastroenterologist',
            'heartburn': 'Gastroenterologist',
            'acid reflux': 'Gastroenterologist',
            'ulcer': 'Gastroenterologist',
            'liver': 'Gastroenterologist',
            'jiger': 'Gastroenterologist',
            'diarrhea': 'Gastroenterologist',
            'dast': 'Gastroenterologist',
            'constipation': 'Gastroenterologist',
            'qabz': 'Gastroenterologist',
            'ibs': 'Gastroenterologist',
            
            // Gynecologist symptoms
            'women health': 'Gynecologist',
            'pregnancy': 'Gynecologist',
            'pregnant': 'Gynecologist',
            'hamal': 'Gynecologist',
            'period': 'Gynecologist',
            'menstrual': 'Gynecologist',
            'mahwari': 'Gynecologist',
            'women': 'Gynecologist',
            'aurat': 'Gynecologist',
            'female': 'Gynecologist',
            'delivery': 'Gynecologist',
            'baby delivery': 'Gynecologist',
            'menopause': 'Gynecologist',
            'hormones': 'Gynecologist',
            'breast': 'Gynecologist',
            'uterus': 'Gynecologist',
            'ovaries': 'Gynecologist',
            'pcos': 'Gynecologist',
            'fibroids': 'Gynecologist',
            
            // Pediatrician symptoms
            'child': 'Pediatrician',
            'children': 'Pediatrician',
            'kid': 'Pediatrician',
            'kids': 'Pediatrician',
            'bacha': 'Pediatrician',
            'bachay': 'Pediatrician',
            'baby': 'Pediatrician',
            'infant': 'Pediatrician',
            'toddler': 'Pediatrician',
            'newborn': 'Pediatrician',
            'neonate': 'Pediatrician',
            'pediatric': 'Pediatrician',
            'pediatrics': 'Pediatrician',
            'child health': 'Pediatrician',
            'vaccination': 'Pediatrician',
            'vaccine': 'Pediatrician',
            'immunization': 'Pediatrician',
            'growth': 'Pediatrician',
            'development': 'Pediatrician',
            'milestones': 'Pediatrician',
            'colic': 'Pediatrician',
            'teething': 'Pediatrician'
        };

        // Available specialties
        this.availableSpecialties = [
            'General Physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatrician',
            'Neurologist',
            'Gastroenterologist'
        ];

        // In-memory state management (in production, use Redis/database)
        this.conversationState = new Map();
    }

    // 1. Normalize input with smart handling
    normalizeInput(message) {
        if (!message) return '';
        
        // Convert to lowercase and trim
        let normalized = message.toLowerCase().trim();
        
        // Remove extra spaces
        normalized = normalized.replace(/\s+/g, ' ');
        
        // Handle common typos and variations
        normalized = normalized.replace(/head ache/g, 'headache');
        normalized = normalized.replace(/stumach/g, 'stomach');
        normalized = normalized.replace(/skinn/g, 'skin');
        normalized = normalized.replace(/feverish/g, 'fever');
        normalized = normalized.replace(/painfull/g, 'painful');
        normalized = normalized.replace(/dizzyness/g, 'dizziness');
        
        console.log(`🔧 Normalized input: "${normalized}"`);
        return normalized;
    }
    
    // Helper method to get current session ID (for detectIntent)
    getCurrentSessionId() {
        // This will be set by the controller
        return this.currentSessionId || 'default';
    }
    
    // Set current session ID (called by controller)
    setCurrentSessionId(sessionId) {
        this.currentSessionId = sessionId;
    }

    // 2. Detect intent with flexible matching
    detectIntent(message) {
        const normalized = this.normalizeInput(message);
        
        console.log(`🔧 Normalized input: "${normalized}"`);
        
        // Check for booking intent
        const bookingKeywords = ['book', 'appointment', 'schedule', 'visit', 'buk', 'buk karna', 'apointment', 'shedul', 'timing', 'time', 'i want to see', 'want to book', 'schedule visit'];
        if (bookingKeywords.some(keyword => normalized.includes(keyword))) {
            console.log(`🎯 Detected intent: booking`);
            return 'booking';
        }
        
        // Check for follow-up indicators
        const followUpIndicators = ['yes', 'yeah', 'yup', 'haan', 'ji haan', 'which', 'konsa', 'show me', 'dikhaein', 'the first one', 'first', 'second', 'third', 'that one', 'wo wala', 'yes which', 'yes show'];
        const state = this.getState(this.getCurrentSessionId());
        const isFollowUp = followUpIndicators.some(indicator => 
            normalized.includes(indicator)
        ) || (state.lastSpecialty && normalized.includes(state.lastSpecialty.toLowerCase()));
        
        if (isFollowUp) {
            console.log(`🎯 Detected intent: follow_up`);
            return 'follow_up';
        }
        
        // Check for direct doctor requests
        const doctorRequestKeywords = ['doctor list', 'show doctors', 'doctors', 'suggest doctor', 'health issues', 'medical help', 'need doctor', 'doctor chahiye', 'doctor dikhayein', 'i want doctor', 'doctor timing', 'doctor time'];
        if (doctorRequestKeywords.some(keyword => normalized.includes(keyword))) {
            console.log(`🎯 Detected intent: doctor_search`);
            return 'doctor_search';
        }
        
        // Check for specialty requests
        const specialties = ['neurologist', 'dermatologist', 'gynecologist', 'pediatrician', 'gastroenterologist', 'general physician', 'cardiologist', 'orthopedic', 'ent'];
        const specialtyFound = specialties.find(specialty => 
            normalized.includes(specialty.toLowerCase()) || normalized.includes(specialty.replace(' ', ''))
        );
        
        if (specialtyFound) {
            console.log(`🎯 Detected intent: specialty_request`);
            return 'specialty_request';
        }
        
        // Check for symptoms (most important)
        const hasSymptom = this.hasSymptoms(normalized);
        if (hasSymptom) {
            console.log(`🎯 Detected intent: symptoms`);
            return 'symptoms';
        }
        
        // Check for general inquiries
        const generalKeywords = ['hello', 'hi', 'hey', 'salam', 'assalam', 'assalam o alaikum', 'good morning', 'good evening', 'how are you', 'help', 'assistant', 'bot'];
        if (generalKeywords.some(keyword => normalized.includes(keyword))) {
            console.log(`🎯 Detected intent: general_inquiry`);
            return 'general_inquiry';
        }
        
        console.log(`🎯 Detected intent: unknown`);
        return 'unknown';
    }

    // 3. Map symptom to specialty
    mapSymptomToSpecialty(message) {
        const normalized = this.normalizeInput(message);
        
        // Check for direct specialty mention first
        for (const specialty of this.availableSpecialties) {
            if (normalized.includes(specialty.toLowerCase())) {
                console.log(`🏥 Direct specialty detected: ${specialty}`);
                return specialty;
            }
        }
        
        // Check for symptom mapping
        for (const [symptom, specialty] of Object.entries(this.symptomToSpecialtyMap)) {
            if (normalized.includes(symptom)) {
                console.log(`🏥 Symptom "${symptom}" mapped to: ${specialty}`);
                return specialty;
            }
        }
        
        console.log(`🏥 No symptom mapping found`);
        return null;
    }
    
    // Helper method to check if message contains symptoms
    hasSymptoms(normalized) {
        for (const symptom of Object.keys(this.symptomToSpecialtyMap)) {
            if (normalized.includes(symptom)) {
                console.log(`🏥 Found symptom: "${symptom}"`);
                return true;
            }
        }
        console.log(`🏥 No symptoms found in message`);
        return false;
    }

    // 4. Get conversation state
    getState(sessionId) {
        if (!this.conversationState.has(sessionId)) {
            this.conversationState.set(sessionId, {
                lastIntent: null,
                lastSymptom: null,
                lastSpecialty: null,
                lastDoctors: [],
                conversationStage: 'initial'
            });
        }
        return this.conversationState.get(sessionId);
    }

    // 5. Update conversation state
    updateState(sessionId, intent, symptom, specialty, doctors) {
        const state = this.getState(sessionId);
        
        state.lastIntent = intent;
        if (symptom) state.lastSymptom = symptom;
        if (specialty) state.lastSpecialty = specialty;
        if (doctors) state.lastDoctors = doctors;
        
        // Update conversation stage CORRECTLY
        if (intent === 'symptoms' && specialty) {
            state.conversationStage = 'symptoms_detected';
        } else if (intent === 'booking' && state.lastSpecialty) {
            state.conversationStage = 'booking_intent';
        } else if (doctors && doctors.length > 0) {
            state.conversationStage = 'doctors_shown';
        } else if (intent === 'general_inquiry') {
            // Keep stage as 'initial' for general inquiries
            state.conversationStage = state.conversationStage || 'initial';
        } else if (intent === 'follow_up') {
            // Keep current stage for follow-ups
            // Don't change stage for follow-ups
        } else {
            // Default to initial for unknown intents
            if (!state.lastSpecialty) {
                state.conversationStage = 'initial';
            }
        }
        
        console.log(`📝 Updated state for session ${sessionId}:`, {
            intent: state.lastIntent,
            symptom: state.lastSymptom,
            specialty: state.lastSpecialty,
            stage: state.conversationStage
        });
    }

    // 6. Check if follow-up
    isFollowUp(sessionId, message) {
        const state = this.getState(sessionId);
        const normalized = this.normalizeInput(message);
        
        // Follow-up indicators
        const followUpIndicators = [
            'yes', 'no', 'okay', 'ok', 'sure', 'which', 'what about', 'show me',
            'han', 'ji han', 'acha', 'theek hai', 'konsa', 'kaun sa', 'the first one',
            'second one', 'third one', 'first', 'second', 'third'
        ];
        
        const isFollowUp = followUpIndicators.some(indicator => 
            normalized.includes(indicator)
        ) || (state.lastSpecialty && normalized.includes(state.lastSpecialty.toLowerCase()));
        
        console.log(`🔄 Is follow-up: ${isFollowUp}`);
        return isFollowUp;
    }

    // 7. Generate response - STRICT DATA-DRIVEN APPROACH
    generateResponse(sessionId, message, doctors, isUrdu) {
        const intent = this.detectIntent(message);
        const specialty = this.mapSymptomToSpecialty(message);
        const isFollowUp = this.isFollowUp(sessionId, message);
        const state = this.getState(sessionId);
        
        console.log(`🚀 Processing message: "${message}"`);
        console.log(`📩 User input: "${message}"`);
        console.log(`🎯 Detected intent: ${intent}`);
        console.log(`🏥 Detected specialty: ${specialty}`);
        console.log(`🔄 Follow-up: ${isFollowUp}`);
        console.log(`📊 State: ${state.conversationStage}`);
        
        // DEBUG: Log data being used
        console.log(`🔍 DEBUG - Doctors passed to generateResponse: ${doctors.length}`);
        console.log(`🔍 DEBUG - State lastDoctors: ${state.lastDoctors.length}`);
        console.log(`🔍 DEBUG - State lastSpecialty: ${state.lastSpecialty}`);
        
        // PRIORITY OVERRIDE: Force data-driven response if doctors and specialty exist
        if (doctors.length > 0 && specialty) {
            console.log(`🚀 PRIORITY OVERRIDE: Using real doctor data in generateResponse`);
            console.log(`🔍 DEBUG - Doctors: ${doctors.length}, Specialty: ${specialty}`);
            
            // Generate immediate data-driven response
            const response = isUrdu ? 
                `🩺 آپ کی علامات کی بنیاد پر، آپ کو ${specialty} سے مشاورت کرنی چاہیے۔ یہاں دستیاب ڈاکٹر ہیں:\n\n${doctors.map((doc, index) => 
                    `${index + 1}. ڈاکٹر ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ دستیاب' : '❌ غیر دستیاب'}`
                ).join('\n\n')}\n\nکیا آپ ان میں سے کسی کے ساتھ اپائنٹمنٹ بکوانا چاہیں گے؟` :
                `🩺 Based on your symptoms, you should consult a ${specialty}. Here are available doctors:\n\n${doctors.map((doc, index) => 
                    `${index + 1}. Dr. ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ Available' : '❌ Unavailable'}`
                ).join('\n\n')}\n\nWould you like to book an appointment with any of these doctors?`;
            
            console.log(`✅ Data-driven response generated: ${response.length} characters`);
            
            // Update state before returning
            this.updateState(sessionId, intent, message, specialty, doctors);
            
            return response;
        }
        
        // Update state
        this.updateState(sessionId, intent, message, specialty, doctors);
        
        // STEP 1: Handle booking intent (highest priority)
        if (intent === 'booking' && state.lastSpecialty) {
            console.log(`📍 STEP 1: Handling booking intent`);
            return this.generateBookingResponse(state, isUrdu);
        }
        
        // STEP 2: Handle follow-up messages (second priority)
        if (isFollowUp && state.lastDoctors.length > 0) {
            console.log(`📍 STEP 2: Handling follow-up message`);
            return this.generateFollowUpResponse(state, isUrdu);
        }
        
        // STEP 3: Handle symptom detection (third priority)
        if (intent === 'symptoms' && specialty) {
            console.log(`📍 STEP 3: Handling symptom detection`);
            console.log(`🔍 DEBUG - Using doctors parameter: ${doctors.length} doctors`);
            return this.generateSymptomResponse(specialty, doctors, isUrdu);
        }
        
        // STEP 4: Handle specialty request (fourth priority)
        if (intent === 'specialty_request' && specialty) {
            console.log(`📍 STEP 4: Handling specialty request`);
            console.log(`🔍 DEBUG - Using doctors parameter: ${doctors.length} doctors`);
            return this.generateSpecialtyResponse(specialty, doctors, isUrdu);
        }
        
        // STEP 5: Handle doctor search (fifth priority)
        if (intent === 'doctor_search') {
            console.log(`📍 STEP 5: Handling doctor search`);
            return this.generateDoctorSearchResponse(message, doctors, isUrdu);
        }
        
        // STEP 6: Handle time inquiry (sixth priority)
        if (message.toLowerCase().includes('time') || message.toLowerCase().includes('waqt') || message.toLowerCase().includes('tarikh')) {
            console.log(`📍 STEP 6: Handling time inquiry`);
            const now = new Date();
            return isUrdu ? 
                `موجودہ وقت ${now.toLocaleTimeString()} ہے۔ کلنک پیر سے جمعہ 9 صبح سے 8 شام تک کھلتا ہے۔` :
                `The current time is ${now.toLocaleTimeString()}. Our clinic is open Monday-Friday 9 AM-8 PM.`;
        }
        
        // STEP 7: Handle emergency (seventh priority)
        if (message.toLowerCase().includes('emergency') || message.toLowerCase().includes('fori') || message.toLowerCase().includes('jaldi')) {
            console.log(`📍 STEP 7: Handling emergency inquiry`);
            return isUrdu ? 
                "🚨 ایمرجنسی کے لیے فوری طور پر 1122 کو کال کریں۔ اگر یہ ایمرجنسی نہیں ہے، تو میں آپ کی علامات کی بنیاد پر مناسب ڈاکٹر تجویز کر سکتا ہوں۔" :
                "🚨 For emergencies, call 1122 immediately. If not an emergency, I can recommend the right doctor based on your symptoms.";
        }
        
        // STEP 8: Handle thank you (eighth priority)
        if (message.toLowerCase().includes('thank') || message.toLowerCase().includes('shukria') || message.toLowerCase().includes('meherbani')) {
            console.log(`📍 STEP 8: Handling thank you`);
            return isUrdu ? 
                "آپ کا بہت شکریہ! کیا اور کوئی مدد چاہیے؟" :
                "You're very welcome! Is there anything else I can help you with?";
        }
        
        // STEP 9: Handle goodbye (ninth priority)
        if (message.toLowerCase().includes('bye') || message.toLowerCase().includes('allah hafiz') || message.toLowerCase().includes('khuda hafiz')) {
            console.log(`📍 STEP 9: Handling goodbye`);
            return isUrdu ? 
                "اللہ حافظ! آپ اپنی صحت کا خیال رکھیں۔ میں ہر وقت آپ کی خدمت میں موجود ہوں۔" :
                "Goodbye! Take care of your health. I'm here 24/7 if you need help.";
        }
        
        // STEP 10: Handle hello/greeting ONLY on first message of session
        if ((message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi') || message.toLowerCase().includes('assalam') || message.toLowerCase().includes('salam')) && state.conversationStage === 'initial') {
            console.log(`📍 STEP 10: Handling initial greeting`);
            return isUrdu ? 
                "السلام علیکم! میں آپ کی علامات کی بنیاد پر مناسب ڈاکٹر تلاش کر سکتا ہوں۔ آپ کی علامات کیا ہیں؟" :
                "Hello! I can help you find the right doctor based on your symptoms. What symptoms are you experiencing?";
        }
        
        // STEP 11: FINAL FALLBACK - ONLY if ALL above fail
        console.log(`📍 STEP 11: FINAL FALLBACK - no other intent matched`);
        console.log(`⚠️ Using fallback response - no other intent matched`);
        console.log(`🔍 DEBUG - Final check - Intent: ${intent}, Specialty: ${specialty}, Doctors: ${doctors.length}`);
        return this.generateFallbackResponse(isUrdu);
    }

    // Generate follow-up response
    generateFollowUpResponse(state, isUrdu) {
        const doctors = state.lastDoctors;
        const specialty = state.lastSpecialty;
        
        if (isUrdu) {
            return `🩺 ${specialty} کے لیے یہ دستیاب ڈاکٹر ہیں:\n\n${doctors.map((doc, index) => 
                `${index + 1}. ڈاکٹر ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ دستیاب' : '❌ غیر دستیاب'}`
            ).join('\n\n')}\n\nکیا آپ ان میں سے کسی کے ساتھ اپائنٹمنٹ بکوانا چاہیں گے؟`;
        } else {
            return `🩺 Here are the available ${specialty}s:\n\n${doctors.map((doc, index) => 
                `${index + 1}. Dr. ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ Available' : '❌ Unavailable'}`
            ).join('\n\n')}\n\nWould you like to book an appointment with any of these doctors?`;
        }
    }

    // Generate booking response
    generateBookingResponse(state, isUrdu) {
        const doctors = state.lastDoctors;
        const specialty = state.lastSpecialty;
        
        if (isUrdu) {
            return `📅 اچھا! ${specialty} کے لیے اپائنٹمنٹ بکوانے کے لیے، براہ کرم بتائیں کہ آپ کس ڈاکٹر کو ترجیح دیں گے؟\n\n${doctors.map((doc, index) => 
                `${index + 1}. ڈاکٹر ${doc.name} - ${doc.fees} روپے`
            ).join('\n')}`;
        } else {
            return `📅 Great! To book an appointment with a ${specialty}, please let me know which doctor you prefer:\n\n${doctors.map((doc, index) => 
                `${index + 1}. Dr. ${doc.name} - Rs. ${doc.fees}`
            ).join('\n')}`;
        }
    }

    // Generate symptom response
    generateSymptomResponse(specialty, doctors, isUrdu) {
        if (doctors.length === 0) {
            return isUrdu ? 
                `⚠️ ${specialty} کے لیے فی الحال کوئی دستیاب ڈاکٹر نہیں ہیں۔ میں آپ کو جنرل فزیشن تجویز کرتا ہوں۔` :
                `⚠️ No ${specialty} available at the moment. I recommend consulting a General Physician.`;
        }
        
        if (isUrdu) {
            return `🩺 آپ کی علامات کی بنیاد پر، آپ کو ${specialty} سے مشاورت کرنی چاہیے۔ یہاں دستیاب ڈاکٹر ہیں:\n\n${doctors.map((doc, index) => 
                `${index + 1}. ڈاکٹر ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ دستیاب' : '❌ غیر دستیاب'}`
            ).join('\n\n')}\n\nکیا آپ ان میں سے کسی کے ساتھ اپائنٹمنٹ بکوانا چاہیں گے؟`;
        } else {
            return `🩺 Based on your symptoms, you should consult a ${specialty}. Here are available doctors:\n\n${doctors.map((doc, index) => 
                `${index + 1}. Dr. ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ Available' : '❌ Unavailable'}`
            ).join('\n\n')}\n\nWould you like to book an appointment with any of these doctors?`;
        }
    }

    // Generate specialty response
    generateSpecialtyResponse(specialty, doctors, isUrdu) {
        return this.generateSymptomResponse(specialty, doctors, isUrdu);
    }

    // Generate doctor search response
    generateDoctorSearchResponse(message, doctors, isUrdu) {
        const specialties = [...new Set(doctors.map(doc => doc.speciality))];
        
        if (isUrdu) {
            return `ہمارے پاس ان سپیشلٹیز کے ڈاکٹر ہیں:\n${specialties.map(spec => `• ${spec}`).join('\n')}\n\nآپ اپنی علامات بتائیں، میں آپ کے لیے مناسب ڈاکٹر تجویز کروں گا۔`;
        } else {
            return `We have doctors across these specialties:\n${specialties.map(spec => `• ${spec}`).join('\n')}\n\nPlease tell me your symptoms, and I'll recommend the right doctor for you.`;
        }
    }

    // Generate fallback response - ONLY used as last resort
    generateFallbackResponse(isUrdu) {
        if (isUrdu) {
            return "میں آپ کی علامات کی بنیاد پر مناسب ڈاکٹر تجویز کر سکتا ہوں! براہ کرم اپنی علامات بتائیں۔";
        } else {
            return "I can recommend the right doctor based on your symptoms! Please tell me your symptoms.";
        }
    }

    // Clear session state
    clearState(sessionId) {
        this.conversationState.delete(sessionId);
        console.log(`🗑️ Cleared state for session: ${sessionId}`);
    }
}

export default ChatbotLogic;
