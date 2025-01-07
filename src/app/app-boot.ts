import { DashboardComponent } from "./dashboard-component/dashboard.component";
import { MainDataService } from "./data/main-data.service";
import { SharkCore } from "../framework/core/shark-core/shark-core";
import { AppComponent } from "./app-component/app.component";
import { SimpleBindingComponent } from "./simple-binding-component/simple-binding.component";
import { RepeatableComponent } from "./repeatable-component/repeatable.component";
import { EventsSampleComponent } from "./events-sample/events-sample.component";

(() => {
    const sharkCore = new SharkCore();
    
    // Register dependencies
    sharkCore.dependencyResolver.registerSingletonType<AppComponent>('AppComponent', AppComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<MainDataService>('MainDataService', MainDataService);
    sharkCore.dependencyResolver.registerSingletonType<DashboardComponent>('DashboardComponent', DashboardComponent, ['MainDataService', 'ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<SimpleBindingComponent>('SimpleBindingComponent', SimpleBindingComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<RepeatableComponent>('RepeatableComponent', RepeatableComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<EventsSampleComponent>('EventsSampleComponent', EventsSampleComponent, ['ChangeDetector']);
    
    sharkCore.runApp('App');
})();