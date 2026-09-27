require('dotenv').config({ quiet: true });

const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const Product = require('../models/Product');

jest.setTimeout(30000);

// Ket noi MongoDB truoc khi chay test
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    });
});

// Xoa du lieu test sau moi test
afterEach(async () => {
    await Product.deleteMany({});
});

// Dong ket noi MongoDB sau khi test xong
afterAll(async () => {
    await mongoose.disconnect();
});

describe('Product API CRUD Test', () => {

    // Test CREATE
    test('POST /products - Them san pham', async () => {
        const response = await request(app)
            .post('/products')
            .send({
                pid: 'P001',
                pname: 'Sua tuoi',
                price: 30000,
                quantity: 10
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.pid).toBe('P001');
        expect(response.body.pname).toBe('Sua tuoi');
    });

    // Test READ
    test('GET /products/:pid - Lay san pham', async () => {
        await Product.create({
            pid: 'P002',
            pname: 'Sua chua',
            price: 10000,
            quantity: 20
        });

        const response = await request(app)
            .get('/products/P002');

        expect(response.statusCode).toBe(200);
        expect(response.body.pid).toBe('P002');
        expect(response.body.pname).toBe('Sua chua');
    });

    // Test UPDATE
    test('PUT /products/:pid - Cap nhat san pham', async () => {
        await Product.create({
            pid: 'P003',
            pname: 'Sua cu',
            price: 20000,
            quantity: 5
        });

        const response = await request(app)
            .put('/products/P003')
            .send({
                pname: 'Sua moi',
                price: 25000,
                quantity: 15
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.pname).toBe('Sua moi');
        expect(response.body.price).toBe(25000);
        expect(response.body.quantity).toBe(15);
    });

    // Test DELETE
    test('DELETE /products/:pid - Xoa san pham', async () => {
        await Product.create({
            pid: 'P004',
            pname: 'Sua can xoa',
            price: 15000,
            quantity: 5
        });

        const response = await request(app)
            .delete('/products/P004');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Product deleted successfully');
    });

});