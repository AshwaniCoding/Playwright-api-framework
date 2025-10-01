import { test, expect } from '../../fixtures/apiFixtures';

test.describe('GraphQL API - Positive and Negative Scenarios', () => {

    test('Get Product By ID', async ({ graphClient }) => {
        await graphClient
            .setQueryOrMutation('getProduct.graphql')
            .setVariables('getProduct.json')
            .setBearerToken(process.env.API_TOKEN as string)
            .setHeaders({ 'Content-Type': 'application/json' })
            .post();


        expect(graphClient.getStatusCode()).toBe(200);
    });

});