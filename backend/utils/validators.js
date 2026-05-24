// backend/utils/validators.js

function validateDescription(description) {
    return typeof description === 'string' && description.length >= 5 && description.length <= 200;
}

function validateAmount(amount) {
    return typeof amount === 'number' && amount > 0;
}

const ALLOWED_TYPES = ['business_expenses', 'auto_mileage', 'travel', 'medical_expenses', 'employee_stipends'];

function validateType(type) {
    return ALLOWED_TYPES.includes(type);
}

function validateStatusChange(status) {
    return status === 'Approved' || status === 'Rejected';
}

function isAdmin(role) {
    return role === 'admin';
}

function validateUsername(username) {
    return typeof username === 'string' && username.length >= 3 && isNaN(username);
}

module.exports = {
    validateDescription,
    validateAmount,
    validateType,
    validateStatusChange,
    isAdmin,
    validateUsername
};