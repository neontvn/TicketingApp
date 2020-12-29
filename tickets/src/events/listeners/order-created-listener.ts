import { Listener, OrderCreatedEvent, Subjects } from "@hungryshark/common";
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject : Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data :OrderCreatedEvent['data'],msg : Message){

        // Find the ticket the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        
        // If no ticket throw error 
        if(!ticket){
            throw new Error("Ticket not found");
        }

        // Mark the ticket reserved by setting the orderId property
        ticket.set({ orderId : data.id });

        // Save the ticket
        await ticket.save();

        // Publishing if the ticket gets updated
        await new TicketUpdatedPublisher(this.client).publish({
            id : ticket.id,
            version : ticket.version,
            title : ticket.title,
            price : ticket.price,
            userId :ticket.userId,
            orderId : ticket.orderId
        })

        // ack the message
        msg.ack();
    }
}