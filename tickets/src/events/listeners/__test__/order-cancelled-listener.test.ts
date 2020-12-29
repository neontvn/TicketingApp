import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from 'mongoose';
import {OrderCancelledEvent, OrderCreatedEvent, OrderStatus} from '@hungryshark/common';
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async ()=>{
    
    // Create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create and save a ticket
    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = await Ticket.build({
        userId : mongoose.Types.ObjectId().toHexString(),
        title : "COnceret",
        price : 2424,
        
    })
    ticket.set({ orderId });
    await ticket.save();

    // Create fake data event 
    const data : OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,            
    }
    };

    // @ts-ignore
    const msg :Message = {
        ack : jest.fn()
    }

    return { listener, ticket, data, msg };
}

it(" updates the ticket and publishes an event and acks the message", async()=>{

    const { listener,ticket,data, msg } = await setup();

    await listener.onMessage(data,msg);

    // updates the ticket
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();

    // acks the mssg
    expect(msg.ack).toHaveBeenCalled();

    // publish called
    expect(natsWrapper.client.publish).toHaveBeenCalled();

})

