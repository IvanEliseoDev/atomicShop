export const formatDUI = (value:string) => {
  if (!value) return value;

  // Elimina todo lo que no sea número
  const digits = value.replace(/\D/g, "");

  // Limita a 9 dígitos (8 + 1 verificador)
  const limitedDigits = digits.slice(0, 9);

  // Si tiene más de 8 dígitos, inserta el guion antes del último
  if (limitedDigits.length > 8) {
    return `${limitedDigits.slice(0, 8)}-${limitedDigits.slice(8)}`;
  }

  return limitedDigits;
};