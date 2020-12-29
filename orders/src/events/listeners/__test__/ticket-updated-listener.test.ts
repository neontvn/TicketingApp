import { natsWrapper } from '../../../nats-wrapper';
import  { TicketUpdatedEvent } from '@hungryshark/common';
import mongoose from 'mongoose';
import  { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async ( ) => {

    // Create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save ticket
    const ticket = Ticket.build({
        id : new mongoose.Types.ObjectId().toHexString(),
        title : "conder",
        price : 2300
    });
    await ticket.save();

    // Create a fake data event 
    const data  : TicketUpdatedEvent['data'] = {
        version : ticket.version+1,
        id : ticket.id,
        title : "new conterr",
        price : 343,
        userId : new mongoose.Types.ObjectId().toHexString(),
    }

    // Create a fake Message object 

    // @ts-ignore
    const msg : Message = {
        ack : jest.fn()
    }
    return {
        listener, data, msg, ticket
    }
}

it("finds, updates and saves a ticket",async ()=>{

    const { listener, data, msg, ticket }  = await setup();
        
    // call onMessage with data and msg
    await listener.onMessage(data,msg);

    // Write assertions to make sure ticket was created
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);

});

it("acks the message",async ()=>{    

    const { listener, data, msg }  = await setup();

    // call onMessage with data and msg
    await listener.onMessage(data,msg);

    // Write assertions to make ack mssg was called 
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the version is skipped version',async()=>{

    const { data , listener, msg, ticket} = await setup();
    data.version = 10;

    // call onMessage with data and msg
    try{
        await listener.onMessage(data,msg);
    }catch(err){}

    // Write assertions to make ack mssg was called 
    expect(msg.ack).not.toHaveBeenCalled();

})
