import { AppCore } from "./app";

export function run(appName: string, appInstance: Function) {
    const app = new AppCore(appName, appInstance);
    app.run();

    const result = {
        appInstance: app
    };

    return result;
}