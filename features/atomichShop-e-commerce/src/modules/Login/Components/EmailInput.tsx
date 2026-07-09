import React from "react";
import { Mail } from "lucide-react";

interface EmailInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ placeholder = "Correo electrónico", label, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type="email"
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          {...props}
        />
        <div className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">
          <Mail size={20} />
        </div>
      </div>
    </div>
  )
);
