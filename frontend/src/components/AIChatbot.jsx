import React, { useState, useRef, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import api from '../utils/axios';

const AIChatbot = () => {
  const { backendUrl, doctors } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Hello! I\'m your intelligent medical assistant. I can help you find the right doctor based on your symptoms. What symptoms are you experiencing?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize session on component mount
  useEffect(() => {
    const existingSessionId = localStorage.getItem('chatbot_session_id');
    const newSessionId = existingSessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setSessionId(newSessionId);
    localStorage.setItem('chatbot_session_id', newSessionId);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format doctor recommendations with booking buttons
  const formatDoctorRecommendations = (recommendedDoctors, detectedSpecialty) => {
    if (!recommendedDoctors || recommendedDoctors.length === 0) {
      return null;
    }

    return (
      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🩺</span>
          <span className="font-semibold text-blue-900">
            Recommended {detectedSpecialty}(s)
          </span>
        </div>
        <div className="space-y-2">
          {recommendedDoctors.map((doctor, index) => (
            <div key={doctor._id} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    Dr. {doctor.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    🏥 {doctor.speciality} • 🎓 {doctor.degree}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    💰 Rs. {doctor.fees} • 📍 {doctor.address?.line1 || 'Medical Center'}
                  </div>
                  <div className="mt-2">
                    {doctor.available !== false ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ❌ Unavailable
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="ml-3 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={doctor.available === false}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle appointment booking
  const handleBookAppointment = (doctor) => {
    // Store selected doctor info for booking process
    localStorage.setItem('selectedDoctor', JSON.stringify(doctor));
    
    // Add system message
    const systemMsg = {
      type: 'system',
      text: `📅 Redirecting to book appointment with Dr. ${doctor.name}...`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMsg]);
    
    // Redirect to appointment booking page
    setTimeout(() => {
      window.location.href = `/appointments?doctor=${doctor._id}`;
    }, 1500);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { 
      type: 'user', 
      text: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call backend AI API with session ID
      console.log("Sending message to backend:", inputMessage);
      console.log("Session ID:", sessionId);
      
      const { data } = await api.post(`${backendUrl}/api/user/ai-chat`, {
        message: inputMessage,
        sessionId: sessionId
      }, {
        headers: {
          'x-session-id': sessionId
        }
      });

      console.log("Backend response:", data);

      if (data.success) {
        const botMsg = { 
          type: 'bot', 
          text: data.response,
          timestamp: new Date(),
          detectedSpecialty: data.detectedSpecialty,
          recommendedDoctors: data.recommendedDoctors,
          analysis: data.analysis
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      console.error("Error details:", error.response?.data);
      
      // Fallback to default response with local doctors
      const fallbackMsg = { 
        type: 'bot', 
        text: "I'm having trouble connecting right now. However, I can still help you find doctors. What symptoms are you experiencing?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render message with doctor recommendations
  const renderMessage = (msg, index) => {
    const isUser = msg.type === 'user';
    const isSystem = msg.type === 'system';

    return (
      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[80%] ${isSystem ? 'bg-yellow-50 border border-yellow-200' : isUser ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg`}>
          {!isSystem && !isUser && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Medical Assistant</span>
              {msg.analysis && (
                <span className="text-xs text-gray-500">
                  (Confidence: {Math.round(msg.analysis.confidence * 100)}%)
                </span>
              )}
            </div>
          )}
          <p className="text-sm whitespace-pre-line">{msg.text}</p>
          
          {/* Render doctor recommendations if available */}
          {!isUser && !isSystem && msg.recommendedDoctors && msg.recommendedDoctors.length > 0 && (
            formatDoctorRecommendations(msg.recommendedDoctors, msg.detectedSpecialty)
          )}
          
          <div className="text-xs text-gray-500 mt-2">
            {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([
      { 
        type: 'bot', 
        text: 'Hello! I\'m your intelligent medical assistant. I can help you find the right doctor based on your symptoms. What symptoms are you experiencing?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        {/* Header */}
        <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">Intelligent Medical Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearConversation}
              className="text-white hover:bg-white/20 p-1 rounded"
              title="Clear conversation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => renderMessage(msg, index))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">Medical Assistant</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms (e.g., headache, fever, skin rash)..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Quick symptom suggestions */}
          <div className="mt-2 flex flex-wrap gap-1">
            {['fever', 'headache', 'skin issues', 'stomach pain'].map((symptom) => (
              <button
                key={symptom}
                onClick={() => setInputMessage(symptom)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
