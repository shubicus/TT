import {AppPage} from "../abstractClasses";
import {Header} from "../component/header.component";
import {step} from "../../reporters/step";

export class Home extends AppPage {
    
    public pagePath = '/index.php';
    public header = new Header(this.page);

    @step()
    async expectLoaded(message = 'Expected Home page to be opened') {
        await this.header.expectLoaded();
    }
}