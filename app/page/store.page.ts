import {expect} from "@playwright/test";
import {AppPage} from "../abstractClasses";
import {step} from "../../reporters/step";
import {CPanelLicenses} from "../../constants/product";

export class StoreCpanelLicenses extends AppPage {

    public pagePath = '/store/cpanel-licenses';
    private productList = this.page.locator('#products')

    @step()
    async expectLoaded(message = 'Expected Store page to be opened') {
        await expect(this.productList.last(), message).toBeVisible()
    }

    @step()
    async addToCart(cPanelProduct: CPanelLicenses) {
        await this.page.locator('.products .product.clearfix')
            .filter({hasText: cPanelProduct})
            .locator('.btn-order-now')
            .click()
    }
}