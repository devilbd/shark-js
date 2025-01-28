import { generateGUID } from "../helpers/guid-generator.helper";

export class DependencyResolver {
    private container = new Map<string, { constructor: any, dependencies: string[] | undefined }>();

    constructor() {

    }

    registerType<T>(name: string, constructor: new (...args: any[]) => T, dependencies: string[] = [], injectionFactory?: Function) {
        if (injectionFactory) {
            constructor.prototype.injectedData = injectionFactory();
        }
        this.container.set(name, { constructor, dependencies });
    }

    registerSingletonType<T>(name: string, constructor: new (...args: any[]) => T, dependencies: string[] = [], injectionFactory?: Function) {
        if (injectionFactory) {
            constructor.prototype.injectedData = injectionFactory();
        }

        const args = dependencies.map(dep => this.getType(dep));
        const instance = new constructor(...args) as any;

        this.container.set(name, { constructor: instance, dependencies: undefined });
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
        instance.name = name;
        instance.contextId = guid;

        this.container.set(`${name}__${guid}`, { constructor: instance, dependencies: undefined });
    }

    getComponent<T>(name: string): T {
        let target; // = this.container.get(name);

        this.container.forEach((v, key, map) => {
            let instanceName = (<any>v.constructor).name;
            let instanceContextId = (<any>v.constructor).contextId;
            if (instanceName != null && instanceName.includes(name)) {
                let constructorName = `${instanceName}__${instanceContextId}`;
                target = this.container.get(constructorName);
                if (target != null) {
                    return target;
                }
            }
            
        });

        if (!target) {
            throw new Error(`Service ${name} not found`);
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
        const target = this.container.get(name);

        if (!target) {
            throw new Error(`Service ${name} not found`);
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