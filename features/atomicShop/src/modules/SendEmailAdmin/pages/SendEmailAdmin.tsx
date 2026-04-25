import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { CODE_VERIFICATION_CONTENT } from '../mock/SendEmailAdmin';

export const SendEmailAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(new Array(CODE_VERIFICATION_CONTENT.codeLength).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < CODE_VERIFICATION_CONTENT.codeLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
  e.preventDefault();
  navigate('/admin/ResetPasswordAdmin'); 
};

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden p-4"
      style={{ backgroundImage: `url(${CODE_VERIFICATION_CONTENT.background})` }}
    >
      <div className="bg-white w-full max-w-[420px] py-12 px-10 shadow-2xl rounded-sm flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        <header className="mb-8 text-center w-full">
          <img 
            src={CODE_VERIFICATION_CONTENT.logo} 
            alt="Atomic Shop" 
            className="h-16 w-auto mb-8 mx-auto object-contain" 
          />
          <p className="text-[0.9rem] font-medium text-gray-600 px-2 leading-tight">
            {CODE_VERIFICATION_CONTENT.title}
          </p>
        </header>

        <form className="w-full flex flex-col items-center" onSubmit={handleVerify}>
          {/* Los 6 cuadritos */}
          <div className="flex gap-2 mb-4">
            {code.map((digit, index) => (
             <input
  key={index}
  type="text"
  maxLength={1}
  value={digit}

            ref={(el) => {
            if (inputsRef.current) {
         inputsRef.current[index] = el;
    }
  }}
  onChange={(e) => handleChange(e.target.value, index)}
  onKeyDown={(e) => handleKeyDown(e, index)}
  className="w-11 h-11 text-center text-lg font-bold border border-gray-400 rounded-md focus:outline-none focus:border-[#31a1ee] focus:ring-1 focus:ring-[#31a1ee]"
/>
            ))}
          </div>

          <div className="w-full mb-8 text-left">
            <button type="button" className="text-[#31a1ee] text-sm hover:underline">
              {CODE_VERIFICATION_CONTENT.resendText}
            </button>
          </div>

          <button
            type="submit"
            className="bg-[#6db5e7] hover:bg-[#5DA9E1] text-white font-medium py-2.5 px-14 rounded-md shadow-sm transition-all text-sm"
          >
            {CODE_VERIFICATION_CONTENT.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};