import request from 'supertest';
import { app } from '../../app';

it('fails when a email that doesnot exist is supplied', async ()=>{
    
    return request(app)
        .post('/api/users/signin')
        .send({
            email : 'test@test.com',
            password : 'password'
        })
        .expect(400);
});

it('fails when an incorrect password is supplied',async () => { 

    await request(app)
        .post('/api/users/signup')
        .send({
            email : 'test@test.com',
            password : 'password'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email : 'test@test.com',
            password : 'asdsad'
        })
        .expect(400);
});

it('responds with cookie when given valid credentials',async () => { 

    await request(app)
        .post('/api/users/signup')
        .send({
            email : 'test@test.com',
            password : 'password'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email : 'test@test.com',
            password : 'password'
        })
        .expect(200);
    
        expect(response.get('Set-Cookie')).toBeDefined();

})