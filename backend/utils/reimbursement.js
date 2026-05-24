// backend/utils/reimbursement.js
const { validateDescription, validateAmount, validateType, validateStatusChange, isAdmin } = require('./validators');

function createReimbursement(data, userId) {
    const { amount, description, type } = data;

    if (!validateAmount(amount)) return { error: { errorCode: 'REQ002', message: 'Amount must be positive' } };
    if (!validateDescription(description)) return { error: { errorCode: 'REQ003', message: 'Description too short or too long' } };
    if (!validateType(type)) return { error: { errorCode: 'REQ004', message: 'Invalid type' } };

    return {
        reimbursement: {
            id: Date.now(),
            userId,
            amount,
            description,
            type,
            status: 'Pending'
        }
    };
}

function updateReimbursementStatus(reimbursement, newStatus, userRole) {
    if (!validateStatusChange(newStatus)) return { error: { errorCode: 'REQ005', message: 'Invalid status' } };
    if (!isAdmin(userRole)) return { error: { errorCode: 'AUTH004', message: 'Only admins allowed' } };

    reimbursement.status = newStatus;
    return { reimbursement };
}

module.exports = { createReimbursement, updateReimbursementStatus };