import {Page, test as base} from "@playwright/test";
import {Application} from "../app";


type PagesFixture = {
    app: Application;
};

function createFixture<T>(Constructor: new (page: any) => T) {
    return async ({page}: { page: Page }, use: (fixture: T) => Promise<void>) => {
        await use(new Constructor(page));
    };
}

export const test = base.extend<PagesFixture>({
    app: createFixture(Application),
});