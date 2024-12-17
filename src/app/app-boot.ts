import { App } from "./app";
import { DashboardComponent } from "./dashboard-component/dashboard.component";
import { MainDataService } from "./data/main-data.service";

(() => {
    const components = [
        {
            name: 'DashboardComponent',
            type: DashboardComponent
        }
    ];
    const services = [
        {
            name: 'MainDataService',
            type: MainDataService
        }
    ];
    const app = new App();
})();