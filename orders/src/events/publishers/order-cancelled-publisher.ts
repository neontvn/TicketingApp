import { OrderCancelledEvent, Publisher, Subjects } from '@hungryshark/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject : Subjects.OrderCancelled = Subjects.OrderCancelled;
}