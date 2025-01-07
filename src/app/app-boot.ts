import { DashboardComponent } from "./dashboard-component/dashboard.component";
import { MainDataService } from "./data/main-data.service";
import { SharkCore } from "../framework/core/shark-core/shark-core";
import { AppComponent } from "./app-component/app.component";

(() => {
    const sharkCore = new SharkCore();
    
    // Register dependencies
    sharkCore.dependencyResolver.registerSingletonType<AppComponent>('AppComponent', AppComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<MainDataService>('MainDataService', MainDataService);
    sharkCore.dependencyResolver.registerSingletonType<DashboardComponent>('DashboardComponent', DashboardComponent, ['MainDataService', 'ChangeDetector']);

    sharkCore.runApp('App');
})();