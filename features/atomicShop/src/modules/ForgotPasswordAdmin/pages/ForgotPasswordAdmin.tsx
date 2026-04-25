import React from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router';
import { FORGOT_PASSWORD_CONTENT } from '../mock/ForgotPasswordAdmin';

export const ForgotPasswordAdminPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Enviando código de recuperación...");
  
  navigate('/admin/SendEmailAdmin'); 
};

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden p-4"
      style={{ backgroundImage: `url(${FORGOT_PASSWORD_CONTENT.background})` }}
    >
      <div className="bg-white w-[400px] py-12 px-10 shadow-2xl rounded-sm flex flex-col items-center animate-in fade-in zoom-in duration-500">
        
        <header className="mb-8 text-center w-full">
          <img 
            src={FORGOT_PASSWORD_CONTENT.logo} 
            alt="Atomic Shop" 
            className="h-16 w-auto mb-6 mx-auto object-contain" 
          />
          <h2 className="text-[1.1rem] font-bold text-[#4A4A4A]">
            {FORGOT_PASSWORD_CONTENT.title}
          </h2>
        </header>

        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type={FORGOT_PASSWORD_CONTENT.field.type}
              placeholder={FORGOT_PASSWORD_CONTENT.field.placeholder}
              className="w-full p-2.5 pr-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#31a1ee] transition-all text-sm"
              required
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <button
              type="submit"
              className="bg-[#5DA9E1] hover:bg-[#4A90E2] text-white font-medium py-2.5 px-14 rounded-md shadow-sm transition-all text-[0.95rem]"
            >
              {FORGOT_PASSWORD_CONTENT.buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};