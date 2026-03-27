// Conversation Context Manager for maintaining chat state
class ConversationContext {
    constructor() {
        // In production, this would use Redis or database
        // For now, using in-memory storage with session-based approach
        this.sessions = new Map();
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    }

    // Initialize or get existing session
    getSession(sessionId) {
        const session = this.sessions.get(sessionId);
        
        if (!session) {
            // Create new session
            const newSession = {
                id: sessionId,
                lastActivity: Date.now(),
                context: {
                    lastSymptoms: [],
                    lastSpecialty: null,
                    lastDoctors: [],
                    conversationStage: 'initial', // initial, symptoms_detected, doctors_shown, booking_intent
                    userIntent: null, // symptoms, booking, inquiry, general
                    detectedLanguage: null,
                    previousMessages: []
                }
            };
            this.sessions.set(sessionId, newSession);
            return newSession;
        }
        
        // Update last activity
        session.lastActivity = Date.now();
        
        // Clean old sessions periodically
        this.cleanupOldSessions();
        
        return session;
    }

    // Update session context with new message and analysis
    updateContext(sessionId, message, analysisResult, detectedSpecialty, recommendedDoctors) {
        const session = this.getSession(sessionId);
        const context = session.context;
        
        // Add message to history
        context.previousMessages.push({
            message: message,
            timestamp: Date.now(),
            detectedSpecialty: detectedSpecialty,
            analysisResult: analysisResult
        });
        
        // Keep only last 10 messages
        if (context.previousMessages.length > 10) {
            context.previousMessages = context.previousMessages.slice(-10);
        }
        
        // Update symptoms if detected
        if (analysisResult && analysisResult.matchedKeywords && analysisResult.matchedKeywords.length > 0) {
            context.lastSymptoms = analysisResult.matchedKeywords;
            context.lastSpecialty = detectedSpecialty;
            context.userIntent = 'symptoms';
            context.conversationStage = 'symptoms_detected';
        }
        
        // Update doctors if provided
        if (recommendedDoctors && recommendedDoctors.length > 0) {
            context.lastDoctors = recommendedDoctors;
            context.conversationStage = 'doctors_shown';
        }
        
        // Detect language
        if (/[ا-ے]/.test(message)) {
            context.detectedLanguage = 'Urdu';
        } else {
            context.detectedLanguage = 'English';
        }
        
        // Detect booking intent
        const bookingKeywords = ['book', 'appointment', 'bukwan', 'mila karna', 'schedule', 'reserve'];
        if (bookingKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            context.userIntent = 'booking';
            if (context.lastSpecialty) {
                context.conversationStage = 'booking_intent';
            }
        }
        
        // Detect general inquiries
        const inquiryKeywords = ['hello', 'hi', 'salam', 'assalam', 'time', 'help', 'how are you'];
        if (inquiryKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            context.userIntent = 'inquiry';
        }
    }

    // Check if this is a follow-up message
    isFollowUp(sessionId, message) {
        const session = this.getSession(sessionId);
        const context = session.context;
        
        // Check for follow-up indicators
        const followUpIndicators = [
            'yes', 'no', 'okay', 'ok', 'sure', 'which', 'what about', 'show me', 
            'han', 'ji han', 'acha', 'theek hai', ' konsa', 'kaun sa'
        ];
        
        const isFollowUp = followUpIndicators.some(indicator => 
            message.toLowerCase().includes(indicator)
        );
        
        // Also check if user is asking about previous specialty
        const specialtyMention = context.lastSpecialty && 
            message.toLowerCase().includes(context.lastSpecialty.toLowerCase());
        
        return isFollowUp || specialtyMention;
    }

    // Get context for response generation
    getContext(sessionId) {
        const session = this.getSession(sessionId);
        return session.context;
    }

    // Generate contextual response based on conversation state
    generateContextualResponse(sessionId, message, analysisResult, detectedSpecialty, recommendedDoctors, isUrdu) {
        const context = this.getContext(sessionId);
        const isFollowUp = this.isFollowUp(sessionId, message);
        
        // Handle general inquiries first
        if (analysisResult.method === 'general_inquiry') {
            if (isUrdu) {
                return "السلام علیکم! میں آپ کی علامات کی بنیاد پر مناسب ڈاکٹر تلاش کر سکتا ہوں۔ آپ کی علامات کیا ہیں؟";
            } else {
                return "Hello! I can help you find the right doctor based on your symptoms. What symptoms are you experiencing?";
            }
        }
        
        // Handle follow-up messages
        if (isFollowUp && context.conversationStage === 'doctors_shown' && context.lastDoctors.length > 0) {
            return this.handleDoctorFollowUp(context, isUrdu);
        }
        
        // Handle booking intent
        if (context.userIntent === 'booking' && context.lastSpecialty) {
            return this.handleBookingIntent(context, isUrdu);
        }
        
        // Handle specialty-specific follow-up
        if (isFollowUp && context.lastSpecialty && context.lastDoctors.length > 0) {
            return this.handleDoctorFollowUp(context, isUrdu);
        }
        
        // Default response based on current analysis
        return this.generateStandardResponse(analysisResult, detectedSpecialty, recommendedDoctors, isUrdu, context);
    }

