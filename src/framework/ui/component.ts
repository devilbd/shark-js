export interface ComponentOptions {
    name: string;
    html?: string;
}

export function Component(componentOptions: ComponentOptions) {
    return function <T extends { new (...args: any[]): { } }>(constructor: T) {
        const result = class extends constructor implements ComponentOptions {
            name = componentOptions.name;
            componentHtml = componentOptions.html;
        }
        return result;
    }
}