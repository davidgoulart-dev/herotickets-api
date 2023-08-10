interface EventRepository {
    add(event: Event): Promise<Event>;

}

export {EventRepository}