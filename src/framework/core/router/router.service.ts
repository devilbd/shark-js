import { ComponentResolver } from '../../ui/component-resolver';
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
    componentResolver: ComponentResolver;

    constructor() {
        const injectedData = (<any>this).injectedData;
        this.dependencyResolver = injectedData.dependencyResolver as DependencyResolver;
        this.componentResolver = injectedData.componentResolver as ComponentResolver;
        
        window.addEventListener('hashchange', () => {
            this.navigateToRoute(window.location.hash);
        });
    }

    navigateToRoute(path: string) {
        // history.pushState({}, '', path);
        window.location.hash = `${path}`;
        const route = this.routes.filter(route => route.path === window.location.hash);
        
        if (route != null) {
            const routerComponent = document.querySelector('router') as HTMLElement;
            if (routerComponent != null) {
                routerComponent.classList.add('router');
                const componentForResolveDOM = document.createElement('div');
                componentForResolveDOM.setAttribute('bind-component', route[0].componentName);
                routerComponent.appendChild(componentForResolveDOM);
                this.componentResolver.resolveComponents(routerComponent);
            }
        }
    }

    isPathExists(path: string): boolean {
        return this.routes.some(route => route.path === path);
    }
}