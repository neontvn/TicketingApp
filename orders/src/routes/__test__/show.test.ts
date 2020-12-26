import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';


it('it fetches the particular order',async()=>{
    
    // Create a ticket
    const ticket = Ticket.build({
        title : "Concet",
        price : 400
    })
    await ticket.save();

    // Make a request to build the order
    const user = global.signup();

    const { body : order } = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ ticketId : ticket.id })
        .expect(201)

    // Make request to fetch order
    const orderId = order.id;

    const { body : fetchedOrder } = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie',user)
        .send({})
        .expect(200)

    expect(fetchedOrder.id).toEqual(orderId);

})


it('returns an error if one user tries to fetch another users order',async()=>{
    
    // Create a ticket
    const ticket = Ticket.build({
        title : "Concet",
        price : 400
    })
    await ticket.save();

    // Make a request to build the order
    const user = global.signup();

    const { body : order } = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ ticketId : ticket.id })
        .expect(201)

    // Make request to fetch order
    const orderId = order.id;

    await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie',global.signup())
        .send({})
        .expect(401)

})