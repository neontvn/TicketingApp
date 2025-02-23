import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('cancel an order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id : mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 239,
    });

    await ticket.save();

    // Request to make an order
    const user = global.signup();
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // Request to cancel the order
    const orderId = order.id;
    await request(app)
        .delete(`/api/orders/${orderId}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    // Expectations to check if cancelled
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('Emits an order cancelled event', async () => {

    // Create a ticket
    const ticket = Ticket.build({
        id : mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 239,
    });

    await ticket.save();

    // Request to make an order
    const user = global.signup();
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // Request to cancel the order
    const orderId = order.id;
    await request(app)
        .delete(`/api/orders/${orderId}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});