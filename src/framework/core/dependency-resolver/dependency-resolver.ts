import { ComponentResolver } from "../../ui/component-resolver";
import { generateGUID } from "../helpers/guid-generator.helper";

export class DependencyResolver {
    private container = new Map<string, { constructor: any, dependencies: string[] | undefined, type: string | undefined }>();

    constructor() {}

    registerType<T>(name: string, constructor: new (...args: any[]) => T, dependencies: string[] = [], injectionFactory?: Function) {
        if (injectionFactory) {
            constructor.prototype.injectedData = injectionFactory();
        }
        this.container.set(name.toLowerCase(), { constructor, dependencies, type: 'service' });
    }

    registerSingletonType<T>(name: string, constructor: new (...args: any[]) => T, dependencies: string[] = [], injectionFactory?: Function) {
        if (injectionFactory) {
            constructor.prototype.injectedData = injectionFactory();
        }

        const args = dependencies.map(dep => this.getType(dep));
        const instance = new constructor(...args) as any;

        this.container.set(name.toLowerCase(), { constructor: instance, dependencies: undefined, type: 'service' });
    }

    declareComponent<T>(name: string, constructor: new (...args: any[]) => T, dependencies: string[] = [], injectionFactory?: Function) {
        if (injectionFactory) {
            constructor.prototype.injectedData = injectionFactory();
        }

        const guid = generateGUID();
        const args = dependencies.map(dep => this.getType(dep));
        
        // const componentName = `${name}__${guid}`;
        // const instance = new constructor({...args, ...{ contextId: guid }}) as any;
        const instance = new constructor(...args) as any;
        instance.name = name.toLowerCase();
        instance.contextId = guid;

        this.container.set(`${name.toLowerCase()}__${guid}`, { constructor: instance, dependencies: undefined, type: 'component' });
    }

    get allComponents() {
        const result: any[] = [];
        this.container.forEach((v, key, map) => {
            if (v.type === 'component') {
                result.push(v);
            }
        });
        return result;
    }

    getComponent<T>(name: string): T {
        let target; // = this.container.get(name);

        this.container.forEach((v, key, map) => {
            let instanceName = (<any>v.constructor).name?.toLowerCase();
            let instanceContextId = (<any>v.constructor).contextId;
            if (instanceName != null && instanceName.includes(name.toLowerCase())) {
                let constructorName = `${instanceName.toLowerCase()}__${instanceContextId}`;
                target = this.container.get(constructorName.toLowerCase());
                if (target != null) {
                    return target;
                }
            }
            
        });

        if (!target) {
            throw new Error(`Service ${name.toLowerCase()} not found`);
        }

        const { constructor, dependencies } = target;
        // let args;
        // if (dependencies) {
        //     args = dependencies.map(dep => this.getType(dep));
        //     return new constructor(...args);
        // }
        return constructor;
    }

    getType<T>(name: string): T {
        const target = this.container.get(name.toLowerCase());

        if (!target) {
            throw new Error(`Service ${name.toLowerCase()} not found`);
        }

        const { constructor, dependencies } = target;
        let args;
        if (dependencies) {
            args = dependencies.map(dep => this.getType(dep));
            return new constructor(...args);
        }
        return constructor;
    }
}