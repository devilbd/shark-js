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