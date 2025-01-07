import { App } from "./app";
import { DashboardComponent } from "./dashboard-component/dashboard.component";
import { MainDataService } from "./data/main-data.service";
import "./app.scss";
import { SharkCore } from "../framework/core/shark-core/shark-core";

(() => {
    const sharkCore = new SharkCore();
    
    // Register dependencies
    sharkCore.dependencyResolver.registerType<App>('App', App);
    sharkCore.dependencyResolver.registerType<MainDataService>('MainDataService', MainDataService);
    sharkCore.dependencyResolver.registerType<DashboardComponent>('DashboardComponent', DashboardComponent, ['MainDataService', 'ChangeDetector']);

    sharkCore.runApp('App');
})();