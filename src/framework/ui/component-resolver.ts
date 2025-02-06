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
                const componentInstance = this.dependencyResolver.getComponent(componentName) as any;
                component.innerHTML = (<any>componentInstance).componentHtml;
                this.sharkJSConextFactory(component, {...componentInstance});
                component.setAttribute('context-id', componentInstance.contextId);
                this.resolveBindings(componentInstance);
                (<any>component).sharkJS.state = 'resolved';
            }
        });
    }

    resolveBindings(component: any) {
        const componentsRefs = document.querySelectorAll(`[bind-component="${component.name}"]`);
        componentsRefs.forEach(componentRef => {
            if (componentRef != null) {
                const componentInstance = this.dependencyResolver.getComponent(component.name) as any;

                this.resolveComponentPropertyBindings(componentRef as HTMLElement, componentInstance);
                this.resolveComponentPropertyChangedBindings(componentRef as HTMLElement, componentInstance);

                this.resolveComponents(componentRef as HTMLElement);                
                this.resolveIfBindings(componentRef as HTMLElement, componentInstance);

                this.resolveInputBindings(componentRef as HTMLElement, componentInstance);
                this.resolveTextBindings(componentRef as HTMLElement, componentInstance);
                this.resolveTextContent(componentRef as HTMLElement, componentInstance);
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

    resolveTextContent(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-text-content]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-text-content')?.value;
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
                    binding.textContent = newValue;
                }
                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }

    resolveComponentPropertyBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-property]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-property')?.value;            
            // bind-property="dropDownExpanded->expanded"
            // dropDownExpanded - property of outside component
            // expanded - property of inside component
            let value;
            if (bindingValue) {
                this.sharkJSConextFactory(binding, {...componentInstance});

                if (bindingValue.indexOf(',') !== -1) {
                    const bindingValues = bindingValue.split(',');
                    bindingValues.forEach(bindingValue => {
                        const bindingValueSplit = bindingValue.split('->');
                        const componentOfProperty = binding.attributes.getNamedItem('bind-component')?.value;
                        if (componentOfProperty != null) {
                            const dataContextValue = componentInstance[bindingValueSplit[0]];
                            const sourceToBind = this.dependencyResolver.getComponent(componentOfProperty) as any;
                            if (sourceToBind[bindingValueSplit[1]] != dataContextValue) {
                                sourceToBind[bindingValueSplit[1]] = dataContextValue;
                            }
                        }
                    });
                } else {
                    // TODO - rework needs for duplicated code
                    const bindingValueSplit = bindingValue.split('->');
                    const componentOfProperty = binding.attributes.getNamedItem('bind-component')?.value;
                    if (componentOfProperty != null) {
                        const dataContextValue = componentInstance[bindingValueSplit[0]];
                        const sourceToBind = this.dependencyResolver.getComponent(componentOfProperty) as any;
                        if (sourceToBind[bindingValueSplit[1]] != dataContextValue) {
                            sourceToBind[bindingValueSplit[1]] = dataContextValue;
                        }
                    }
                }
                
                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }

    resolveComponentPropertyChangedBindings(componentRef: HTMLElement, componentInstance: any) {        
        const bindings = (componentRef.parentElement as HTMLElement).querySelectorAll('[bind-property-changed]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-property-changed')?.value;            
            // bind-property-changed="expandedChanged->dropDownExpandedChanged"
            // expandedChanged - property of inside component
            // dropDownExpandedChanged - property of outside component
            
            let value;
            if (bindingValue) {
                this.sharkJSConextFactory(binding, {...componentInstance});

                // TODO - rework needs to remove duplicated code for multiple bindings
                if (bindingValue.indexOf(',') !== -1) {
                    const bindingValues = bindingValue.split(',');
                    bindingValues.forEach(bindingValue => {
                        const bindingValueSplit = bindingValue.split('->');
                        const componentOfProperty = binding.attributes.getNamedItem('bind-component')?.value;      
                        if (componentOfProperty != null) {
                            const parentContext = this.getSharkJSContextFromParent(binding as HTMLElement);
                            const valueSource = bindingValueSplit[0].split('Changed')[0];
                            const targetSource = bindingValueSplit[1].split('Changed')[0];
                            const newValue = componentInstance[valueSource];
    
                            const parentContextDataContext = this.dependencyResolver.getComponent(parentContext.dataContext.name) as any;
    
                            if (parentContextDataContext != null && parentContextDataContext[targetSource] != newValue) {
                                parentContextDataContext[targetSource] = newValue;
                                parentContextDataContext[targetSource + 'Changed'].apply(parentContextDataContext, [newValue]);
                                const parentComponentRef = document.querySelector(`[bind-component="${parentContext.dataContext.name}"]`) as HTMLElement;
                                this.resolveTextBindings(parentComponentRef, parentContextDataContext);
                            }
                        }
                    });
                } else {
                    const bindingValueSplit = bindingValue.split('->');
                    const componentOfProperty = binding.attributes.getNamedItem('bind-component')?.value;      
                    if (componentOfProperty != null) {
                        const parentContext = this.getSharkJSContextFromParent(binding as HTMLElement);
                        const valueSource = bindingValueSplit[0].split('Changed')[0];
                        const targetSource = bindingValueSplit[1].split('Changed')[0];
                        const newValue = componentInstance[valueSource];

                        const parentContextDataContext = this.dependencyResolver.getComponent(parentContext.dataContext.name) as any;

                        if (parentContextDataContext != null && parentContextDataContext[targetSource] != newValue) {
                            parentContextDataContext[targetSource] = newValue;
                            parentContextDataContext[targetSource + 'Changed'].apply(parentContextDataContext, [newValue]);
                            const parentComponentRef = document.querySelector(`[bind-component="${parentContext.dataContext.name}"]`) as HTMLElement;
                            this.resolveTextBindings(parentComponentRef, parentContextDataContext);
                        }
                    }
                }
                
                (<any>binding).sharkJS.state = 'resolved';
            }
        });
    }
    
    resolveIfBindings(componentRef: HTMLElement, componentInstance: any) {
        const bindings = componentRef.querySelectorAll('[bind-if]');
        bindings.forEach(binding => {
            const bindingValue = binding.attributes.getNamedItem('bind-if')?.value;
            let newValue;
            if (bindingValue) {
                if (bindingValue.indexOf('.') !== -1) {
                    const v = getDeepValue(componentInstance, bindingValue);
                    newValue = v;
                } else if(componentInstance[bindingValue] != null) {
                    newValue = componentInstance[bindingValue];
                }

                const defaultDisplay = getComputedStyle(binding as HTMLElement).display;
                if ((<any>binding).oldDisplay == null) {
                    (<any>binding).oldDisplay = defaultDisplay;
                }

                newValue = Boolean(newValue);
                if (newValue) {
                    (binding as HTMLElement).style.display = (<any>binding).oldDisplay;
                } else {
                    (binding as HTMLElement).style.display = 'none';
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
                    let eventPassedArgument = evetnSplitValue[2];

                    if (eventPassedArgument && eventPassedArgument.indexOf("'") !== -1) {
                        eventPassedArgument = eventPassedArgument.replace(/'/g, '');
                    } 
                    else if (eventPassedArgument && eventPassedArgument.indexOf('{') !== -1) {
                        eventPassedArgument = eventPassedArgument.replace(/{/g, '');
                        eventPassedArgument = eventPassedArgument.replace(/}/g, '');
                        // TODO - rework needs
                        const sharkJS = (<any>binding).parentElement.sharkJS;
                        if (sharkJS != null) {
                            eventPassedArgument = sharkJS.dataContext;
                        }
                    }
                    else {
                        if (eventPassedArgument && eventPassedArgument.indexOf('.') !== -1) {
                            eventPassedArgument = getDeepValue(componentInstance, eventPassedArgument);
                        } else if (componentInstance[eventPassedArgument] != null) {
                            eventPassedArgument = componentInstance[eventPassedArgument];
                        }
                    }

                    const sharkJS = this.getSharkJSContextFromParent(binding as HTMLElement);

                    // Check for current binding is in current component context
                    if (componentInstance[eventSource]) {
                        this.destroyEventsOnBindingRef(binding as HTMLElement);

                        function eventHandler(e: any) {
                            const evetArgData = {
                                event: e,
                                value: eventPassedArgument
                            };
                            componentInstance[eventSource].apply(componentInstance, [{ event: evetArgData, sharkJS: sharkJS }]);
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
            if ((<any>binding).sharkJS != null 
                    && (<any>binding).sharkJS.attachedEvents != null 
                    && (<any>binding).sharkJS.attachedEvents.size > 0 
                    && (<any>binding).sharkJS.destroyEvents != null) {
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
                if ((<any>binding).htmlTemplate == null) {
                    (<any>binding).htmlTemplate = template;
                }

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
                } else if (dataContext != null) {
                    binding.innerHTML = dataContext;
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