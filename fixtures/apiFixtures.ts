import { test as base, request, expect } from '@playwright/test';
import { RestClient } from '../utils/restClient';
import { GraphClient } from '../utils/graphClient';

type ApiFixtures = {
  restClient: RestClient;
  graphClient: GraphClient;
};

const test = base.extend<ApiFixtures>({
  restClient: async ({}, use) => {
    const requestContext = await request.newContext({
      baseURL: process.env.FACADE_BASE_URL,
      ignoreHTTPSErrors: true,
    });
    const client = new RestClient(requestContext);
    await use(client);
    await requestContext.dispose();
  },

  graphClient: async ({}, use) => {
    const requestContext = await request.newContext({
      baseURL: process.env.SUBGRAPH_BASE_URL,
      ignoreHTTPSErrors: true,
    });
    const client = new GraphClient(requestContext);
    await use(client);
    await requestContext.dispose();
  },
});

export { test, expect };
