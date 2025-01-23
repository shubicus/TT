import "dotenv/config";
import {env} from "./env";
import {defineConfig, devices} from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 *
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    workers: "90%",
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: 'html',
    timeout: process.env.CI ? 30_000 : 300_000,

    use: {
        baseURL: env.UI_URL,
        headless: !!process.env.CI,
        trace: 'on-first-retry',
        screenshot: 'on-first-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },
    ],

});