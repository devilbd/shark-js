import { DependencyResolver } from "../core/dependency-resolver/dependency-resolver";
import { getDeepValue, setDeepValue } from "../core/helpers/deep-value.helper";

export class SharkJSContext {
    dataContext: any;
    state: string = '';

    constructor() {

    }
}

export interface IfBinding {
    bindingRef: HTMLElement;
    bindingHtml: string;
    state: boolean;
}

export class ComponentResolver {
    private dependencyResolver!: DependencyResolver;
    ifBindings: IfBinding[];

    constructor() {
        this.dependencyResolver = (<any>this).injectedData as DependencyResolver;
        this.ifBindings = [];
    }

    resolveComponents(componentRef?: HTMLElement) {
        let components;
        // app root
        if (componentRef == null) {
            components = document.querySelectorAll('[bind-component]');
        } else {
            components = componentRef.querySelectorAll('[bind-component]');
        }
        
        components.forEach(component => {            
            const componentName = component.attributes.getNamedItem('bind-component')?.value;
            if (componentName) {
                const componentInstance = this.dependencyResolver.getType(componentName) as any;
                component.innerHTML = (<any>componentInstance).componentHtml;
                this.sharkJSConextFactory(component, {...componentInstance});
                this.resolveBindings(componentInstance);
                (<any>component).sharkJS.state = 'resolved';
            }
        });
    }

    resolveBindings(component: any) {
        const componentsRefs = document.querySelectorAll(`[bind-component="${component.name}"]`);
        componentsRefs.forEach(componentRef => {
            if (componentRef != null) {
                const componentInstance = this.dependencyResolver.getType(component.name) as any;
                this.resolveComponentPropertyChangedBindings(componentRef as HTMLElement, componentInstance);
                this.resolveComponentPropertyBindings(componentRef as HTMLElement, componentInstance);

                this.resolveComponents(componentRef as HTMLElement);
                this.resolveIfBindings(componentRef as HTMLElement, componentInstance);
                this.resolveInputBindings(componentRef as HTMLElement, componentInstance);
                this.resolveTextBindings(componentRef as HTMLElement, componentInstance);            
                this.resolveRepeatableBindings(componentRef as HTMLElement, componentInstance);
                this.resolveCssClassBindings(componentRef as HTMLElement, componentInstance);
                this.resolveEventBindings(componentRef as HTMLElement, componentInstance);
            }
        });
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

    resolveComponentPropertyBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-property]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-property')?.value;            
            // bind-property="isVisibleProperty->visible"
            // isVisibleProperty - component bound property
            // visible - current context value of property in which isVisibleProperty owner is living
            let value;
            if (bindingValue) {
                const exist = this.checkExistingSourceForBinding(componentInstance, bindingValue);
                // console.log(`${exist} - component instance - ${componentInstance.name} - ${bindingValue}`)
                if (!exist) {
                    return;
                }
                this.sharkJSConextFactory(binding, {...componentInstance});
                // console.log(`component instance - ${componentInstance.name} - ${bindingValue}`);
                // console.log(componentInstance);

                const bindingValueSplit = bindingValue.split('->');
                const componentOfProperty = binding.attributes.getNamedItem('bind-component')?.value;      
                if (componentOfProperty != null) {
                    const dataContextValue = componentInstance[bindingValueSplit[1]];
                    const sourceToBind = this.dependencyResolver.getType(componentOfProperty) as any;

                    console.log(`dataContextValue before value change - ${sourceToBind[bindingValueSplit[0]]}`);

                    sourceToBind[bindingValueSplit[0]] = dataContextValue;

                    console.log(`dataContextValue after value change - ${sourceToBind[bindingValueSplit[0]]}`);
                }
                
                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }

    resolveComponentPropertyChangedBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-property-changed]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-property-changed')?.value;            
            // bind-property-changed="isVisiblePropertyChanged->onVisiblePropertyChanged"
            // isVisiblePropertyChanged - property changed from inside component handler
            // visible - onVisiblePropertyChanged handler which should be called after isVisiblePropertyChanged is called
            let value;
            if (bindingValue) {
                const exist = this.checkExistingSourceForBinding(componentInstance, bindingValue);
                // console.log(`${exist} - component instance - ${componentInstance.name} - ${bindingValue}`)
                if (!exist) {
                    return;
                }
                this.sharkJSConextFactory(binding, {...componentInstance});
                // console.log(`component instance - ${componentInstance.name} - ${bindingValue}`);
                // console.log(componentInstance);

                const bindingValueSplit = bindingValue.split('->');
                const componentOfProperty = binding.attributes.getNamedItem('bind-component')?.value;      
                if (componentOfProperty != null) {
                    const dataContextValue = componentInstance[bindingValueSplit[1]];
                    const sourceToBind = this.dependencyResolver.getType(componentOfProperty) as any;
                    const newValueSource = bindingValueSplit[0].split('Changed')[0];
                    const newValue = sourceToBind[newValueSource];

                    console.log(newValue);

                    function handler() {
                        dataContextValue.apply(componentInstance, [newValue]); 
                    }

                    sourceToBind[bindingValueSplit[0]] = handler;
                }
                
                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }
    
    resolveIfBindings(componentRef: HTMLElement, componentInstance: any) {
        // Resolve true state of bindings
        this.ifBindings.forEach(binding => {
            if (!binding.state) {
                binding.bindingRef.innerHTML = binding.bindingHtml;
                this.ifBindings.splice(this.ifBindings.indexOf(binding), 1);
            }
        });

        // Resolve bindings with false state
        const bindings = componentRef.querySelectorAll('[bind-if]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-if')?.value;
            let newValue;
            if (bindingValue) {
                const exist = this.checkExistingSourceForBinding(componentInstance, bindingValue);
                // console.log(`${exist} - component instance - ${componentInstance.name} - ${bindingValue}`)
                if (!exist) {
                    return;
                }
                this.sharkJSConextFactory(binding, {...componentInstance});
                if (bindingValue && bindingValue.indexOf('.') !== -1) {
                    const v = getDeepValue(componentInstance, bindingValue);
                    newValue = v;
                } else if(componentInstance[bindingValue] != null) {
                    newValue = componentInstance[bindingValue];
                }

                newValue = Boolean(newValue);
                if (!newValue) {
                    this.ifBindings.push({
                        bindingRef: binding as HTMLElement,
                        bindingHtml: binding.innerHTML,
                        state: newValue
                    });
                    this.destroyEventsOnBindingRef(binding as HTMLElement);
                    binding.innerHTML = '';
                }
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
            if ((<any>binding).sharkJS != null && (<any>binding).sharkJS.attachedEvents.size > 0 && (<any>binding).sharkJS.destroyEvents != null) {
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
                
                // this.sharkJSConextFactory(binding, {...componentInstance});

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
        if (elementRef.sharkJS == null) {
            elementRef.sharkJS = {
                state: 'creating',
                dataContext: dataContext
            } as SharkJSContext;
        }
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
            if (bindingValue.indexOf(',') !== -1) {
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
        else if (bindingValue.indexOf('->') !== -1) {
            const source = bindingValue.split('->');
            if (componentInstance[source[1]] == null) {
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