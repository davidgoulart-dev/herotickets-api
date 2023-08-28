import { App } from "../app";
const app = new App()
const express = app.app
import request from 'supertest';
import path from 'path';
import { EventUseCase } from "../useCases/EventUseCase";
import { EventRepository } from "../repositories/EventRepository";
import { Event } from "../entities/Event";
import crypto from 'node:crypto'

describe('Event test', () => {
    it('/POST Event', async () => {
        const event = {
            title: "Jorge e Mateus",
            price: [{ sector: 'Pista', amount: '20' }],
            categories: ['Show'],
            description: 'Evento descrição',
            city: 'Rio de Janeiro',
            location: {
                latitude: "-22.9138967",
                longitude: "-43.2375033"
            },
            coupons: [],
            date: new Date(),
            participants: [],
            formattedAddress: "Avenida Exemplo, 123, Rio de Janeiro, RJ"
        };

        const bannerPath = path.join(__dirname, 'banner.jpg'); // Assuming banner.jpg is in the same folder as this test file
        const flyer1Path = path.join(__dirname, 'flyer1.jpg'); // Assuming flyer1.jpg is in the same folder as this test file
        const flyer2Path = path.join(__dirname, 'flyer2.jpg'); // Assuming flyer2.jpg is in the same folder as this test file

        const response = await request(express)
            .post('/events')
            .field('title', event.title)
            .field('description', event.description)
            .field('city', event.city)
            .field('coupons', event.coupons)
            .field('categories', event.categories)
            .field('location[latitude]', event.location.latitude)
            .field('location[longitude]', event.location.longitude)
            .field('date', event.date.toISOString())
            .field('price[sector]', event.price[0].sector)
            .field('price[amount]', event.price[0].amount)
            .attach('banner', bannerPath)
            .attach('flyers', flyer1Path)
            .attach('flyers', flyer2Path);

        if (response.error) {
            console.log(response.error)
        }

        expect(response.status).toBe(201)
        expect(response.body).toEqual({ message: 'Evento criado com sucesso.' })
    });
    it('/GET/:id Get Event by Id', async () => {

        const response = await request(express)
            .get('/events/64d828191bb4682659163a71')


        if (response.error) {
            console.log(response.error)
        }

        expect(response.status).toBe(200)

    });
    it('/GET Get Event by Location', async () => {

        const response = await request(express)
            .get('/events?latitude=-22.9138967&longitude=-43.2375033')


        if (response.error) {
            console.log(response.error)
        }

        expect(response.status).toBe(200)
        expect(response.body.length).toBeGreaterThanOrEqual(0)

    });
    it('/GET Get Event by category', async () => {

        const response = await request(express)
            .get('/events/category/Show')


        if (response.error) {
            console.log(response.error)
        }

        expect(response.status).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)

    });
    it('/POST Get insert User', async () => {

        const response = await request(express)
            .post('/events/64d828191bb4682659163a71/participants').send({
                name: 'David',
                email: crypto.randomBytes(10).toString('hex') + 'teste.com'
            })


        if (response.error) {
            console.log(response.error)
        }

        expect(response.status).toBe(200)


    });
});
const eventRepository = {
    add: jest.fn(),
    findEventsByCategory: jest.fn(),
    findByLocationAndDate: jest.fn(),
    findEventsByCity: jest.fn(),
    findEventsByName: jest.fn(),
    findEventById: jest.fn(),
    update: jest.fn(),
    findEventsMain: jest.fn()


}
const eventUseCase = new EventUseCase(eventRepository);
const event: Event = {
    title: "Jorge e Mateus",
    price: [{ sector: 'Pista', amount: '20' }],
    categories: ['Show'],
    description: 'Evento descrição',
    city: 'Rio de Janeiro',
    location: {
        latitude: "-22.9138967",
        longitude: "-43.2375033"
    },
    banner: 'banner.jpg',
    flyers: ['flyer1.png', 'flyer2.png'],
    coupons: [],
    date: new Date(),
    participants: [],
    formattedAddress: "Avenida Exemplo, 123, Rio de Janeiro, RJ"
};
describe('Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    it('should return an array of events by category', async () => {
        eventRepository.findEventsByCategory.mockResolvedValue([event])
        const result = await eventUseCase.findEventsByCategory('Show')

        expect(result).toEqual([event])
        expect(eventRepository.findEventsByCategory).toHaveBeenCalledWith('Show')
    });

    it('should return an array of events by name', async () => {
        eventRepository.findEventsByName.mockResolvedValue([event])
        const result = await eventUseCase.findEventsByName('Jorge e Mateus')

        expect(result).toEqual([event])
        expect(eventRepository.findEventsByName).toHaveBeenCalledWith('Jorge e Mateus')
    })

    it('should return a event by Id', async () => {
        eventRepository.findEventById.mockResolvedValueOnce(event)
        const result = await eventUseCase.findEventsById('64d828191bb4682659163a71')

        expect(result).toEqual(event)
        expect(eventRepository.findEventById).toHaveBeenCalledWith('64d828191bb4682659163a71')
    })
})