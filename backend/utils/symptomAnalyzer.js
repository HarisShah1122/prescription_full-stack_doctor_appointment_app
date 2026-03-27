// Advanced Symptom Analysis System
class SymptomAnalyzer {
    constructor() {
        this.initializeSymptomMappings();
    }

    // Initialize comprehensive symptom mappings with variations
    initializeSymptomMappings() {
        this.symptomGroups = {
            // General Physician - Most common symptoms
            general: {
                keywords: [
                    // Fever variations
                    'fever', 'bukhar', 'temperature', 'high temperature', 'sardi', 'garmi',
                    // Cough variations
                    'cough', 'khansi', 'coughing', 'throat pain', 'gala dard',
                    // Cold variations
                    'cold', 'zukam', 'flu', 'running nose', 'naak bahna',
                    // Body pain variations
                    'body pain', 'badan dard', 'body ache', 'muscle pain', 'pain', 'dard',
                    // Weakness variations
                    'weakness', 'kamzori', 'fatigue', 'thakan', 'tired', 'exhausted',
                    // Heart variations
                    'palpitations', 'heart racing', 'fast heartbeat', 'dil ki tez', 'dil dard',
                    // General symptoms
                    'checkup', 'general checkup', 'routine checkup', 'medical checkup',
                    'not feeling well', 'unwell', 'sick', 'ill', 'bimar'
                ],
                specialty: 'General Physician',
                priority: 1
            },

            // Gynecologist - Women's health
            gynecologist: {
                keywords: [
                    // Pregnancy variations
                    'pregnancy', 'pregnant', 'hamal', 'expecting', 'baby bump',
                    // Period variations
                    'period', 'menstrual', 'mahwari', 'monthly cycle', 'periods',
                    // Women's health variations
                    'women health', 'female health', 'aurat ki sehat', 'ladies health',
                    // Specific women's issues
                    'delivery', 'baby delivery', 'childbirth', 'labor',
                    'menopause', 'hormones', 'breast', 'breast pain',
                    'uterus', 'ovaries', 'pcos', 'fibroids'
                ],
                specialty: 'Gynecologist',
                priority: 2
            },

            // Dermatologist - Skin, hair, allergies
            dermatologist: {
                keywords: [
                    // Skin variations
                    'skin', 'skin issues', 'skin problem', 'rash', 'khujli', 'itching',
                    'acne', 'pimples', 'muhase', 'breakouts', 'spots',
                    'dry skin', 'oily skin', 'sensitive skin',
                    // Allergy variations
                    'allergy', 'allergic', 'allergies', 'allergic reaction',
                    // Hair variations
                    'hair loss', 'hair fall', 'bal girna', 'baldness', 'hair thinning',
                    'dandruff', 'scalp', 'hair problems',
                    // Other skin issues
                    'eczema', 'psoriasis', 'fungal infection', 'warts', 'moles'
                ],
                specialty: 'Dermatologist',
                priority: 3
            },

            // Pediatrician - Children's health
            pediatrician: {
                keywords: [
                    // Child variations
                    'child', 'children', 'kid', 'kids', 'bacha', 'bachay',
                    'baby', 'infant', 'toddler', 'newborn', 'neonate',
                    // Pediatric variations
                    'pediatric', 'pediatrics', 'child health', 'kids health',
                    // Specific children's issues
                    'vaccination', 'vaccine', 'immunization', 'shots',
                    'growth', 'development', 'milestones', 'child development',
                    'baby checkup', 'newborn care', 'feeding issues',
                    'colic', 'diaper rash', 'teething'
                ],
                specialty: 'Pediatrician',
                priority: 4
            },

            // Neurologist - Brain, nervous system
            neurologist: {
                keywords: [
                    // Headache variations
                    'headache', 'head ache', 'sar dard', 'migraine', 'head pain',
                    'sinus headache', 'tension headache', 'cluster headache',
                    // Brain variations
                    'brain', 'dimaagh', 'brain fog', 'memory', 'concentration',
                    // Nervous system variations
                    'seizure', 'epilepsy', 'fits', 'convulsions',
                    'dizziness', 'chakar', 'vertigo', 'lightheadedness',
                    'numbness', 'sunn pan', 'tingling', 'pins and needles',
                    // Cognitive variations
                    'memory loss', 'yad na rahna', 'forgetfulness', 'confusion',
                    'stroke', 'paralysis', 'weakness one side', 'facial droop'
                ],
                specialty: 'Neurologist',
                priority: 5
            },

            // Gastroenterologist - Digestive system
            gastroenterologist: {
                keywords: [
                    // Stomach variations
                    'stomach', 'pet', 'stomach pain', 'pet dard', 'stomach ache',
                    'stomach upset', 'stomach cramps', 'belly pain', 'pait dard',
                    // Digestion variations
                    'indigestion', 'bad hazmi', 'digestion', 'gas', 'bloating',
                    'acidity', 'tezabiyat', 'heartburn', 'acid reflux', 'gerd',
                    // Specific digestive issues
                    'ulcer', 'stomach ulcer', 'peptic ulcer',
                    'liver', 'jiger', 'liver pain', 'jaundice', 'hepatitis',
                    'gallbladder', 'gallstones', 'bile duct',
                    // Bowel variations
                    'diarrhea', 'dast', 'loose motions', 'frequent motions',
                    'constipation', 'qabz', 'hard stool', 'difficulty passing stool',
                    'ibs', 'irritable bowel', 'crohn', 'colitis'
                ],
                specialty: 'Gastroenterologist',
                priority: 6
            }
        };

        // Available specialties for fallback
        this.availableSpecialties = [
            'General Physician',
            'Gynecologist',
            'Dermatologist', 
            'Pediatrician',
            'Neurologist',
            'Gastroenterologist'
        ];
    }

