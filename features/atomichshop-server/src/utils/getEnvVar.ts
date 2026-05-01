export const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Variable de entorno faltante: ${key}`);
  }
  return value;
};

// Con esta funcion validamos que las variables de entorno existan antes de arrancar la API
// Si no existen, la API no arranca y avisa exactamente cual variable falta

