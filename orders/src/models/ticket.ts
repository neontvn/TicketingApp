import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
    title : string,
    price : number,
}

export interface TicketDoc extends mongoose.Document {
    title : string,
    price : number,
    isReserved() : Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs:TicketAttrs) : TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true,
        min : 0
    },
},{
    toJSON : {
        transform(doc,ret){
            ret.id=ret._id
            delete ret._id
        }
    }
});

// To call a method on model
ticketSchema.statics.build = (attrs :TicketAttrs) => {
    return new Ticket(attrs);
}

// To call a method on Document
// Run query to look at all orders. Find an order where the ticket is the ticket we just found
// *and* the order status is *not* cancelled
// If we find order, then the ticket is reserved.

ticketSchema.methods.isReserved = async function(){
    // this === the ticket document we just called 'isReserved'
    const existingOrder = await Order.findOne({
        ticket : this,
        status : {
            $in : [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema);

export { Ticket };