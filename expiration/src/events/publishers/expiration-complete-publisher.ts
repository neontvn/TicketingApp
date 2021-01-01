import { Subjects, ExpirationCompleteEvent, Publisher } from "@hungryshark/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject : Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}