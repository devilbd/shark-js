import { Configurations } from "../../common/configurations";
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
        // should be refactored
        this.dependencyResolver.registerType<SharkCore>('SharkCore', SharkCore);

        this.dependencyResolver.registerSingletonType<Router>('Router', Router, [], () => {
            return this.dependencyResolver;
        });

        this.dependencyResolver.registerType<Configurations>('Configurations', Configurations);

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
        const configurations = this.dependencyResolver.getType<Configurations>('Configurations');
    }

    runApp(appName: string) {
        this.appName = appName;
        this.componentResolver.resolveComponents();
    }

    updateView(component: any) {
        this.componentResolver.resolveBindings(component);
    }
}