    // Normalize and clean user input
    normalizeInput(text) {
        if (!text) return '';

        // Convert to lowercase and remove extra spaces
        let normalized = text.toLowerCase().trim();

        // Remove common noise words
        const noiseWords = [
            'i have', 'i am', 'i feel', 'i think', 'i need', 'i want',
            'my', 'me', 'mine', 'feeling', 'suffering from',
            'problem', 'issue', 'issues', 'symptoms', 'complaint',
            'please', 'help', 'can you', 'could you', 'would you',
            'the', 'a', 'an', 'and', 'or', 'but', 'so', 'because',
            'very', 'really', 'severe', 'bad', 'terrible', 'awful',
            'میں ہوں', 'مجھے', 'میرا', 'میری', 'مدد', 'براہ کرم'
        ];

        noiseWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            normalized = normalized.replace(regex, ' ');
        });

        // Replace multiple spaces with single space
        normalized = normalized.replace(/\s+/g, ' ').trim();

        return normalized;
    }

    // Calculate symptom match score for each specialty
    calculateSymptomScores(normalizedInput) {
        const scores = {};

        Object.entries(this.symptomGroups).forEach(([groupName, group]) => {
            let score = 0;
            let matchedKeywords = [];

            group.keywords.forEach(keyword => {
                // Check for exact match
                if (normalizedInput.includes(keyword)) {
                    score += 10;
                    matchedKeywords.push(keyword);
                }
                // Check for partial matches (for compound symptoms)
                else {
                    const words = keyword.split(' ');
                    let partialScore = 0;
                    words.forEach(word => {
                        if (normalizedInput.includes(word)) {
                            partialScore += 5;
                        }
                    });
                    if (partialScore > 0) {
                        score += partialScore;
                        matchedKeywords.push(keyword);
                    }
                }
            });

            if (score > 0) {
                scores[groupName] = {
                    score: score,
                    specialty: group.specialty,
                    priority: group.priority,
                    matchedKeywords: matchedKeywords
                };
            }
        });

        return scores;
    }

    // Detect specialty from user input
    detectSpecialty(userInput) {
        const normalizedInput = this.normalizeInput(userInput);
        
        if (!normalizedInput) return null;

        const scores = this.calculateSymptomScores(normalizedInput);

        if (Object.keys(scores).length === 0) {
            // No direct symptom match, try direct specialty mention
            const lowerInput = normalizedInput.toLowerCase();
            for (const specialty of this.availableSpecialties) {
                if (lowerInput.includes(specialty.toLowerCase())) {
                    return {
                        specialty: specialty,
                        confidence: 0.9,
                        method: 'direct_mention',
                        matchedKeywords: [specialty]
                    };
                }
            }
            return null;
        }

        // Find the best match based on score and priority
        let bestMatch = null;
        let highestScore = 0;

        Object.entries(scores).forEach(([groupName, result]) => {
            // Adjust score based on priority (lower priority number = higher priority)
            const adjustedScore = result.score + (10 - result.priority);
            
            if (adjustedScore > highestScore) {
                highestScore = adjustedScore;
                bestMatch = {
                    specialty: result.specialty,
                    confidence: Math.min(result.score / 20, 1), // Normalize to 0-1
                    method: 'symptom_match',
                    matchedKeywords: result.matchedKeywords,
                    score: result.score
                };
            }
        });

        return bestMatch;
    }

    // Get fallback suggestion when no clear match
    getFallbackSuggestion(userInput) {
        const normalizedInput = this.normalizeInput(userInput);
        
        // Check for general inquiries first
        const generalInquiries = [
            'hello', 'hi', 'assalam', 'salam', 'how are you',
            'time', 'appointment', 'book', 'emergency', 'help',
            'thank', 'shukria', 'meherbani', 'bye', 'allah hafiz', 'khuda hafiz'
        ];

        const isGeneralInquiry = generalInquiries.some(inquiry => 
            normalizedInput.includes(inquiry)
        );

        if (isGeneralInquiry) {
            return {
                type: 'general_inquiry',
                message: 'This appears to be a general inquiry.',
                specialty: null
            };
        }

        // Default to General Physician for medical symptoms
        return {
            type: 'fallback_to_general',
            message: 'Based on your description, I recommend consulting a General Physician who can assess your symptoms and refer you to a specialist if needed.',
            specialty: 'General Physician'
        };
    }

    // Process user input and return analysis result
    analyzeSymptoms(userInput) {
        const detection = this.detectSpecialty(userInput);

        if (detection && detection.confidence > 0.3) {
            return {
                success: true,
                detectedSpecialty: detection.specialty,
                confidence: detection.confidence,
                method: detection.method,
                matchedKeywords: detection.matchedKeywords,
                score: detection.score,
                recommendation: `Based on your symptoms, you should consult a ${detection.specialty}.`
            };
        } else {
            const fallback = this.getFallbackSuggestion(userInput);
            return {
                success: true,
                detectedSpecialty: fallback.specialty,
                confidence: fallback.type === 'general_inquiry' ? 0 : 0.5,
                method: 'fallback',
                matchedKeywords: [],
                score: 0,
                recommendation: fallback.message
            };
        }
    }

    // Get explanation of detection for debugging
    getDetectionExplanation(analysis) {
        if (!analysis.success) return 'Analysis failed';

        let explanation = `Detection Method: ${analysis.method}\n`;
        explanation += `Detected Specialty: ${analysis.detectedSpecialty}\n`;
        explanation += `Confidence: ${(analysis.confidence * 100).toFixed(1)}%\n`;
        explanation += `Score: ${analysis.score}\n`;
        
        if (analysis.matchedKeywords && analysis.matchedKeywords.length > 0) {
            explanation += `Matched Keywords: ${analysis.matchedKeywords.join(', ')}\n`;
        }
        
        explanation += `Recommendation: ${analysis.recommendation}`;

        return explanation;
    }
}

export default SymptomAnalyzer;
