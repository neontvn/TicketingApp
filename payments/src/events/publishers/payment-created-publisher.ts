import { Publisher, Subjects, PaymentCreatedEvent } from "@hungryshark/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject : Subjects.PaymentCreated = Subjects.PaymentCreated;
}