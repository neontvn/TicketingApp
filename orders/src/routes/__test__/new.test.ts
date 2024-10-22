import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';


it('returns an error if ticket doesnot exist', async () => {
    const ticketId = mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signup())
        .send({ ticketId })
        .expect(404)
})

it('returns an error if ticket is already reserved', async () => {

    const ticket = Ticket.build({
        id : mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        userId: "sadasdsadsad",
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    });

    await order.save();

    await request(app)
        .post("/api/orders")
        .set('Cookie', global.signup())
        .send({
            ticketId: ticket.id
        })
        .expect(400);

})

it('reserves a ticket', async () => {

    const ticket = Ticket.build({
        id : mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();

    const res = await request(app)
        .post("/api/orders")
        .set('Cookie', global.signup())
        .send({
            ticketId: ticket.id
        })
        .expect(201);
        // console.log(res.body)
});

it('emits an order created', async()=>{

    const ticket = Ticket.build({
        id : mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();

    // Creates an order
    const res = await request(app)
        .post("/api/orders")
        .set('Cookie', global.signup())
        .send({
            ticketId: ticket.id
        })
        .expect(201);  
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})