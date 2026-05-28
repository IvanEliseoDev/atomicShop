export const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  
  // Elimina cualquier carácter que no sea un número
  const phoneNumber = value.replace(/[^\d]/g, "");
  
  // Limita a 8 dígitos
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength <= 4) return phoneNumber;
  
  // Retorna el formato 0000-0000
  return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4, 8)}`;
};