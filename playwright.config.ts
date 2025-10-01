import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
testDir: './tests',
timeout: 30_000,
retries: 1,
// reporter: [ ['list'], ['html', { open: 'never' }] ],
projects: [ { name: 'api', 
    use: {
        baseURL: process.env.BASE_URL
} } ],
});