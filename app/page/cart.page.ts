import {expect} from "@playwright/test";
import {AppPage} from "../abstractClasses";
import {step} from "../../reporters/step";
import {Addons, CPanelLicenses, EProduct, TProduct} from "../../constants/product";

abstract class Cart extends AppPage {
    public pagePath = '/cart.php?a=confproduct';
}

export class Configure extends Cart {

    public heading = this.page.getByRole('heading', {name: 'Configure'});
    public ipAddress = this.page.getByLabel('IP Address * Validating IP');
    public continue = this.page.getByRole('button', {name: 'Continue'});
    public totalDueToday = this.page.locator('.amt');

    @step()
    async expectLoaded(message = 'Expected Configure page to be opened') {
        await expect(this.heading, message).toBeVisible();
    }

    @step()
    async fillIPAddress(ipValue: string) {
        await this.ipAddress.fill(ipValue);

        //this is workaround to force validation process !!!
        await this.page.waitForTimeout(1000);
        await this.ipAddress.press('Enter');
        await this.page.waitForLoadState('networkidle')
    }

    @step()
    async checkAddon(addons: Addons[]) {
        for (const addon of addons) {
            await this.page.getByText(addon, {exact: true}).check();
        }
    }

    @step()
    async expectTotalDueToday(){
        const regex = /\$(?!0{1,2}(?:\.0{2})?$)\d+(?:\.\d{2})?\s*(USD)?/;
        await expect(this.totalDueToday).toBeVisible()
        await expect(this.totalDueToday).toHaveText(regex)
    }

    @step()
    async clickContinue() {
        await this.page.waitForLoadState('networkidle');
        await this.continue.click();
    }
}

export class Review extends Cart {

    public heading = this.page.getByRole('heading', {name: 'Review & Checkout'});
    public cartItems = this.page.locator('.view-cart-items .item');
    public subtotal = this.page.locator('#subtotal');
    public totalDueToday = this.page.locator('#totalDueToday');
    public checkout = this.page.locator('#checkout');

    private tProducts: TProduct [] = []

    @step()
    async expectLoaded(message = 'Expected Review & Checkout page to be opened') {
        await expect(this.heading, message).toBeVisible();
    }

    @step()
    async expectOnlyTheseItemsTitleArePresent(items: EProduct[]) {
        if (this.tProducts.length == 0) {
            await this.parseProducts()
        }

        expect(items).toEqual(this.tProducts.map(value => value.title))
    }

    @step()
    async expectSubtotalPriceIsCorrect() {
        const sumText = await this.getSum();
        await expect(this.subtotal).toHaveText(`$${sumText} USD`);
    }

    @step()
    async expectTotalDueTodayPriceIsCorrect() {
        const sumText = await this.getSum();
        await expect(this.totalDueToday).toHaveText(`$${sumText} USD`);
    }

    @step()
    async clickCheckout() {
        await this.page.waitForLoadState('networkidle');
        await this.checkout.click();
    }

    private async getSum() {
        if (this.tProducts.length == 0) {
            await this.parseProducts()
        }

        let sum = 0;
        for (const item of this.tProducts) {
            sum += item.dueTodayPrice
        }

        return sum.toFixed(2);
    }

    private async parseProducts() {
        const items = await this.cartItems.all();

        for (const itemLocator of items) {
            const titleText = await itemLocator.locator('.item-title').evaluate(node => {
                return Array.from(node.childNodes)
                    .filter((child) => child.nodeType === Node.TEXT_NODE) // Keep only text nodes
                    .map((textNode) => textNode.textContent?.trim()) // Extract and trim text
                    .join(''); // Join all text nodes together
            });

            const priceText = await itemLocator.locator('.item-price span:nth-of-type(1)').textContent();
            const priceMonthlyText = await itemLocator.locator('.item-price span:nth-of-type(2)').textContent();

            const dueTodayPrice = priceText ? Math.round(parseFloat(priceText.replace(/[^\d.]/g, '')) * 100) / 100 : 0;
            const recurringPrice = priceMonthlyText ? Math.round(parseFloat(priceMonthlyText.replace(/[^\d.]/g, '')) * 100) / 100 : 0;

            const addonsValues = Object.values(Addons);
            const cPanelLicensesValues = Object.values(CPanelLicenses);
            const allProducts = [...addonsValues, ...cPanelLicensesValues];
            const title = allProducts.find(product => product === titleText) as EProduct;

            const item: TProduct = {
                title,
                dueTodayPrice,
                recurringPrice
            };

            this.tProducts.push(item);
        }
    }

}

