export const MOCK_USERS = [
    { email: 'admin@atomic.com', password: 'password123' },
    { email: 'user@atomic.com', password: 'user123' },
];

export const validateEmail = (email: string): boolean => {
    return email.includes('@') && email.length > 0;
};

export const verifyCredentials = (email: string, password: string): boolean => {
    return MOCK_USERS.some((user) => user.email === email && user.password === password);
};
