import { AppCore } from "./app";

export function run(appName: string, appInstance: Function, components: object[]) {
    const app = new AppCore(appName, appInstance, components);
    app.run();

    const result = {
        appInstance: app
    };

    return result;
}