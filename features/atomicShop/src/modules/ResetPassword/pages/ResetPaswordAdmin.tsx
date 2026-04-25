import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { RESET_PASSWORD_CONTENT } from '../mock/ResetPasswordAdmin';

export const ResetPasswordAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
  e.preventDefault();
  
  console.log("Password reset exitoso");
    navigate('/admin/SuccessResetAdmin'); 
};

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden p-4 font-sans"
      style={{ backgroundImage: `url(${RESET_PASSWORD_CONTENT.background})` }}
    >
      <div className="bg-white w-full max-w-[450px] py-14 px-10 shadow-2xl rounded-sm flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        <header className="mb-8 text-center w-full">
          <img 
            src={RESET_PASSWORD_CONTENT.logo} 
            alt="Atomic Shop" 
            className="h-16 w-auto mb-8 mx-auto object-contain" 
          />
          <p className="text-[1.05rem] font-medium text-gray-800 px-2 leading-snug mb-2">
            {RESET_PASSWORD_CONTENT.title}
          </p>
        </header>

        <form className="w-full flex flex-col gap-4" onSubmit={handleUpdate}>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder={RESET_PASSWORD_CONTENT.fields[0].placeholder}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-[#31a1ee] text-sm text-gray-500 placeholder-gray-400"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder={RESET_PASSWORD_CONTENT.fields[1].placeholder}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-[#31a1ee] text-sm text-gray-500 placeholder-gray-400"
              required
            />
            <button 
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#6db5e7] hover:bg-[#5DA9E1] text-white font-medium py-3 px-16 rounded-md shadow-md transition-all text-[0.95rem] active:scale-95"
            >
              {RESET_PASSWORD_CONTENT.buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};