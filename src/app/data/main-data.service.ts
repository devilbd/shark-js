import * as hljs from 'highlight.js';

export class MainDataService {
    private testProp = 5;
    setData() {
        this.testProp += 5;
    }

    async getData() {
        let promiseResult = new Promise((resolve, reject) => {
            resolve(this.testProp);
        });
        return promiseResult;
    }

    async getComponentsSampleValues() {
        const appIndexHtml = `
        <!DOCTYPE html>
        <html>
            <header>
                <meta charset="utf-8" />
                <title>Shark</title>
                <link rel="icon" type="image/x-icon" href="favicon.ico" alt="">
            </header>
            <body>
                <div bind-component="AppRootComponent">
                </div>
            </body>
            <script src="dist/shark.js"></script>
        </html>
        `;

        const appBootConfiguration = `
            // Core
            import { SharkCore } from "../framework/core/shark-core/shark-core";
            
            // Styles
            import './styles/main.scss';
            
            // Services
            import { DataService } from "service_path";
            
            // Components
            import { AppRootComponent } from "./views/app-root/app-root.component";
            
            // Parent component needs be imported before child's one
            import { DashboardComponent } from "./components/dashboard-component/dashboard.component";
            
            (() => {
                // core initialization
                const sharkCore = new SharkCore();
                
                // Register dependencies
                sharkCore.dependencyResolver.registerSingletonType<DataService>('DataService', DataService);
            
                sharkCore.dependencyResolver.declareComponent<AppRootComponent>('AppRootComponent', AppRootComponent, ['ChangeDetector', 'DataService']);
                
                sharkCore.runApp('AppRootComponent');
            })();
        `;

        const simpleBindExampleHtml = `
            <div class="simple-binding-root">
                <div class="section-content">
                    <label class="label medium">Simple binding example</label>
                    <div bind-text="testProperty"></div>
                    <div bind-text="complexObject.property1"></div>
                    <div bind-text="complexObject.deepProperty.test"></div>
                    <input type="text" 
                            bind-value="complexObject.deepProperty.test" 
                            bind-event="keydown:onDeepValueChanged" />
                    <input type="text" 
                            bind-value="testProperty" 
                            bind-event="keydown:onValueChanged" />

                    <div>
                        <label bind-if="isVisibleProperty" class="label small">
                            Component property bindings from outside
                        </label>
                        <div>
                            <span>isVisibleProperty value - </span>
                            <span bind-text="isVisibleProperty"></span>
                        </div>
                        <button bind-event="click:changeVisibleProperty">
                            Change isVisibleProperty
                        </button>
                    </div>
                </div>
            </div>
        `;

        const simpleBindExampleTS = `
            import { ChangeDetector } from "../../../framework/ui/change-detector";
            import { Component } from "../../../framework/ui/component";
            import html from './simple-binding-sample.component.html';
            import './simple-binding-sample.component.scss';

            @Component({
                name: 'SimpleBindingSampleComponent',
                html: html
            })
            export class SimpleBindingSampleComponent  {
                isVisibleProperty!: boolean;
                isVisiblePropertyChanged = () => {

                };

                testProperty;
                complexObject = {
                    property1: 'property 1 of complex object',
                    property2: 'Property 2 of complex object',
                    deepProperty: {
                        test: 'i am deep property'
                    }
                };

                constructor(private changeDetector: ChangeDetector) {
                    this.testProperty = 123;
                }

                onValueChangedTimeout: any;
                onValueChanged(e: any) {
                    clearTimeout(this.onValueChangedTimeout);
                    this.onValueChangedTimeout = setTimeout(() => {
                        this.changeDetector.updateView(this);
                    }, 250);
                }

                onDeepValueChangedTimeout: any;
                onDeepValueChanged(e: any) {
                    clearTimeout(this.onDeepValueChangedTimeout);
                    this.onDeepValueChangedTimeout = setTimeout(() => {
                        this.changeDetector.updateView(this);
                    }, 250);
                }

                changeVisibleProperty() {
                    this.isVisibleProperty = !this.isVisibleProperty;
                    this.isVisiblePropertyChanged();
                    this.changeDetector.updateView(this);
                }
            }
        `;

        const conditionsSampleHtml = `
            <div class="conditions-sample-root">
                <div class="section-content">
                    <label class="label medium">Conditions sample and nested components</label>
                    <div bind-if="visible">
                        Content for hide/show
                    </div>
                    <button bind-event="click:onShow">
                        Show
                    </button>
                    <button bind-event="click:onHide">
                        Hide
                    </button>
                
                    <div>
                        <label class="label small">
                            visible as property of this context is 
                            <span bind-text="visible"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;

        const conditionsSampleTS = `
            import { ChangeDetector } from '../../../framework/ui/change-detector';
            import { Component } from '../../../framework/ui/component';
            import html from './conditions-sample.component.html';
            import './conditions-sample.component.scss';

            @Component({
                name: 'ConditionsSampleComponent',
                html: html
            })
            export class ConditionsSampleComponent  {
                visible = true;

                constructor(private changeDetector: ChangeDetector) {

                }

                onShow(e: any) {
                    this.visible = true;
                    this.changeDetector.updateView(this);
                }

                onHide(e: any) {
                    this.visible = false;
                    this.changeDetector.updateView(this);
                }

                onVisiblePropertyChanged(newValue: any) {
                    this.visible = newValue;
                    this.changeDetector.updateView(this);
                }
            }
        `;

        const eventsSampleHtml = `
            <div class="events-sample-root">
                <div class="section-content">
                    <label class="label medium">Event bindings example</label>
                    <div bind-class="hover-class1:testHover,hover-class2:!testHover">
                        I am hovered
                    </div>
                    <button bind-event="mouseenter:onMouseOver,mouseleave:onMouseLeft">
                        Hover me
                    </button>
                </div>
            </div>
        `;

        const eventsSampleTS = `
            import { ChangeDetector } from "../../../framework/ui/change-detector";
            import { Component } from "../../../framework/ui/component";
            import { SharkJSContext } from "../../../framework/ui/component-resolver";
            import html from './events-sample.component.html';
            import './events-sample.component.scss';

            @Component({
                name: 'EventsSampleComponent',
                html: html
            })
            export class EventsSampleComponent  {
                testHover = false;

                constructor(private changeDetector: ChangeDetector) {
                }

                onMouseOver(e: any) {
                    this.testHover = true;
                    this.changeDetector.updateView(this);
                }

                onMouseLeft(e: any) {
                    this.testHover = false;
                    this.changeDetector.updateView(this);
                }
            }
        `;

        const repeatableSampleHtml = `
            <div class="repeatable-component-root">
                <div class="section-content">
                    <label class="label medium">Repeating values example</label>
                    <div>
                        <label class="label small">Simple repeater</label>
                        <div bind-for="itemsSource;item;track">
                            <div bind="item.value" bind-event="click:selectItem" bind-class="green-item:greenStyledItem"></div>
                            <div bind="item.testProp" bind-event="click:selectItem" bind-class="blue-item:blueStyledItem"></div>
                        </div>
                    </div>
                    <div>
                        <label class="label small">Complex template repeater</label>
                        <div bind-for="itemsSource;item;track">
                            <div>
                                <div>
                                    <div bind-class="green-item:greenStyledItem" bind="item.value" bind-event="click:selectItem"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const repeatableSampleTS = `
            import { ChangeDetector } from "../../../framework/ui/change-detector";
            import { Component } from "../../../framework/ui/component";
            import { SharkJSContext } from "../../../framework/ui/component-resolver";
            import html from './repeatable-sample.component.html';
            import './repeatable-sample.component.scss';

            @Component({
                name: 'RepeatableSampleComponent',
                html: html
            })
            export class RepeatableSampleComponent  {

                increment = 0;

                itemsSource = [
                    { key: 1, value: 'something' },
                    { key: 2, value: 'something 2' },
                    { key: 3, value: '', testProp: 5 },
                ];

                constructor(private changeDetector: ChangeDetector) {
                }

                selectItem(e: SharkJSContext) {
                    this.increment++;
                    console.log(e);
                    this.itemsSource[1].value = this.itemsSource[1].value + this.increment;
                    this.changeDetector.updateView(this);
                }

                greenStyledItem(e: SharkJSContext) {
                    if (e.dataContext.value == 'something') {
                        return true;
                    }
                    return false;
                }

                blueStyledItem(e: SharkJSContext) {
                    if (e.dataContext.testProp == 5) {
                        return true;
                    }
                    return false;
                }
            }
        `;

        const httpClientSampleHtml = `
            <div class="html-client-component-root">
                <div class="section-content">
                    <label class="label medium">HttpClient</label>
                    <button bind-event="click:getData">
                        Get data via HttpClient
                    </button>
                    <div bind-if="isLoading" class="ajax-loader"></div>
                    <div>
                        <label class="label small">Punchline:</label>
                        <div bind-text="viewModel.punchline"></div>
                        <label class="label small">Setup:</label>
                        <div bind-text="viewModel.setup"></div>
                        <label class="label small">Type:</label>
                        <div bind-text="viewModel.type"></div>
                    </div>
                </div>
            </div>
        `;

        const httpClientSampleTS = `
            import { HttpClient, HttpRequestType, Header } from "../../../framework/core/communication/http-client";
            import { ChangeDetector } from "../../../framework/ui/change-detector";
            import { Component } from "../../../framework/ui/component";
            import html from './http-client-sample.component.html';
            import './http-client-sample.component.scss';

            @Component({
                name: 'HttpClientSampleComponent',
                html: html
            })
            export class HttpClientSampleComponent {

                _isLoading!: boolean;

                get isLoading() { 
                    return this._isLoading;
                }

                set isLoading(value: boolean) { 
                    this._isLoading = value;
                    this.changeDetector.updateView(this);
                }

                viewModel = {
                    punchline: '',
                    setup: '',
                    type: '',
                };

                constructor(private changeDetector: ChangeDetector, private httpClient: HttpClient) {

                }

                async getData() {
                    this.isLoading = true;
                    this.httpClient.createAndSend({
                        type: HttpRequestType.GET,
                        url: 'https://official-joke-api.appspot.com/random_joke',
                    }).subscribe((result: any) => {
                        this.viewModel = result.data;
                        this.isLoading = false;
                    });
                }
            }
        `;

        const propertyBindingsSampleHtml = `
            <!-- Dashboard component HTML -->
            <div class="dashboard-component-root">
                <div class="section-content">
                    <label class="label medium">Dashboard component</label>
                    <div>
                        <label class="label small">Property of dashboard component</label>
                        <div bind-text="dropDownExpanded""></div>
                        <button bind-event="click:expandFromOutside">
                            Expand drop down from dashboard
                        </button>
                    </div>
                    <div bind-component="DropDownComponent"
                        bind-property="dropDownExpanded->expanded,itemsSource->itemsSource"
                        bind-property-changed="expandedChanged->dropDownExpandedChanged">
                    </div>
                </div>
            </div>

            <!-- Drop down component HTML --> 
            <div class="drop-down-component-root">
                <div bind-event="click:onBodyToggle" class="selected-item">
                    <div class="icon" bind-class="body-expanded:expanded"></div>
                    <div class="selected-item-text" bind-text="selectedItem"></div>
                </div>
                <div class="dropdown-body" bind-if="expanded" bind-for="itemsSource;item;idx">
                    <div class="body-item" bind="item" bind-event="click:onSelectItem:{item}"></div>
                </div>
            </div>
        `;

        const propertyBindingsSampleTS = `
            // Dashboard component TS
            import { ChangeDetector } from "../../../framework/ui/change-detector";
            import { Component } from "../../../framework/ui/component";
            import html from './dashboard.component.html';
            import './dashboard.component.scss';

            @Component({
                name: 'DashboardComponent',
                html: html
            })
            export class DashboardComponent {
                dropDownExpanded!: boolean;
                dropDownExpandedChanged = (newValue: boolean) => {
                    console.log('dropDownExpandedChanged', newValue);
                    console.log(this);
                };

                itemsSource = [
                    'item1',
                    'item2',
                    'item3',
                    'item4',
                    'item5'
                ];

                constructor(private changeDetector: ChangeDetector) {
                    
                }

                expandFromOutside() {
                    this.dropDownExpanded = !this.dropDownExpanded;
                    this.changeDetector.updateView(this);
                }
            }

            // Drop down component TS
            import { ChangeDetector } from "../../../framework/ui/change-detector";
            import { Component } from "../../../framework/ui/component";
            import html from './drop-down.component.html';
            import './drop-down.component.scss';

            @Component({
                name: 'DropDownComponent',
                html: html
            })
            export class DropDownComponent {
                expanded = false;
                itemsSource: any[] = [];
                selectedItem: any;

                constructor(private changeDetector: ChangeDetector) {
                    setTimeout(() => {
                        this.selectedItem = this.itemsSource[0];
                    });
                }

                onBodyToggle(e: any) {
                    this.expanded = !this.expanded;
                    this.changeDetector.updateView(this);
                }

                onSelectItem(e: any) {
                    console.log(e);
                    this.selectedItem = e.event.value;
                    this.onBodyToggle(e);
                }
            }
        `;

        let promiseResult = new Promise((resolve, reject) => {
            const result = {
                ApBootConfiguration: {
                    html: hljs.default.highlight(appIndexHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(appBootConfiguration, { language: 'typescript' }).value
                },
                SimpleBindingSampleComponent: {
                    html: hljs.default.highlight(simpleBindExampleHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(simpleBindExampleTS, { language: 'typescript' }).value
                },
                ConditionsSampleComponent: {
                    html: hljs.default.highlight(conditionsSampleHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(conditionsSampleTS, { language: 'typescript' }).value
                },
                EventsSampleComponent: {
                    html: hljs.default.highlight(eventsSampleHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(eventsSampleTS, { language: 'typescript' }).value
                },
                RepeatableSampleComponent: {
                    html: hljs.default.highlight(repeatableSampleHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(repeatableSampleTS, { language: 'typescript' }).value
                },
                HttpClientSampleComponent: {
                    html: hljs.default.highlight(httpClientSampleHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(httpClientSampleTS, { language: 'typescript' }).value
                },
                PropertyBindingsSampleComponent: {
                    html: hljs.default.highlight(propertyBindingsSampleHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(propertyBindingsSampleTS, { language: 'typescript' }).value
                }
            };
            resolve(result);
        });
        return promiseResult;
    }
}