import { Configurations } from "../../common/configurations";
import { HttpClient } from "../communication/http-client";
import { DependencyResolver } from "../dependency-resolver/dependency-resolver";
import { ComponentResolver } from "../../ui/component-resolver";

export class AppCore { 
    public dependencyResolver = new DependencyResolver();
    // public appName: string;
    // public appInstance: object;
    private componentResolver: ComponentResolver;

    constructor() {
        this.dependencyResolver.registerType(Configurations, 'Configurations', [], () => 'test');
        this.dependencyResolver.registerType(HttpClient, 'HttpClient', []);
        this.dependencyResolver.registerType(ComponentResolver, 'ComponentResolver', [], () => {
            return this.dependencyResolver;
        });

        this.componentResolver = this.dependencyResolver.getType('ComponentResolver') as ComponentResolver;

        const configurations = this.dependencyResolver.getType('Configurations') as Configurations;

        // components.forEach(component => {
        //     this.dependencyResolver.registerType(component.type, component.name, [], () => {
        //         return this.dependencyResolver;
        //     });
        // });

        // services.forEach(service => {
        //     this.dependencyResolver.registerType(service.type, service.name, [], () => {
        //         return this.dependencyResolver;
        //     });
        // });

        // this.dependencyResolver.registerType(appInstance, appName, []);
        // this.appName = appName;
        // this.appInstance = this.dependencyResolver.getType(appName);

        // (<any>this.appInstance).updateView = () => this.updateView();
        // (<any>this.appInstance).updateCss = () => this.updateCss();
    }

    run() {        
        this.componentResolver.resolveComponents();
    }

    updateView() {
        this.componentResolver.resolveComponents('input-bindings');
        this.componentResolver.resolveComponents('text-bindings');
        this.componentResolver.resolveComponents('repeatable-bindings');
    }

    updateCss() {
        this.componentResolver.resolveComponents('css-class-bindings');
    }
}