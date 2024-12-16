import { AppCore } from "./core/app-core/app-core";

export function run(appName: string, appInstance: Function, components: object[], services: object[]) {
    const app = new AppCore(appName, appInstance, components, services);
    app.run();

    const result = {
        appInstance: app
    };

    return result;
}