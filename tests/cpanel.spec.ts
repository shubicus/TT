import {test} from "../fixture";
import {Addons, CPanelLicenses} from "../constants/product";

//todo improvements --> select a random product & addon on each run.
test('Verify cPanel checkout workflow', async ({app}) => {
    //1
    await app.shop.open();
    //2
    await app.shop.addToCart(CPanelLicenses.ACCOUNT_30);
    //3
    await app.configure.fillIPAddress('2.2.2.2');
    //4
    await app.configure.checkAddon([Addons.MONTHLY_CLOUD_LINUX]);
    //5.1
    await app.configure.expectTotalDueToday();
    //5.2
    await app.configure.clickContinue();
    //6
    await app.review.expectLoaded();
    await app.review.expectOnlyTheseItemsTitleArePresent([CPanelLicenses.ACCOUNT_30, Addons.MONTHLY_CLOUD_LINUX]);
    await app.review.expectSubtotalPriceIsCorrect();
    await app.review.expectTotalDueTodayPriceIsCorrect();
    //7
    await app.review.clickCheckout();
    //8
    await app.checkout.expectProductsInfoIsCorrect();
    await app.checkout.expectSubtotalPriceIsCorrect()
    await app.checkout.expectTotalDueTodayPriceIsCorrect()
    await app.checkout.expectSectionsAreVisible()
    await app.checkout.expectBtnCompleteOrder()
});