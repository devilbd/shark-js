import { App } from "./app";
import { DashboardComponent } from "./dashboard-component/dashboard.component";
import { MainDataService } from "./data/main-data.service";
import "./app.scss";

(() => {
    const app = new App();
    
    // Register dependencies
    app.dependencyResolver.registerApp(app, 'App');
    app.dependencyResolver.registerType(DashboardComponent, 'DashboardComponent', []);
    app.dependencyResolver.registerType(MainDataService, 'MainDataService', []);

    app.run();
})();