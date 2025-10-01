import { test, expect } from '../../fixtures/apiFixtures';

test.describe('Get Booking API - Positive and Negative Scenarios', () => {

    test('Get Booking by ID', async ({restClient}) => {
      await restClient
        .setEndpoint('/booking/{bookingId}', { bookingId: '1' })
        .setHeaders({ 'Content-Type': 'application/json' })
        .get();

      expect(restClient.getStatusCode()).toBe(200);
    });


    test('Create Booking', async ({restClient}) => {

      await restClient
        .setEndpoint('/booking')
        .setHeaders({ 'Content-Type': 'application/json' })
        .setBody("createBooking.json")
        .post();

      expect(restClient.getStatusCode()).toBe(200);

    });

})