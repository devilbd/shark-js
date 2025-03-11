import { HttpClient } from "../communication/http-client";
import { DependencyResolver } from "../dependency-resolver/dependency-resolver";
import { ComponentResolver } from "../../ui/component-resolver";
import { ChangeDetector } from "../../ui/change-detector";
import { Router } from "../router/router.service";

export class SharkCore { 
    public dependencyResolver = new DependencyResolver();
    private componentResolver: ComponentResolver;
    public appName?: string;

    constructor() {
        this.dependencyResolver.registerType<SharkCore>('SharkCore', SharkCore);

        this.dependencyResolver.registerSingletonType<ChangeDetector>('ChangeDetector', ChangeDetector, [], () => {
            return {
                updateView: (component: any) => this.updateView(component)
            }
        });

        this.dependencyResolver.registerType<HttpClient>('HttpClient', HttpClient);
        this.dependencyResolver.registerType<ComponentResolver>('ComponentResolver', ComponentResolver, [], () => {
            return this.dependencyResolver;
        }); // need to pass dependencyresolver here as inject
        this.componentResolver = this.dependencyResolver.getType<ComponentResolver>('ComponentResolver');

        this.dependencyResolver.registerSingletonType<Router>('Router', Router, [], () => {
            return  {
                dependencyResolver: this.dependencyResolver,
                componentResolver: this.componentResolver
            }
        });
    }

    runApp(appConfig: AppConfig) {
        this.dependencyResolver.getType<Router>('Router').routes = appConfig.routes;
        this.appName = appConfig.name;
        this.componentResolver.resolveComponents();
    }

    updateView(component: any) {
        this.componentResolver.resolveBindings(component);
    }
}

export interface AppConfig {
    name: string;
    routes: any[];
}