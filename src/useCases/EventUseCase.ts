import { EventRepository } from "../repositories/EventRepository";

import { Event } from '../entities/Event';


class EventUseCase {
    constructor(private eventRepository: EventRepository) {}
async create(eventData: Event) {
    const result = await this.eventRepository.add(eventData);
    return result;
}


}

export {EventUseCase};