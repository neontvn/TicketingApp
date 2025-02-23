import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
    id : string,
    title : string,
    price : number,
}

export interface TicketDoc extends mongoose.Document {
    title : string,
    price : number,
    version : number,
    isReserved() : Promise<boolean>    
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs:TicketAttrs) : TicketDoc;
    findByEvent(event : { id : string, version : number }) : Promise<TicketDoc | null>;
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

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

// To call a method on model
ticketSchema.statics.build = (attrs :TicketAttrs) => {
    return new Ticket({
        _id : attrs.id,
        title : attrs.title,
        price : attrs.price
    });
}
ticketSchema.statics.findByEvent = (event : {id : string, version : number }) => { 
    return Ticket.findOne({
        _id : event.id,
        version : event.version-1,
    });
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
