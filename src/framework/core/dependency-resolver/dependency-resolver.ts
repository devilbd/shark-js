export class Dependency {
    name: string;
    instance!: object;
    constructor(dependencyName: string) {
        this.name = dependencyName;
    }
}

export class DependencyResolver {
    private container: Record<string, Dependency> = { };

    constructor() {

    }

    public registerType(instance: any, instanceName: string, dependencies: string[], injectionFactory?: Function, afterResolve?: Function) {
        const dependencyExist = this.container[instanceName] != null ? true : false;
        if (!dependencyExist) {
            const deps: Record<string, Dependency> = { };

            dependencies.forEach(dependencyName => {
                const dependency = this.container[dependencyName] as Dependency;
                if (dependency) {
                    (<any>deps)[dependencyName] = dependency;
                }
            });

            if (injectionFactory && typeof injectionFactory === 'function') {
                deps['injectedData'] = injectionFactory();
            }
            instance = new instance(deps);
            instance.name = instanceName;
            this.container[instance.name] = instance;
            if (afterResolve) afterResolve(instance);
        }
    }

    public registerApp(appInstance: any, appName: string) {
        this.container[appName] = appInstance;
    }

    public getType(dependencyName: string) {
        const result = this.container[dependencyName];

        if (result) {
            return result;
        }

        throw new Error('Dependency not found.');
    }
}