import { OrderStatus } from '@hungryshark/common';
import mongoose from 'mongoose';

interface OrderAttrs {
    id : string,
    version : number,
    status : OrderStatus,
    userId : string,
    price : number,
}   

interface OrderDoc extends mongoose.Document {
    version : number,
    status : OrderStatus,
    userId : string,
    price : number,
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs : OrderAttrs) : OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    price : {
        type: String,
        required: true
    },
    status : {
        type : String,
        required : true
    }
},{
    toJSON: {
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    }
});


orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id : attrs.id,
        version : attrs.version,
        price : attrs.price,
        userId : attrs.userId,
        status : attrs.status,
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order',orderSchema);

export { Order };
