import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@hungryshark/common';

it('returns a 404 when purchasing an order that doesnt exis', async()=>{
    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signup())
        .send({
            token : "asdasdas",
            orderId : mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
});

it('returns 401 when the order doesnt belong to the user',async()=>{

    // Different user id
    const order = Order.build({
        id : mongoose.Types.ObjectId().toHexString(),
        version : 0,
        userId : mongoose.Types.ObjectId().toHexString(),
        status : OrderStatus.Created,        
        price : 2323        
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signup())
        .send({
            token : "asdasdas",
            orderId : order.id
        })
        .expect(401)


});

it('returns a 400 when purchasing a cancelled order',async()=>{
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id : mongoose.Types.ObjectId().toHexString(),
        version : 0,
        userId : userId,
        status : OrderStatus.Cancelled,        
        price : 2323        
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signup(userId))
        .send({
            token : "asdasdas",
            orderId : order.id
        })
        .expect(400)

});