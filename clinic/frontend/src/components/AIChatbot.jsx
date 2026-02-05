import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets_frontend/assets';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            role: 'bot', 
            text: 'Xin chào! Tôi là trợ lý AI Prescripto. Bạn đang cảm thấy thế nào? Hãy mô tả triệu chứng để tôi gợi ý chuyên khoa phù hợp nhé.' 
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Gửi request đến FastAPI Server
            const response = await axios.post('http://localhost:8000/predict', { 
                text: userMsg.text 
            });

            const botMsg = {
                role: 'bot',
                text: response.data.advice,
                specialty: response.data.specialty // Nhận từ backend để tạo nút filter
            };
            
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("AI Server Error:", error);
            setMessages(prev => [...prev, { 
                role: 'bot', 
                text: 'Xin lỗi, tôi không thể kết nối với máy chủ AI lúc này. Vui lòng kiểm tra lại kết nối!' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    // AIChatbot.jsx
    const handleSpecialtyClick = (specialty) => {
    // Thay thế dấu "/" bằng một ký tự khác hoặc mã hóa thật kỹ
    // Cách an toàn nhất: encode chuỗi để biến "/" thành "%2F"
    const encodedSpecialty = encodeURIComponent(specialty);
    
    navigate(`/doctors/${encodedSpecialty}`);
    window.scrollTo(0, 0);
    setIsOpen(false);
    };
    return (
        <div className="fixed bottom-6 right-6 z-[999]">
            {/* Floating Action Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isOpen ? 'bg-gray-500' : 'bg-primary'}`}
            >
                {isOpen ? (
                    <span className="text-white text-xl">✕</span>
                ) : (
                    <img className="w-8 h-8 object-contain" src={assets.chat_icon} alt="AI Chat" />
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[500px] bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                    
                    {/* Header */}
                    <div className="bg-primary p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-xl">🤖</span>
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <p className="font-bold text-sm">Trợ lý AI Prescripto</p>
                                <p className="text-[10px] text-green-100 uppercase tracking-widest">Đang trực tuyến</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-primary text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                    <p>{msg.text}</p>
                                    
                                    {/* Action Button for Specialty */}
                                    {msg.specialty && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-[11px] text-gray-500 mb-2 italic">Hệ thống tìm thấy chuyên khoa phù hợp:</p>
                                            <button 
                                                onClick={() => handleSpecialtyClick(msg.specialty)}
                                                className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
                                            >
                                                <span>👨‍⚕️ Khám {msg.specialty}</span>
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium">AI đang suy nghĩ...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
                        <input 
                            type="text" 
                            className="flex-1 text-sm border-none bg-gray-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Mô tả triệu chứng bệnh..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                                !input.trim() || loading ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white shadow-lg hover:rotate-12'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatbot;