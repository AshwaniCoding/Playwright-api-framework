// graphClient.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class GraphClient {
    private requestContext: APIRequestContext;
    private headers: Record<string, string> = {};
    private query: string = '';
    private variables: Record<string, any> = {};
    private response: APIResponse | null = null;
    private readonly endpoint: string = '/'; // GraphQL endpoint: use /graphql 

    constructor(requestContext: APIRequestContext) {
        this.requestContext = requestContext;
    }

    setHeaders(headers: Record<string, string>): GraphClient {
        this.headers = { ...this.headers, ...headers };
        return this;
    }

    setBearerToken(token: string): GraphClient {
        this.headers['Authorization'] = `Bearer ${token}`;
        return this;
    }

    setQueryOrMutation(fileName: string): GraphClient {

        const rootFilePath = "resources/data/subgraph/query/";
        const filePath = path.resolve(process.cwd(), rootFilePath, fileName);
        this.query = fs.readFileSync(filePath, 'utf-8');

        return this;
    }

    setVariables(variables: Record<string, any> | string): GraphClient {
        if (typeof variables === 'string' && variables.endsWith('.json')) {
            const rootFilePath = 'resources/data/subgraph/variables/';
            const filePath = path.resolve(process.cwd(), rootFilePath, variables);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            this.variables = JSON.parse(fileContent);
        } else {
            this.variables = variables as Record<string, any>;
        }
        return this;
    }


    async post(): Promise<APIResponse> {
        if (!this.query) throw new Error('GraphQL query/mutation not set.');

        this.response = await this.requestContext.post(this.endpoint, {
            headers: this.headers,
            data: {
                query: this.query,
                variables: this.variables
            },
        });

        return this.response;
    }

    async getResponseJson(): Promise<any> {
        if (!this.response) throw new Error('No response available. Call post() first.');
        return this.response.json();
    }

    async getFieldValue(path: string): Promise<any> {
        const json = await this.getResponseJson();
        return path.split('.').reduce((acc: any, key: string) => acc?.[key], json);
    }

    getStatusCode(): number {
        if (!this.response) throw new Error('No response available. Call post() first.');
        return this.response.status();
    }

    printLog(): GraphClient {
        console.log("Logs: ");
        console.log('→', this.endpoint);
        Object.keys(this.headers).forEach(key => console.log(`  - ${key}: ${this.headers[key]}`));
        if (this.query) console.log('  - query:', this.query);
        if (this.variables) console.log('  - variables:', JSON.stringify(this.variables, null, 2));
        return this;
    }

    reset(): GraphClient {
        this.headers = {};
        this.query = '';
        this.variables = {};
        this.response = null;
        return this;
    }

}
