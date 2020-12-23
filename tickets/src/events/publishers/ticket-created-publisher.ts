import { Publisher, Subjects, TicketCreatedEvent } from "@hungryshark/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject : Subjects.TicketCreated = Subjects.TicketCreated;
}