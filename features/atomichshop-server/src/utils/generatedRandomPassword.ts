import crypto from 'crypto';

/**
 * Genera una contraseña aleatoria de 10 caracteres
 * Incluye: Mayúsculas, minúsculas, números y caracteres especiales (#@$&)
 */
export const generateRandomPassword = (): string => {
    const length = 10;
    const charset = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '#@$&'
    };

    const allChars = Object.values(charset).join('');
    let password = '';

    //Aseguramos al menos uno de cada tipo para cumplir con la "mezcla"
    password += charset.uppercase[crypto.randomInt(0, charset.uppercase.length)];
    password += charset.lowercase[crypto.randomInt(0, charset.lowercase.length)];
    password += charset.numbers[crypto.randomInt(0, charset.numbers.length)];
    password += charset.special[crypto.randomInt(0, charset.special.length)];

    //Llenamos el resto de los 10 caracteres aleatoriamente
    for (let i = password.length; i < length; i++) {
        const randomIndex = crypto.randomInt(0, allChars.length);
        password += allChars[randomIndex];
    }

    return password.split('').sort(() => crypto.randomInt(-1, 2)).join('');
};