export class Checkout extends Cart {

    public heading = this.page.getByRole('heading', {name: 'Checkout'});
    public tableProducts = this.page.locator('table.table tbody tr');
    public cartSubtotal = this.page.locator('div#cartSubtotal');
    public totalCartPrice = this.page.locator('div#totalCartPrice');
    public btnCompleteOrder = this.page.locator('button#btnCompleteOrder');

    public container = this.page.locator('#containerNewUserSignup')
    public personalInformation = this.container.locator('.row:nth-of-type(3)')
    public billingAddress = this.container.locator('.row:nth-of-type(5)')
    public termsConditions = this.page.getByText('Terms & Conditions Notice of')
    public accountSecurity = this.page.getByText('Account Security Generate')

    private tProducts: TProduct [] = []

    @step()
    async expectLoaded(message = 'Expected Configure page to be opened') {
        await expect(this.heading, message).toBeVisible();
    }

    @step()
    async expectProductsInfoIsCorrect() {
        if (this.tProducts.length == 0) {
            await this.parseTable()
        }
    }

    @step()
    async expectSubtotalPriceIsCorrect() {
        const sumText = await this.getSum();
        await expect(this.cartSubtotal).toHaveText(`$${sumText} USD`);
    }

    @step()
    async expectTotalDueTodayPriceIsCorrect() {
        const sumText = await this.getSum();
        await expect(this.totalCartPrice).toHaveText(`$${sumText} USD`);
    }

    @step()
    async expectSectionsAreVisible() {
        await expect(this.personalInformation).toBeVisible();
        await expect(this.billingAddress).toBeVisible();
        await expect(this.termsConditions).toBeVisible();
        await expect(this.accountSecurity).toBeVisible();
    }

    @step()
    async expectBtnCompleteOrder() {
        await expect(this.btnCompleteOrder).toBeVisible();
    }

    private async parseTable() {
        await this.page.waitForLoadState("networkidle")
        const items = await this.tableProducts.all();

        for (const itemLocator of items) {
            const productTypeText = await itemLocator.locator('td:nth-of-type(1)').textContent();
            const ipAddressText = await itemLocator.locator('td:nth-of-type(3)').textContent();
            const recurringPriceText = await itemLocator.locator('td:nth-of-type(4)').textContent();
            const dueTodayPriceText = await itemLocator.locator('td:nth-of-type(5)').textContent();

            const addonsValues = Object.values(Addons);
            const cPanelLicensesValues = Object.values(CPanelLicenses);
            const allProducts = [...addonsValues, ...cPanelLicensesValues];
            const title = allProducts.find(product => product === productTypeText?.trim()) as EProduct;

            const ipAddress = ipAddressText?.trim();
            const recurringPrice = recurringPriceText ? Math.round(parseFloat(recurringPriceText.replace(/[^\d.]/g, '')) * 100) / 100 : 0;
            const dueTodayPrice = dueTodayPriceText ? Math.round(parseFloat(dueTodayPriceText.replace(/[^\d.]/g, '')) * 100) / 100 : 0;

            const item: TProduct = {
                title,
                ipAddress,
                dueTodayPrice,
                recurringPrice
            };

            this.tProducts.push(item);
        }

    }

    private async getSum() {
        if (this.tProducts.length == 0) {
            await this.parseTable()
        }

        let sum = 0;
        for (const item of this.tProducts) {
            sum += item.dueTodayPrice
        }

        return sum.toFixed(2);
    }
}
