import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Hello! I\'m your medical assistant. I can help you with:\n• Finding doctors by specialty\n• Booking appointments\n• Answering general health questions\n• Providing medication information\n\nHow can I assist you today?' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Appointment booking
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
      return "I can help you book an appointment! Please visit our doctors page to select a specialist, or tell me what type of doctor you need and I'll guide you there.";
    }
    
    // Find doctors
    if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist')) {
      return "We have excellent doctors across various specialties including General Physicians, Gynecologists, Dermatologists, Pediatricians, Neurologists, and Gastroenterologists. Would you like me to show you our doctors list?";
    }
    
    // Symptoms
    if (lowerMessage.includes('fever') || lowerMessage.includes('headache') || lowerMessage.includes('pain')) {
      return "I understand you're experiencing symptoms. While I can provide general information, it's always best to consult with a qualified doctor for proper diagnosis and treatment. Would you like me to help you book an appointment with a general physician?";
    }
    
    // Medicine information
    if (lowerMessage.includes('medicine') || lowerMessage.includes('medication')) {
      return "For medication information, it's important to consult with healthcare professionals. Our doctors can provide proper guidance based on your specific condition. Would you like to schedule a consultation?";
    }
    
    // Emergency
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return "For medical emergencies, please call emergency services immediately or visit the nearest hospital emergency room. If this is not an emergency, I can help you schedule an appointment.";
    }
    
    // Contact info
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('address')) {
      return "You can reach us at:\n📞 Phone: +92 300 1234567\n📧 Email: info@prescription.com\n📍 Address: 123 Medical Street, Healthcare City\n\nOr visit our contact page for more details.";
    }
    
    // Working hours
    if (lowerMessage.includes('hours') || lowerMessage.includes('timing') || lowerMessage.includes('open')) {
      return "Our clinic hours are:\nMonday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM\n\nEmergency services available 24/7.";
    }
    
    // Default response
    return "I'm here to help with your medical needs! You can ask me about:\n• Booking appointments\n• Finding specialists\n• General health information\n• Clinic services\n• Contact details\n\nWhat would you like to know?";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { type: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMsg = { type: 'bot', text: botResponse };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
      <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        {/* Header */}
        <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">Medical Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.type === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
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
              placeholder="Type your message..."
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
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
