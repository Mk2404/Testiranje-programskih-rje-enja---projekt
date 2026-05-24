const request = require('supertest');
const app = require('../../backend/index');

describe('POST /api/login', () => {

    // Pozitivni scenariji
    it('should login successfully as admin', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'admin', password: 'adminPass' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.role).toBe('admin');
    });

    it('should login successfully as Iva', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'Iva', password: 'Iva123' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.role).toBe('enduser');
    });

    it('should login successfully as Marta', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'Marta', password: 'Marta123' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.role).toBe('enduser');
    });

    // Negativni scenariji
    it('should return 401 for wrong password', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'admin', password: 'wrongPass' });
        expect(res.statusCode).toBe(401);
        expect(res.body.errorCode).toBe('AUTH003');
    });

    it('should return 401 for non-existing user', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'nepostojeci', password: 'pass123' });
        expect(res.statusCode).toBe(401);
        expect(res.body.errorCode).toBe('AUTH003');
    });

    it('should return 401 for empty credentials', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: '', password: '' });
        expect(res.statusCode).toBe(401);
        expect(res.body.errorCode).toBe('AUTH003');
    });

    it('should return 401 for numeric username', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: '123', password: 'pass123' });
        expect(res.statusCode).toBe(401);
        expect(res.body.errorCode).toBe('AUTH003');
    });

    it('should return 401 for short username', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ username: 'ab', password: 'pass123' });
        expect(res.statusCode).toBe(401);
        expect(res.body.errorCode).toBe('AUTH003');
    });
});