import {Listener, OrderCancelledEvent, Subjects } from '@hungryshark/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject : Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage (data : OrderCancelledEvent['data'],msg: Message) {

        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket){
            throw new Error('Ticket Not found');
        }

        ticket.set({ orderId : undefined });
        await ticket.save();
        //  publish an event Ticket has been updated

        await new TicketUpdatedPublisher(this.client).publish({
            id : ticket.id,
            orderId : ticket.orderId,
            price : ticket.price,
            title : ticket.title,
            version : ticket.version,
            userId :ticket.userId,
        })

        msg.ack();
    }
}