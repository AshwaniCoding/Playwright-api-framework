import { APIRequestContext, APIResponse, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class RestClient {
  private requestContext: APIRequestContext;
  private endpoint: string = '';
  private headers: Record<string, string> = {};
  private queryParams: URLSearchParams = new URLSearchParams();
  private body: any = null;
  private response: APIResponse | null = null;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
  }

  setEndpoint(endpoint: string, pathParams?: Record<string, string>): RestClient {
    if (pathParams) {
      Object.keys(pathParams).forEach(key => {
        endpoint = endpoint.replace(`{${key}}`, pathParams[key]);
      });
    }
    this.endpoint = endpoint;
    return this;
  }

  setHeaders(headers: Record<string, string>): RestClient {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  setBearerToken(token: string): RestClient {
    this.headers['Authorization'] = `Bearer ${token}`;
    return this;
  }

  setQueryParams(params: Record<string, string>): RestClient {
    Object.keys(params).forEach(key => {
      this.queryParams.set(key, params[key]);
    });
    return this;
  }

  setBody(fileName: any): RestClient {

    const rootFilePath = `resources/data/${process.env.ENV}/test-rest/`;
    const filePath = path.resolve(process.cwd(), rootFilePath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    try {
      this.body = JSON.parse(fileContent);
    } catch {
      this.body = fileContent;
    }

    return this;
  }

  async get(): Promise<APIResponse> {
    this.response = await this.requestContext.get(this.buildUrl(), { headers: this.headers });
    return this.response;
  }

  async post(): Promise<APIResponse> {
    this.response = await this.requestContext.post(this.buildUrl(), { headers: this.headers, data: this.body });
    return this.response;
  }

  async put(): Promise<APIResponse> {
    this.response = await this.requestContext.put(this.buildUrl(), { headers: this.headers, data: this.body });
    return this.response;
  }

  async delete(): Promise<APIResponse> {
    this.response = await this.requestContext.delete(this.buildUrl(), { headers: this.headers });
    return this.response;
  }

  private buildUrl(): string {
    const queryString = this.queryParams.toString();
    return queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
  }

  async getResponseJson(): Promise<any> {
    if (!this.response) throw new Error('No response available. Call an HTTP method first.');
    return this.response.json();
  }

  async getFieldValue(path: string): Promise<any> {
    const json = await this.getResponseJson();
    return path.split('.').reduce((acc: any, key: string) => acc?.[key], json);
  }

  getStatusCode(): number {
    if (!this.response) throw new Error('No response available. Call an HTTP method first.');
    return this.response.status();
  }

  printLog(): RestClient {
    console.log("Logs: ");
    console.log('→', this.endpoint);
    Object.keys(this.headers).forEach(key => console.log(`  - ${key}: ${this.headers[key]}`));
    if (this.body) console.log('  - body:', JSON.stringify(this.body, null, 2));
    return this;
  }

  reset(): RestClient {
    this.endpoint = '';
    this.headers = {};
    this.queryParams = new URLSearchParams();
    this.body = null;
    this.response = null;
    return this;
  }
  
}
