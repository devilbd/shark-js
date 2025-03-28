// Core
import { AppConfig, SharkCore } from "../framework/core/shark-core/shark-core";

// Styles
import './styles/main.scss';

// Providers
import { FirebaseProvider } from './data/firebase.provider';

// Services
import { MainDataService } from "./data/main-data.service";
import { NotificationsService } from "./services/notifications/notifications.service";

// Components
import { AppRootComponent } from "./views/app-root/app-root.component";

// Parent component needs be imported before child's one
import { HttpClientSampleComponent } from "./views/html-client-sample/http-client-sample.component";
import { DropDownComponent } from "./components/drop-down/drop-down.component";
import { DashboardComponent } from "./components/dashboard-component/dashboard.component";

// import { MonacoEditorComponent } from "./components/monaco-editor-component/monaco-editor.component";

// Views
import { ConditionsSampleComponent } from "./views/conditions-sample/conditions-sample.component";
import { SimpleBindingSampleComponent } from "./views/simple-binding-sample/simple-binding-sample.component";
import { RepeatableSampleComponent } from "./views/repeatable-sample/repeatable-sample.component";
import { EventsSampleComponent } from "./views/events-sample/events-sample.component";
import { PropertyBindingsSampleComponent } from "./views/property-bindings-sample/property-bindings-sample.component";
import { FormsBindingSampleComponent } from "./views/forms-binding-sample/forms-binding-sample.component";
import { NotificationsSampleComponent } from "./views/notifications-sample/notifications-sample.component";
import { AnalogueClockComponent } from "./components/analogue-clock/analogue-clock.component";
import { RouterSampleComponent } from "./views/router-sample/router-sample.component";
import { routes } from "./views/app-routes";

(() => {
    const sharkCore = new SharkCore();
    // Register dependencies

    // FirebaseProvider
    sharkCore.dependencyResolver.registerSingletonType<FirebaseProvider>('FirebaseProvider', FirebaseProvider);
    sharkCore.dependencyResolver.registerSingletonType<MainDataService>('MainDataService', MainDataService, ['FirebaseProvider']);
    sharkCore.dependencyResolver.registerSingletonType<NotificationsService>('NotificationsService', NotificationsService);

    sharkCore.dependencyResolver.declareComponent<AppRootComponent>('AppRootComponent', AppRootComponent, ['ChangeDetector', 'MainDataService']);
    sharkCore.dependencyResolver.declareComponent<SimpleBindingSampleComponent>('SimpleBindingSampleComponent', SimpleBindingSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.declareComponent<ConditionsSampleComponent>('ConditionsSampleComponent', ConditionsSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.declareComponent<DropDownComponent>('DropDownComponent', DropDownComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.declareComponent<AnalogueClockComponent>('AnalogueClockComponent', AnalogueClockComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.declareComponent<DashboardComponent>('DashboardComponent', DashboardComponent, ['ChangeDetector', 'NotificationsService']);
    // sharkCore.dependencyResolver.declareComponent<MonacoEditorComponent>('MonacoEditorComponent', MonacoEditorComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.declareComponent<HttpClientSampleComponent>('HttpClientSampleComponent', HttpClientSampleComponent, ['ChangeDetector', 'HttpClient']);
    sharkCore.dependencyResolver.declareComponent<RepeatableSampleComponent>('RepeatableSampleComponent', RepeatableSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.declareComponent<EventsSampleComponent>('EventsSampleComponent', EventsSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.declareComponent<PropertyBindingsSampleComponent>('PropertyBindingsSampleComponent', PropertyBindingsSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.declareComponent<FormsBindingSampleComponent>('FormsBindingSampleComponent', FormsBindingSampleComponent, ['ChangeDetector']);
    sharkCore.dependencyResolver.declareComponent<NotificationsSampleComponent>('NotificationsSampleComponent', NotificationsSampleComponent, ['ChangeDetector', 'NotificationsService']);
    sharkCore.dependencyResolver.declareComponent<RouterSampleComponent>('RouterSampleComponent', RouterSampleComponent, ['ChangeDetector', 'Router']);

    const appConfig = {
        name: 'AppRootComponent',
        routes: routes()
    } as AppConfig;
    sharkCore.runApp(appConfig);
})();