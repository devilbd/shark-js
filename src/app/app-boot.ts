import { App } from "./app";
import { DashboardComponent } from "./dashboard-component/dashboard.component";
import { MainDataService } from "./data/main-data.service";
import "./app.scss";

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
    
    app.dependencyResolver.registerApp(app, 'App');

    components.forEach(component => {
        app.dependencyResolver.registerType(component.type, component.name, [], () => {
            return app.dependencyResolver;
        });
    });

    services.forEach(service => {
        app.dependencyResolver.registerType(service.type, service.name, [], () => {
            return app.dependencyResolver;
        });
    });

    app.run();
})();