const request = require('supertest');
const app = require('../../backend/index');

jest.setTimeout(10000);

async function getToken(username, password) {
    const res = await request(app)
        .post('/api/login')
        .send({ username, password });
    return res.body.token;
}

describe('PATCH /api/reimbursements/:id/status', () => {
    let adminToken, userToken, testId;

    beforeAll(async () => {
        adminToken = await getToken('admin', 'adminPass');
        userToken = await getToken('Iva', 'Iva123');
        const res = await request(app)
            .post('/api/reimbursements')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ amount: 50, description: 'Testni opis troška', type: 'travel' });
        testId = res.body.id;
    });

    it('Admin smije odobriti status (200 OK)', async () => {
        expect(testId).toBeDefined();
        const res = await request(app)
            .patch(`/api/reimbursements/${testId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'Approved' });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('Approved');
    });

    it('Korisnik NE SMIJE mijenjati status (403 Forbidden)', async () => {
        expect(testId).toBeDefined();
        const res = await request(app)
            .patch(`/api/reimbursements/${testId}/status`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ status: 'Approved' });
        expect(res.statusCode).toBe(403);
        expect(res.body.errorCode).toBe('AUTH004');
    });
});