import {expect} from "@playwright/test";
import {Component} from "../abstractClasses";
import {step} from "../../reporters/step";

export class Header extends Component {
    private shopLink = this.page.locator('#header')

    @step()
    async expectLoaded(message = 'Expected Header to be loaded'): Promise<void> {
        await expect(this.shopLink, message).toBeVisible();
    }

}