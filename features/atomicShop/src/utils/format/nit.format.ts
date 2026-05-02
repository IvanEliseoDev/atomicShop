export const formatNIT = (value: string) => {
  if (!value) return value;

  // Elimina todo lo que no sea número
  const digits = value.replace(/\D/g, "");

  // Limita a 14 dígitos totales
  const limitedDigits = digits.slice(0, 14);

  let formatted = "";
  
  if (limitedDigits.length <= 4) {
    formatted = limitedDigits;
  } else if (limitedDigits.length <= 10) {
    // Formato: 0000-000000
    formatted = `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4)}`;
  } else if (limitedDigits.length <= 13) {
    // Formato: 0000-000000-000
    formatted = `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 10)}-${limitedDigits.slice(10)}`;
  } else {
    // Formato: 0000-000000-000-0
    formatted = `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 10)}-${limitedDigits.slice(10, 13)}-${limitedDigits.slice(13)}`;
  }

  return formatted;
};