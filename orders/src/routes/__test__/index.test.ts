import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id : mongoose.Types.ObjectId().toHexString(),
        title: 'convery',
        price: 20
    })
    await ticket.save();
    return ticket;
}

it('Fetches order for a particular user', async () => {

    // Create tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signup();
    const userTwo = global.signup();

    // Create 1 order as user 1 
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201)

    // Create 2 orders as user 2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201)

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201)

    // Make request to get orders for user 2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .send({})
        .expect(200)

    // make sure we get only user 2 orders
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);

})