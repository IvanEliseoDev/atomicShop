import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router'; 
import { FIRST_USE_CONTENT } from '../mocks/FirstUseMock';

export const FirstUseAdmin: React.FC = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  

  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
  
    navigate('/TU_SIGUIENTE_RUTA_AQUI'); 
  };

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden p-4"
      style={{ backgroundImage: `url(${FIRST_USE_CONTENT.background})` }}
    >
      <div className="bg-white w-[420px] py-10 px-12 shadow-2xl rounded-sm flex flex-col items-center animate-in fade-in zoom-in duration-500">
        
        <header className="mb-8 text-center w-full">
          <img 
            src={FIRST_USE_CONTENT.logo} 
            alt="Atomic Shop" 
            className="h-20 w-auto mb-6 mx-auto object-contain" 
          />
          <h2 className="text-[1.2rem] font-bold leading-tight text-[#4A4A4A] px-4">
            Registre sus datos <br /> como administrador
          </h2>
        </header>

        <form className="w-full flex flex-col gap-4" onSubmit={handleRegister}>
          {FIRST_USE_CONTENT.fields.map((field) => (
            <div key={field.id} className="relative">
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#31a1ee] transition-all resize-none text-sm"
                />
              ) : (
                <div className="relative">
                  <input
                    type={
                      field.id === 'pass' ? (showPass ? 'text' : 'password') :
                      field.id === 'confirmPass' ? (showConfirm ? 'text' : 'password') : 
                      field.type
                    }
                    placeholder={field.placeholder}
                    className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#31a1ee] transition-all text-sm"
                  />
                  
                  {(field.id === 'pass' || field.id === 'confirmPass') && (
                    <button
                      type="button"
                      onClick={() => field.id === 'pass' ? setShowPass(!showPass) : setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {field.id === 'pass' 
                        ? (showPass ? <EyeOff size={18} /> : <Eye size={18} />)
                        : (showConfirm ? <EyeOff size={18} /> : <Eye size={18} />)
                      }
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#5DA9E1] hover:bg-[#4A90E2] text-white font-medium py-2 px-14 rounded-md shadow-sm transition-all text-[0.95rem]"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirstUseAdmin;