// Core
import { SharkCore } from "../framework/core/shark-core/shark-core";

// Styles
import './styles/main.scss';

// Services
import { MainDataService } from "./data/main-data.service";

// Components
import { AppRootComponent } from "./views/app-root/app-root.component";
import { DashboardComponent } from "./components/dashboard-component/dashboard.component";
// Parent component needs be imported before child's one
import { ConditionsSampleComponent } from "./views/conditions-sample/conditions-sample.component";

import { SimpleBindingSampleComponent } from "./views/simple-binding-sample/simple-binding-sample.component";
import { RepeatableSampleComponent } from "./views/repeatable-sample/repeatable-sample.component";
import { EventsSampleComponent } from "./views/events-sample/events-sample.component";

(() => {
    const sharkCore = new SharkCore();
    
    // Register dependencies
    sharkCore.dependencyResolver.registerSingletonType<AppRootComponent>('AppRootComponent', AppRootComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<MainDataService>('MainDataService', MainDataService);
    sharkCore.dependencyResolver.registerSingletonType<ConditionsSampleComponent>('ConditionsSampleComponent', ConditionsSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<DashboardComponent>('DashboardComponent', DashboardComponent, ['MainDataService', 'ChangeDetector']);
    sharkCore.dependencyResolver.registerType<SimpleBindingSampleComponent>('SimpleBindingSampleComponent', SimpleBindingSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<RepeatableSampleComponent>('RepeatableSampleComponent', RepeatableSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.registerSingletonType<EventsSampleComponent>('EventsSampleComponent', EventsSampleComponent, ['ChangeDetector']);
    
    sharkCore.runApp('AppRootComponent');
})();