import {PageHolder} from "./abstractClasses";
import {Home} from "./page/home.page";
import {StoreCpanelLicenses} from "./page/store.page";
import {Checkout, Configure, Review} from "./page/cart.page";

export class Application extends PageHolder {

    public home = new Home(this.page);
    public shop = new StoreCpanelLicenses(this.page);
    public configure = new Configure(this.page);
    public review = new Review(this.page);
    public checkout = new Checkout(this.page);

}
