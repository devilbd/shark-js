import { DependencyResolver } from "../core/dependency-resolver/dependency-resolver";
import { getDeepValue, setDeepValue } from "../core/helpers/deep-value.helper";

export class SharkJSContext {
    dataContext: any;
    state: string = '';

    constructor() {

    }
}

export class ComponentResolver {
    private dependencyResolver!: DependencyResolver;
    constructor() {
        this.dependencyResolver = (<any>this).injectedData as DependencyResolver;
    }

    resolveComponents(phase: string = '') {
        const components = document.querySelectorAll('[bind-component]');
        components.forEach(componentRef => {            
            const componentName = componentRef.attributes.getNamedItem('bind-component')?.value;
            if (componentName) {
                const componentInstance = this.dependencyResolver.getType(componentName) as any;
                // this.sharkJSConextFactory(componentRef, {...componentInstance});
                switch(phase) {
                    case 'text-bindings':
                        this.resolveTextBindings(componentRef as HTMLElement, componentInstance);
                        break;
                    case 'event-bindings':
                        this.resolveEventBindings(componentRef as HTMLElement, componentInstance);
                        break;
                    case 'repeatable-bindings':
                        this.resolveRepeatableBindings(componentRef as HTMLElement, componentInstance);
                        this.resolveEventBindings(componentRef as HTMLElement, componentInstance);
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
                // (<any>componentRef).sharkJS.state = 'resolved';
            }
        });
    }

    resolveBindings(component: any) {
        const componentName = component.name;
        const componentRef = document.querySelector(`[bind-component="${componentName}"]`);
        if (componentRef != null) {
            const componentInstance = this.dependencyResolver.getType(componentName) as any;
            this.resolveInputBindings(componentRef as HTMLElement, componentInstance);
            this.resolveTextBindings(componentRef as HTMLElement, componentInstance);            
            this.resolveRepeatableBindings(componentRef as HTMLElement, componentInstance);
            this.resolveCssClassBindings(componentRef as HTMLElement, componentInstance);
            this.resolveEventBindings(componentRef as HTMLElement, componentInstance);
        }
    }

    resolveInputBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-value]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-value')?.value;
            if (bindingValue) {
                const exist = this.checkExistingSourceForBinding(componentInstance, bindingValue);
                if (!exist) {
                    return;
                }

                if ((<any>binding).sharkJS != null) {
                    (<any>binding).sharkJS.state = 'updating';
                }

                this.sharkJSConextFactory(binding, {...componentInstance});

                let oldValue;
                if (bindingValue.indexOf('.') !== -1) {
                    const v = getDeepValue(componentInstance, bindingValue);
                    oldValue = v;
                } else if(componentInstance[bindingValue] != null) {
                    oldValue = componentInstance[bindingValue];
                }

                if ((<any>binding).sharkJS.state == 'updating') {
                    const newValue = (<any>binding).value;
                    if (bindingValue.indexOf('.') !== -1) {
                        setDeepValue(componentInstance, bindingValue, newValue);
                    } else if(componentInstance[bindingValue] != null) {
                        componentInstance[bindingValue] = newValue;
                    }
                } else if (oldValue !== (<any>binding).value && (<any>binding).sharkJS.state == 'creating') {
                    (<any>binding).value = oldValue;
                }

                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }

    resolveTextBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-text]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-text')?.value;
            let newValue;
            if (bindingValue) {
                const exist = this.checkExistingSourceForBinding(componentInstance, bindingValue);
                // console.log(`${exist} - component instance - ${componentInstance.name} - ${bindingValue}`)
                if (!exist) {
                    return;
                }
                this.sharkJSConextFactory(binding, {...componentInstance});
                // console.log(`component instance - ${componentInstance.name} - ${bindingValue}`);
                // console.log(componentInstance);
                if (bindingValue && bindingValue.indexOf('.') !== -1) {
                    const v = getDeepValue(componentInstance, bindingValue);
                    newValue = v;
                } else if(componentInstance[bindingValue] != null) {
                    newValue = componentInstance[bindingValue];
                }
                if (newValue != null) {
                    binding.innerHTML = newValue;
                }
                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }

    resolveEventBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-event]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-event')?.value;
            if (bindingValue) {
                const exist = this.checkExistingSourceForBinding(componentInstance, bindingValue);
                if (!exist) {
                    return;
                }

                this.sharkJSConextFactory(binding, {...componentInstance});

                // bind-event="mouseover:onMouseOver,mouseleave:onMouseLeft"
                let events: string[] = [];
                if (bindingValue.indexOf(',') > 0) {
                    events = bindingValue.split(",");
                } else {
                    events = [bindingValue];
                }

                if ((<any>binding).sharkJS.attachedEvents == null) {
                    (<any>binding).sharkJS.attachedEvents = new Map<string, Function>();
                }

                events.forEach(event => {
                    const evetnSplitValue = event.split(':');
                    const eventType = evetnSplitValue[0];
                    const eventSource = evetnSplitValue[1];
                    const sharkJS = this.getSharkJSContextFromParent(binding as HTMLElement);

                    // Check for current binding is in current component context
                    if (componentInstance[eventSource]) {
                        this.destroyEventsOnBindingRef(binding as HTMLElement);
                        function eventHandler(e: any) {
                            componentInstance[eventSource].apply(componentInstance, [{ event: e, sharkJS: sharkJS }]);
                        }
                        const eventExist = (<any>binding).sharkJS.attachedEvents.get(eventType) != null;
                        // console.log(eventExist);
                        // console.log((<any>binding).sharkJS.attachedEvents);
                        if (!eventExist) {
                            // console.log('event added');
                            binding.addEventListener(eventType, eventHandler);
                            (<any>binding).sharkJS.attachedEvents.set(eventType, eventHandler);
                        }
                    }
                });
                (<any>binding).sharkJS.destroyEvents = () => {
                    for(const [eventType, eventHandler] of (<any>binding).sharkJS.attachedEvents) {
                        binding.removeEventListener(eventType, eventHandler);
                    }
                    (<any>binding).sharkJS.attachedEvents.clear();
                }
                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }

    destroyEventsOnBindingRef(bindingRef: HTMLElement) {
        const bindings = bindingRef.querySelectorAll('[bind-event]');
        bindings.forEach(binding => {
            if ((<any>binding).sharkJS.attachedEvents.size > 0 && (<any>binding).sharkJS.destroyEvents != null) {
                (<any>binding).sharkJS.destroyEvents();
            }
        });
    }

    resolveRepeatableBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-for]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-for')?.value;
            if (bindingValue) {
                const exist = this.checkExistingSourceForBinding(componentInstance, bindingValue);
                if (!exist) {
                    return;
                }
                
                this.sharkJSConextFactory(binding, {...componentInstance});

                // bind-for="arrSource;item"
                // bind="item.key"
                const bindingValueSplit = bindingValue.split(";");
                const arrSrc = bindingValueSplit[0];
                const indexedItem = bindingValueSplit[1];
                const track = bindingValueSplit[2];
                const template = (<any>binding).htmlTemplate || binding.innerHTML;
                
                const arraySrc = componentInstance[arrSrc] as any[];

                this.sharkJSConextFactory(binding, arrSrc);
                (<any>binding).htmlTemplate = template;

                this.destroyEventsOnBindingRef(binding as HTMLElement);

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
            }
        });
    }

    resolveSimpleBind(componentRef: HTMLElement) {
        const bindings = componentRef.querySelectorAll('[bind]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind')?.value;
            if (bindingValue) {
                
                const bindingValueSplit = bindingValue.split(".");
                // item.key
                // const item = bindingValueSplit[0];
                const itemKey = bindingValueSplit[1];
                const dataContext = this.getDataContextFromParent(binding as HTMLElement);
                this.sharkJSConextFactory(binding, {...dataContext});
                if (dataContext != null && dataContext.hasOwnProperty(itemKey)) {
                    const value = dataContext[itemKey];
                    if (value != null) {
                        binding.innerHTML = value;
                    } else {
                        binding.innerHTML = '';
                    }
                }
                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }

    resolveCssClassBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-class]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-class')?.value;
            if (bindingValue) {
                const exist = this.checkExistingSourceForBinding(componentInstance, bindingValue);
                if (!exist) {
                    return;
                }
                this.sharkJSConextFactory(binding, {...componentInstance});

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
                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }

    sharkJSConextFactory(elementRef: any, dataContext: any) {
        if (elementRef.sharkJS == null)
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

    checkExistingSourceForBinding(componentInstance: any, bindingValue: string) {
        if (bindingValue.indexOf('.') !== -1) {
            // bind-text="source.sampleProperty"
            const source = bindingValue.split('.');
            if (componentInstance[source[0]] == null) {
                return false;
            }
        } else if (bindingValue.indexOf(":") !== -1) {
            // bind-event="click:sampleEvent,mouseover:sampleEvent1"
            if (bindingValue.indexOf(',')) {
                const sources = bindingValue.split(',');
                sources.forEach(source => {
                    const s = source.split(':');
                    if (componentInstance[s[1]] == null) {
                        return false;
                    }
                });
            } else {
                const source = bindingValue.split(':');
                if (componentInstance[source[1]] == null) {
                    return false;
                }
            }
        } else if (bindingValue.indexOf(';') !== -1) { 
            // bind-for="arrSrc;item;track"
            const source = bindingValue.split(';');
            if (componentInstance[source[0]] == null) {
                return false;
            }
        }
        else {
            if (componentInstance[bindingValue] == null) {
                return false;
            }
        }
        return true;
    }
}