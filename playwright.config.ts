import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, ".env") });

const ENV = process.env.ENV || "qa";
dotenv.config({ path: path.resolve(__dirname, `.env.${ENV}`) });

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    retries: 1,
    // reporter: [
    //     ["list"],
    //     ["html", { outputFolder: `test-results/${ENV}-report`, open: "never" }],
    // ],
    // metadata: {
    //     environment: ENV,
    // },
    projects: [{
        name: 'api',
        use: {
            // baseURL: process.env.BASE_URL,
        }
    }],
});