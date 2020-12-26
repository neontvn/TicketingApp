import { OrderCreatedEvent, Publisher, Subjects } from '@hungryshark/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject : Subjects.OrderCreated = Subjects.OrderCreated;
}