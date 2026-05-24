const { createReimbursement, updateReimbursementStatus } = require('../../backend/utils/reimbursement');

describe('createReimbursement', () => {

    const validData = {
        amount: 100,
        description: 'Putni troškovi za poslovni put',
        type: 'travel'
    };

    it('should return reimbursement for valid data', () => {
        const result = createReimbursement(validData, 2);
        expect(result.reimbursement).toBeDefined();
        expect(result.reimbursement.status).toBe('Pending');
        expect(result.reimbursement.userId).toBe(2);
        expect(result.error).toBeUndefined();
    });

    it('should return reimbursement with all fields', () => {
        const result = createReimbursement(validData, 2);
        expect(result.reimbursement).toMatchObject({
            userId: 2,
            amount: 100,
            description: validData.description,
            type: 'travel',
            status: 'Pending'
        });
    });

    it('should return error for negative amount', () => {
        const result = createReimbursement({ ...validData, amount: -50 }, 2);
        expect(result.error).toBeDefined();
        expect(result.error.errorCode).toBe('REQ002');
    });

    it('should return error for zero amount', () => {
        const result = createReimbursement({ ...validData, amount: 0 }, 2);
        expect(result.error).toBeDefined();
        expect(result.error.errorCode).toBe('REQ002');
    });

    it('should return error for too short description', () => {
        const result = createReimbursement({ ...validData, description: 'Hi' }, 2);
        expect(result.error).toBeDefined();
        expect(result.error.errorCode).toBe('REQ003');
    });

    it('should return error for too long description', () => {
        const result = createReimbursement({ ...validData, description: 'a'.repeat(201) }, 2);
        expect(result.error).toBeDefined();
        expect(result.error.errorCode).toBe('REQ003');
    });

    it('should return error for invalid type', () => {
        const result = createReimbursement({ ...validData, type: 'nepostojeci' }, 2);
        expect(result.error).toBeDefined();
        expect(result.error.errorCode).toBe('REQ004');
    });
});

describe('updateReimbursementStatus', () => {

    const mockReimbursement = {
        id: 1,
        userId: 2,
        amount: 100,
        description: 'Putni troškovi za poslovni put',
        type: 'travel',
        status: 'Pending'
    };

    it('should allow admin to approve reimbursement', () => {
        const reimbursement = { ...mockReimbursement };
        const result = updateReimbursementStatus(reimbursement, 'Approved', 'admin');
        expect(result.reimbursement.status).toBe('Approved');
        expect(result.error).toBeUndefined();
    });

    it('should allow admin to reject reimbursement', () => {
        const reimbursement = { ...mockReimbursement };
        const result = updateReimbursementStatus(reimbursement, 'Rejected', 'admin');
        expect(result.reimbursement.status).toBe('Rejected');
        expect(result.error).toBeUndefined();
    });

    it('should return error for enduser trying to change status', () => {
        const reimbursement = { ...mockReimbursement };
        const result = updateReimbursementStatus(reimbursement, 'Approved', 'enduser');
        expect(result.error).toBeDefined();
        expect(result.error.errorCode).toBe('AUTH004');
    });

    it('should return error for invalid status', () => {
        const reimbursement = { ...mockReimbursement };
        const result = updateReimbursementStatus(reimbursement, 'NepostojeciStatus', 'admin');
        expect(result.error).toBeDefined();
        expect(result.error.errorCode).toBe('REQ005');
    });

    it('should return error for empty status', () => {
        const reimbursement = { ...mockReimbursement };
        const result = updateReimbursementStatus(reimbursement, '', 'admin');
        expect(result.error).toBeDefined();
        expect(result.error.errorCode).toBe('REQ005');
    });
});