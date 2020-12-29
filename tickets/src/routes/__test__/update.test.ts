import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns 404 if id does not exist',async()=>{
    const id  = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',global.signup())
        .send({
            title : "sdsds",
            price : 24,
        })
        .expect(404)
})

it('returns 401 if user not authenticated',async()=>{
    const id  = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title : "sdsds",
            price : 24,
        })
        .expect(401)

})

it('returns 401 if user doesnot own the ticket',async()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signup())
        .send({
            title : "sdsds",
            price : 24,
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signup())
        .send({
            title : "vvvv",
            price : 23,
        })
        .expect(401)
})

it('returns 400 if user provides invalid title or price',async()=>{
    const cookie = global.signup() 
    const response = await request(app)    
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title : "sdsds",
            price : 24,
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title : "",
            price : 23,
        })
        .expect(400)
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title : "dsfdsf",
            price : -23,
        })
        .expect(400)
})

it('updates the ticket provided valid input',async()=>{
    const cookie = global.signup() 
    const response = await request(app)    
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title : "sdsds",
            price : 24,
        })
        
    const ticketResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title : "New title",
            price : 200
        })
        .expect(200)
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual("New title")
    expect(ticketResponse.body.price).toEqual(200)
})

it('publishes an event', async ()=>{
    const cookie = global.signup() 
    const response = await request(app)    
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title : "sdsds",
            price : 24,
        })
        
    const ticketResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title : "New title",
            price : 200
        })
        .expect(200)

        expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it("rejects updates if ticket is reserved",async ()=>{
    const cookie = global.signup() 
    const response = await request(app)    
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title : "sdsds",
            price : 24,
        })
    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({orderId : mongoose.Types.ObjectId().toHexString()});
    await ticket?.save();
    
    const ticketResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title : "New title",
            price : 200
        })
        .expect(400)
})
