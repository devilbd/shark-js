import { DependencyResolver } from '../dependency-resolver/dependency-resolver';
import './router.scss';

export interface IRoute { 
    componentName: string;
    path: string;
    parameters: { key: string, value: string } | undefined;
}

export class Router {

    routes!: IRoute[];
    dependencyResolver: DependencyResolver;

    constructor() {
        this.dependencyResolver = (<any>this).injectedData as DependencyResolver;
    }

    navigateToRoute(path: string) {
        history.pushState({}, '', path);
        const route = this.routes.filter(route => route.path === window.location.pathname);
        
        if (route != null) {
            const routerComponent = document.querySelector('router') as HTMLElement;
            if (routerComponent != null) {
                console.log(routerComponent);
                routerComponent.classList.add('router');
                const componentForResolve = this.dependencyResolver.getComponent(route[0].componentName)
                console.log(componentForResolve);
            }
        }
    }

    isPathExists(path: string): boolean {
        return this.routes.some(route => route.path === path);
    }
}