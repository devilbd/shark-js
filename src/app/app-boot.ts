
import { SharkCore } from "../framework/core/shark-core/shark-core";
import { AppRootComponent } from "./views/app-root/app-root.component";
import { MainDataService } from "./data/main-data.service";
import { DashboardComponent } from "./components/dashboard-component/dashboard.component";
import { SimpleBindingSampleComponent } from "./views/simple-binding-sample/simple-binding-sample.component";
import { RepeatableSampleComponent } from "./views/repeatable-sample/repeatable-sample.component";
import { EventsSampleComponent } from "./views/events-sample/events-sample.component";
import './styles/main.scss';

(() => {
    const sharkCore = new SharkCore();
    
    // Register dependencies
    sharkCore.dependencyResolver.registerSingletonType<AppRootComponent>('AppRootComponent', AppRootComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<MainDataService>('MainDataService', MainDataService);
    sharkCore.dependencyResolver.registerSingletonType<DashboardComponent>('DashboardComponent', DashboardComponent, ['MainDataService', 'ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<SimpleBindingSampleComponent>('SimpleBindingSampleComponent', SimpleBindingSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<RepeatableSampleComponent>('RepeatableSampleComponent', RepeatableSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<EventsSampleComponent>('EventsSampleComponent', EventsSampleComponent, ['ChangeDetector']);
    
    sharkCore.runApp('App');
})();