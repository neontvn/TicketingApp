import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async ()=>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email : 'test@test.com',
            password : 'password'
        })
        .expect(201);
});


it('returns a 400 on invalid email', async ()=>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email : 'sadasdasdas',
            password : 'password'
        })
        .expect(400);
});

it('returns a 400 on invalid password', async ()=>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email : 'test@test.com',
            password : 'pa'
        })
        .expect(400);
}); 

it('returns a 400 on missing email or password', async ()=>{
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com"
        })
        .expect(400);

    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it('disallows duplicate emails', async ()=>{

    await request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(201);

    return request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(400);
}); 

it('sets a cookie after successful signup',async()=>{
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(201); 

    expect(response.get('Set-Cookie')).toBeDefined();
})