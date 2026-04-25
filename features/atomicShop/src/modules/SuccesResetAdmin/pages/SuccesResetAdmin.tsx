import React from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { SUCCESS_RESET_CONTENT } from '../mock/SuccesResetAdmin';

export const SuccessResetAdmin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden p-4 font-sans"
      style={{ backgroundImage: `url(${SUCCESS_RESET_CONTENT.background})` }}
    >
      <div className="bg-white w-full max-w-[450px] py-16 px-10 shadow-2xl rounded-sm flex flex-col items-center animate-in fade-in zoom-in duration-500">
        
        <header className="mb-10 text-center w-full">
          <img 
            src={SUCCESS_RESET_CONTENT.logo} 
            alt="Atomic Shop" 
            className="h-16 w-auto mb-10 mx-auto object-contain" 
          />
          <p className="text-[1.1rem] font-semibold text-gray-800 leading-tight">
            {SUCCESS_RESET_CONTENT.title}
          </p>
        </header>

<div className="flex items-center justify-center mb-6 text-[#6db5e7]">
  <CheckCircle2 size={130} className="stroke-[1.5px]" />
</div>

        <button 
          onClick={() => navigate('/admin/login')}
          className="mt-4 text-[#6db5e7] hover:underline text-sm font-medium"
        >
          Ir al inicio de sesión
        </button>

      </div>
    </div>
  );
};