export class DependencyResolver {
    private container = new Map<string, { constructor: any, dependencies: string[] }>();

    constructor() {

    }

    registerType<T>(name: string, constructor: new (...args: any[]) => T, dependencies: string[] = [], injectionFactory?: Function) {
        if (injectionFactory) {
            constructor.prototype.injectedData = injectionFactory();
        }
        this.container.set(name, { constructor, dependencies });
    }

    getType<T>(name: string): T {
        const target = this.container.get(name);
        if (!target) {
            throw new Error(`Service ${name} not found`);
        }

        const { constructor, dependencies } = target;
        const args = dependencies.map(dep => this.getType(dep));
        return new constructor(...args);
    }
}