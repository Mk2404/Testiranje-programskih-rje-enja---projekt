const { validateUsername } = require('./validators');

const users = [
    { id: 1, username: 'admin', password: 'adminPass', role: 'admin' },
    { id: 2, username: 'Iva', password: 'Iva123', role: 'enduser' },
    { id: 3, username: 'Marta', password: 'Marta123', role: 'enduser' }
];

const validateUserCredentials = (username, password) => {
    if (!validateUsername(username)) return null;

    return users.find(u => u.username === username && u.password === password) || null;
};

module.exports = {
    validateUserCredentials,
    users
};