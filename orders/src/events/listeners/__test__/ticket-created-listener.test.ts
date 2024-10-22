import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import  { TicketCreatedEvent } from '@hungryshark/common';
import mongoose from 'mongoose';
import  { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async ( ) => {

    // Create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // Create a fake data event 
    const data  : TicketCreatedEvent['data'] = {
        version : 0,
        id : new mongoose.Types.ObjectId().toHexString(),
        title : " conterr",
        price : 343,
        userId : new mongoose.Types.ObjectId().toHexString(),
    }

    // Create a fake Message object 

    // @ts-ignore
    const msg : Message = {
        ack : jest.fn()
    }
    return {
        listener, data, msg
    }
}

it("Creates and saves a ticket",async ()=>{

    const { listener, data, msg }  = await setup();
        
    // call onMessage with data and msg
    await listener.onMessage(data,msg);

    // Write assertions to make sure ticket was created
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);

});

it("acks the message",async ()=>{    

    const { listener, data, msg }  = await setup();

    // call onMessage with data and msg
    await listener.onMessage(data,msg);

    // Write assertions to make ack mssg was called 
    expect(msg.ack).toHaveBeenCalled();
});