    // Handle follow-up about doctors
    handleDoctorFollowUp(context, isUrdu) {
        const doctors = context.lastDoctors;
        const specialty = context.lastSpecialty;
        
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

    // Handle booking intent
    handleBookingIntent(context, isUrdu) {
        if (isUrdu) {
            return `📅 اچھا! ${context.lastSpecialty} کے لیے اپائنٹمنٹ بکوانے کے لیے، براہ کرم بتائیں کہ آپ کس ڈاکٹر کو ترجیح دیں گے؟\n\n${context.lastDoctors.map((doc, index) => 
                `${index + 1}. ڈاکٹر ${doc.name} - ${doc.fees} روپے`
            ).join('\n')}`;
        } else {
            return `📅 Great! To book an appointment with a ${context.lastSpecialty}, please let me know which doctor you prefer:\n\n${context.lastDoctors.map((doc, index) => 
                `${index + 1}. Dr. ${doc.name} - Rs. ${doc.fees}`
            ).join('\n')}`;
        }
    }

    // Handle specialty-specific follow-up
    handleSpecialtyFollowUp(context, isUrdu) {
        if (isUrdu) {
            return `🩺 آپ ${context.lastSpecialty} کے لیے ڈاکٹروں کی تلاش میں تھے۔ کیا آپ ان ڈاکٹروں کو دوبارہ دیکھنا چاہیں گے؟`;
        } else {
            return `🩺 You were looking for ${context.lastSpecialty}s. Would you like to see the available doctors again?`;
        }
    }

    // Generate standard response
    generateStandardResponse(analysisResult, detectedSpecialty, recommendedDoctors, isUrdu, context) {
        if (detectedSpecialty && recommendedDoctors.length > 0) {
            const symptoms = analysisResult.matchedKeywords.join(', ');
            
            if (isUrdu) {
                return `🩺 آپ کی علامات (${symptoms}) کی بنیاد پر، آپ کو ${detectedSpecialty} سے مشاورت کرنی چاہیے۔ یہاں دستیاب ڈاکٹر ہیں:\n\n${recommendedDoctors.map((doc, index) => 
                    `${index + 1}. ڈاکٹر ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ دستیاب' : '❌ غیر دستیاب'}`
                ).join('\n\n')}\n\nکیا آپ ان میں سے کسی کے ساتھ اپائنٹمنٹ بکوانا چاہیں گے؟`;
            } else {
                return `🩺 Based on your symptoms (${symptoms}), you should consult a ${detectedSpecialty}. Here are available doctors:\n\n${recommendedDoctors.map((doc, index) => 
                    `${index + 1}. Dr. ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ Available' : '❌ Unavailable'}`
                ).join('\n\n')}\n\nWould you like to book an appointment with any of these doctors?`;
            }
        }
        
        // Fallback to general physician
        if (analysisResult.method === 'fallback_to_general') {
            if (isUrdu) {
                return `🩺 آپ کی علامات کی بنیاد پر، میں آپ کو جنرل فزیشن تجویز کرتا ہوں۔ وہ آپ کی علامات کی تشخیص کر سکتے ہیں اور اگر ضرورت ہو تو آپ کو متخصص تک پہنچا سکتے ہیں۔\n\n${recommendedDoctors.map((doc, index) => 
                    `${index + 1}. ڈاکٹر ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ دستیاب' : '❌ غیر دستیاب'}`
                ).join('\n\n')}\n\nکیا آپ ان میں سے کسی کے ساتھ اپائنٹمنٹ بکوانا چاہیں گے؟`;
            } else {
                return `🩺 Based on your description, I recommend consulting a General Physician. They can assess your symptoms and refer you to a specialist if needed.\n\n${recommendedDoctors.map((doc, index) => 
                    `${index + 1}. Dr. ${doc.name}\n   🏥 ${doc.speciality}\n   🎓 ${doc.degree}\n   💰 Rs. ${doc.fees}\n   📍 ${doc.address?.line1 || 'Medical Center'}\n   ${doc.available ? '✅ Available' : '❌ Unavailable'}`
                ).join('\n\n')}\n\nWould you like to book an appointment with any of these doctors?`;
            }
        }
        
        // General inquiry response
        if (analysisResult.method === 'general_inquiry') {
            if (isUrdu) {
                return "السلام علیکم! میں آپ کی علامات کی بنیاد پر مناسب ڈاکٹر تلاش کر سکتا ہوں۔ آپ کی علامات کیا ہیں؟";
            } else {
                return "Hello! I can help you find the right doctor based on your symptoms. What symptoms are you experiencing?";
            }
        }
        
        // Default response
        if (isUrdu) {
            return "میں آپ کی علامات کی بنیاد پر مناسب ڈاکٹر تجویز کر سکتا ہوں! براہ کرم اپنی علامات بتائیں۔";
        } else {
            return "I can recommend the right doctor based on your symptoms! Please tell me your symptoms.";
        }
    }

    // Clean up old sessions
    cleanupOldSessions() {
        const now = Date.now();
        for (const [sessionId, session] of this.sessions.entries()) {
            if (now - session.lastActivity > this.sessionTimeout) {
                this.sessions.delete(sessionId);
            }
        }
    }

    // Clear session
    clearSession(sessionId) {
        this.sessions.delete(sessionId);
    }
}

export default ConversationContext;
