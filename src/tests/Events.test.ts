import { App } from "../app";
const app = new App()
const express = app.app
import request from 'supertest';
import path from 'path';

describe('Event test', () => {
    it('/POST Event', async () => {
        const event = {
            title: "Jorge e Mateus",
            price: [{ sector: 'Pista', amount: '20' }],
            categories:['Show'],
            description: 'Evento descrição',
            city: 'Rio de Janeiro',
            location: {
                latitude: "-22.912376",
                longitude: "-43.230320"
            },
            coupons: [],
            date: new Date(),
            participants: []
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
            .field('location[latitude]', event.location.latitude)
            .field('location[longitude]', event.location.longitude)
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
});

