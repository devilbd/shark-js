import { Dependency, DependencyResolver } from "../core/dependency-resolver/dependency-resolver";

export class SharkJSContext {
    dataContext: any;
    state: string = '';

    constructor() {

    }
}

export class ComponentResolver extends Dependency {
    dependencyResolver: DependencyResolver;

    constructor(args: any) {
        super('ComponentResolver');
        this.dependencyResolver = args.injectedData as DependencyResolver;
    }

    resolveComponents(phase: string = '') {
        const components = document.querySelectorAll('[bind-component]');
        components.forEach(componentRef => {            
            const componentName = componentRef.attributes.getNamedItem('bind-component')?.value;
            if (componentName) {
                const componentInstance = this.dependencyResolver.getType(componentName);
                this.sharkJSConextFactory(componentRef, {...componentInstance});
                switch(phase) {
                    case 'text-bindings':
                        this.resolveTextBindings(componentRef as HTMLElement, componentInstance);
                        break;
                    case 'event-bindings':
                        this.resolveEventBindings(componentRef as HTMLElement, componentInstance);
                        break;
                    case 'repeatable-bindings':
                        this.resolveRepeatableBindings(componentRef as HTMLElement, componentInstance);
                    case 'input-bindings':
                        this.resolveInputBindings(componentRef as HTMLElement, componentInstance);
                        break;
                    case 'css-class-bindings':
                        this.resolveCssClassBindings(componentRef as HTMLElement, componentInstance);
                        break;
                    default:
                        this.resolveTextBindings(componentRef as HTMLElement, componentInstance);
                        this.resolveInputBindings(componentRef as HTMLElement, componentInstance);
                        this.resolveRepeatableBindings(componentRef as HTMLElement, componentInstance);
                        this.resolveCssClassBindings(componentRef as HTMLElement, componentInstance);
                        this.resolveEventBindings(componentRef as HTMLElement, componentInstance);
                        break;
                }
                (<any>componentRef).sharkJS.state = 'resolved';
            }
        });
    }

    resolveInputBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-value]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-value')?.value;
            if (bindingValue) {
                const newValue = (<any>binding).value;
                if (componentInstance[bindingValue] != null) {
                    (<any>binding).value = componentInstance[bindingValue];
                }
                componentInstance[bindingValue] = newValue;
            }
        });
    }

    resolveTextBindings(componentRef: HTMLElement, componentInstance: any) {
        const textBindings = componentRef.querySelectorAll('[bind-text]');
        textBindings.forEach(textBinding => {
            const textBindingValue = textBinding.attributes.getNamedItem('bind-text')?.value;
            if (textBindingValue) {
                textBinding.innerHTML = componentInstance[textBindingValue];
            }
        });
    }

    resolveEventBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-event]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-event')?.value;
            if (bindingValue) {
                // bind-event="mouseover:onMouseOver,mouseleave:onMouseLeft"
                const events = bindingValue.split(",");
                events.forEach(event => {
                    const evetnSplitValue = event.split(':');
                    const eventType = evetnSplitValue[0];
                    const eventSource = evetnSplitValue[1];
                    const sharkJS = this.getSharkJSContextFromParent(binding as HTMLElement);
                    binding.addEventListener(eventType, (e) => {
                        setTimeout(() => {
                            componentInstance[eventSource].apply(componentInstance, [{ event: e, sharkJS: sharkJS }]);
                        });
                    });
                });
            }
        });
    }

    resolveRepeatableBindings(componentRef: HTMLElement, componentInstance: any) {
        const resolveRepeatableBindings = componentRef.querySelectorAll('[bind-for]');
        resolveRepeatableBindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-for')?.value;
            if (bindingValue) {
                // bind-for="arrSource;item"
                // bind="item.key"
                const bindingValueSplit = bindingValue.split(";");
                const arrSrc = bindingValueSplit[0];
                const indexedItem = bindingValueSplit[1];
                const track = bindingValueSplit[2];
                const template = (<any>binding).htmlTemplate || binding.innerHTML;
                const arraySrc = componentInstance[arrSrc] as any[];
                
                if (bindingValue && (!(<any>binding).sharkJS || (<any>binding).sharkJS.state != 'resolved')) {
                    this.sharkJSConextFactory(binding, arrSrc);
                    (<any>binding).htmlTemplate = template;
                    binding.innerHTML = '';

                    arraySrc.forEach((item, idx) => {
                        const elNode = document.createElement('div');
                        this.sharkJSConextFactory(elNode, item);

                        elNode.innerHTML = template;
                        if (track) {
                            elNode.setAttribute(`data-idx-${idx}`, '');
                        }
                        binding.appendChild(elNode);
                    });
    
                    this.resolveSimpleBind(binding as HTMLElement);
                    (<any>binding).sharkJS.state = 'resolved';
                } else if ((<any>binding).sharkJS && (<any>binding).sharkJS.state == 'resolved') {
                    this.resolveSimpleBind(binding as HTMLElement);
                }
            }
        });
    }

    resolveSimpleBind(componentRef: HTMLElement) {
        const simpleBindings = componentRef.querySelectorAll('[bind]');
        simpleBindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind')?.value;
            if (bindingValue) {
                const bindingValueSplit = bindingValue.split(".");
                // item.key
                // const item = bindingValueSplit[0];
                const itemKey = bindingValueSplit[1];
                const dataContext = this.getDataContextFromParent(binding as HTMLElement); // (<any>binding.parentElement).sharkJS.dataContext;
                if (dataContext != null && dataContext.hasOwnProperty(itemKey)) {
                    const value = dataContext[itemKey];
                    if (value != null) {
                        binding.innerHTML = value;
                    } else {
                        binding.innerHTML = '';
                    }
                }
            }
        });
    }

    resolveCssClassBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-class]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-class')?.value;
            if (bindingValue) {
                // bind-class="hover-class1:testHover,hover-class2:!testHover"
                // bind-class="class-name:conditionBasedOnDataContext(dataContext)"
                const bindingValueSplit = bindingValue.split(',');
                bindingValueSplit.forEach(splitBinding => {
                    const conditions = splitBinding.split(':');
                    const cssClass = conditions[0];
                    let condition = componentInstance[conditions[1]];

                    if (typeof condition == 'function') {
                        const sharkJS = this.getSharkJSContextFromParent(binding as HTMLElement); // (<any>binding).sharkJS || (<any>binding).parentElement.sharkJS;
                        condition = condition(sharkJS);
                    }

                    if (conditions[1].includes('!')) {
                        condition = componentInstance[conditions[1].split('!')[1]];
                        condition = !condition;
                    }
                    if (condition) {
                        binding.classList.add(cssClass);
                    } else {
                        binding.classList.remove(cssClass);
                    }
                });
            }
        });
    }

    sharkJSConextFactory(elementRef: any, dataContext: any) {
        elementRef.sharkJS = {
            state: 'creating',
            dataContext: dataContext
        } as SharkJSContext;
    }

    getSharkJSContextFromParent(bindingRef: HTMLElement): any {
        if (bindingRef != null) {
            const sharkJS = (<any>bindingRef).sharkJS as SharkJSContext;
            if (sharkJS == null) {
                return this.getSharkJSContextFromParent(<any>bindingRef.parentElement as HTMLElement);
            } else {
                return sharkJS;
            }
        }
    }

    getDataContextFromParent(bindingRef: HTMLElement): any {
        if (bindingRef != null) {
            const sharkJS = (<any>bindingRef).sharkJS as SharkJSContext;
            if (sharkJS == null) {
                return this.getDataContextFromParent(<any>bindingRef.parentElement as HTMLElement);
            } else {
                return sharkJS.dataContext;
            }
        }
    }
}