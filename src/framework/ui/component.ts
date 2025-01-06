export interface ComponentOptions {
    name: string;
    html?: string;
}

export function Component(componentOptions: ComponentOptions) {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        const result = class extends constructor implements ComponentOptions {
            name = componentOptions.name;
        }
        const el = document.querySelector(`[bind-component="${componentOptions.name}"]`) as HTMLElement;
        if (el && componentOptions.html) {
            el.innerHTML = componentOptions.html;
        }
        return result;
    }
}