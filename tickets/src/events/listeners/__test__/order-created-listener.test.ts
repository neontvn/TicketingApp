import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from 'mongoose';
import {OrderCreatedEvent, OrderStatus} from '@hungryshark/common';
import { Message } from "node-nats-streaming";

const setup = async ()=>{
    // Create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = await Ticket.build({
        userId : mongoose.Types.ObjectId().toHexString(),
        title : "COnceret",
        price : 2424
    })

    await ticket.save();

    // Create fake data event 
    const data : OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "sdfdsfs",
        expiresAt: "asfafasfsa",
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    };

    // @ts-ignore
    const msg :Message = {
        ack : jest.fn()
    }

    return { listener, ticket, data, msg };
}

it(" sets the userId of the ticket ", async()=>{
    const { listener,ticket,data, msg } = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);

})

it(" acks the message ", async()=>{
    
    const { listener, data, msg } = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();

})