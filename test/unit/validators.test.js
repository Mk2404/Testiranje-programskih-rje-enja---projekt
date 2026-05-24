const {
    validateDescription,
    validateAmount,
    validateType,
    validateStatusChange,
    isAdmin,
    validateUsername  // maknut ALLOWED_TYPES
} = require('../../backend/utils/validators');

// =====================
// validateAmount
// =====================
describe('validateAmount', () => {

    // Pozitivni scenarij - pozitivan broj je ispravan iznos
    it('should return true for a positive number', () => {
        expect(validateAmount(100)).toBe(true);
    });

    // Negativni scenarij - nula nije ispravan iznos
    it('should return false for zero', () => {
        expect(validateAmount(0)).toBe(false);
    });

    // Negativni scenarij - negativan broj nije ispravan iznos
    it('should return false for negative number', () => {
        expect(validateAmount(-50)).toBe(false);
    });

    // Negativni scenarij - string umjesto broja nije ispravan iznos
    it('should return false for string input', () => {
        expect(validateAmount('100')).toBe(false);
    });

});

// =====================
// validateDescription
// =====================
describe('validateDescription', () => {

    // Pozitivni scenarij - ispravan opis između 5 i 200 znakova
    it('should return true for a valid description', () => {
        expect(validateDescription('Valid description text')).toBe(true);
    });

    // Pozitivni scenarij - opis s točno 5 znakova (minimun)
    it('should return true for description with exactly 5 characters', () => {
        expect(validateDescription('Hello')).toBe(true);
    });

    // Negativni scenarij - opis kraći od 5 znakova nije ispravan
    it('should return false for description shorter than 5 characters', () => {
        expect(validateDescription('Hi')).toBe(false);
    });

    // Negativni scenarij - opis duži od 200 znakova nije ispravan
    it('should return false for description longer than 200 characters', () => {
        expect(validateDescription('a'.repeat(201))).toBe(false);
    });

    // Negativni scenarij - broj umjesto teksta nije ispravan opis
    it('should return false for non-string input', () => {
        expect(validateDescription(12345)).toBe(false);
    });

});

// =====================
// validateType
// =====================
describe('validateType', () => {

    // Pozitivni scenarij - travel je ispravan tip refundacije
    it('should return true for valid type travel', () => {
        expect(validateType('travel')).toBe(true);
    });

    // Pozitivni scenarij - medical_expenses je ispravan tip refundacije
    it('should return true for valid type medical_expenses', () => {
        expect(validateType('medical_expenses')).toBe(true);
    });

    // Negativni scenarij - nepostojeći tip nije ispravan
    it('should return false for invalid type', () => {
        expect(validateType('invalid_type')).toBe(false);
    });

    // Negativni scenarij - prazan string nije ispravan tip
    it('should return false for empty string', () => {
        expect(validateType('')).toBe(false);
    });

    // Negativni scenarij - null nije ispravan tip
    it('should return false for null', () => {
        expect(validateType(null)).toBe(false);
    });

});

// =====================
// validateStatusChange
// =====================
describe('validateStatusChange', () => {

    // Pozitivni scenarij - Approved je ispravan status
    it('should return true for Approved status', () => {
        expect(validateStatusChange('Approved')).toBe(true);
    });

    // Pozitivni scenarij - Rejected je ispravan status
    it('should return true for Rejected status', () => {
        expect(validateStatusChange('Rejected')).toBe(true);
    });

    // Negativni scenarij - Pending nije dozvoljena promjena statusa
    it('should return false for Pending status', () => {
        expect(validateStatusChange('Pending')).toBe(false);
    });

    // Negativni scenarij - nepostojeći status nije ispravan
    it('should return false for invalid status', () => {
        expect(validateStatusChange('Unknown')).toBe(false);
    });

    // Negativni scenarij - prazan string nije ispravan status
    it('should return false for empty string', () => {
        expect(validateStatusChange('')).toBe(false);
    });

});

// =====================
// isAdmin
// =====================
describe('isAdmin', () => {

    // Pozitivni scenarij - admin uloga ima administratorske ovlasti
    it('should return true for admin role', () => {
        expect(isAdmin('admin')).toBe(true);
    });

    // Negativni scenarij - enduser uloga nema administratorske ovlasti
    it('should return false for enduser role', () => {
        expect(isAdmin('enduser')).toBe(false);
    });

    // Negativni scenarij - prazan string nije admin uloga
    it('should return false for empty string', () => {
        expect(isAdmin('')).toBe(false);
    });

    // Negativni scenarij - null nije admin uloga
    it('should return false for null', () => {
        expect(isAdmin(null)).toBe(false);
    });

});

// =====================
// validateUsername
// =====================
describe('validateUsername', () => {

    // Pozitivni scenarij - ispravan username s više od 3 znaka
    it('should return true for valid username', () => {
        expect(validateUsername('admin')).toBe(true);
    });

    // Pozitivni scenarij - username s točno 3 znaka (minimum)
    it('should return true for username with exactly 3 characters', () => {
        expect(validateUsername('abc')).toBe(true);
    });

    // Negativni scenarij - username kraći od 3 znaka nije ispravan
    it('should return false for username shorter than 3 characters', () => {
        expect(validateUsername('ab')).toBe(false);
    });

    // Negativni scenarij - username koji sadrži samo brojeve nije ispravan
    it('should return false for username with only numbers', () => {
        expect(validateUsername('123')).toBe(false);
    });

    // Negativni scenarij - prazan string nije ispravan username
    it('should return false for empty string', () => {
        expect(validateUsername('')).toBe(false);
    });

    // Negativni scenarij - null nije ispravan username
    it('should return false for null', () => {
        expect(validateUsername(null)).toBe(false);
    });

});