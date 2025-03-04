import * as hljs from 'highlight.js';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { FirebaseProvider } from './firebase.provider';

export class MainDataService {
    private testProp = 5;

    constructor (private firebaseProvider: FirebaseProvider) {
        const j = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiJBSXphU3lDOWNVS1c1R3lhNzN4b1I2UnE4QVZTb0N3aFBZWjhiOEkiLCJhdXRoRG9tYWluIjoic2hhcmstanMuZmlyZWJhc2VhcHAuY29tIiwiZGF0YWJhc2VVUkwiOiJodHRwczovL3NoYXJrLWpzLWRlZmF1bHQtcnRkYi5ldXJvcGUtd2VzdDEuZmlyZWJhc2VkYXRhYmFzZS5hcHAiLCJwcm9qZWN0SWQiOiJzaGFyay1qcyIsInN0b3JhZ2VCdWNrZXQiOiJzaGFyay1qcy5maXJlYmFzZXN0b3JhZ2UuYXBwIiwibWVzc2FnaW5nU2VuZGVySWQiOiIxMDQ0ODE1NTU3MTgxIiwiYXBwSWQiOiIxOjEwNDQ4MTU1NTcxODE6d2ViOjhmNDNlYzBiMjIzZWRkNjgwZTcwNTQiLCJtZWFzdXJlbWVudElkIjoiRy04UUpXWkJRR0hKIn0.g1iiLTzYtRqWQl58yuy5vWjKUuc1TL0IOHP-jyM7Rcg";
        const config = JSON.parse(atob(j.split('.')[1]));
        // Initialize Firebase
        const app = initializeApp(config);
        const analytics = getAnalytics(app);
    }

    setData() {
        this.testProp += 5;
    }

    async getData() {
        let promiseResult = new Promise((resolve, reject) => {
            resolve(this.testProp);
        });
        return promiseResult;
    }

    // Added to firebase
    // dropDownComponentHtml
    async getComponentsValues() {
        // const dropDownComponentSample = await this.firebaseProvider.getSampleComponent('DropDownComponent');

        const dropDownComponentHtml = `
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

        const dropDownComponentTS = `
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
        const dropDownComponentSASS = `
            .drop-down-component-root {
                border: 2px dashed rgb(0, 0, 0);
                padding: 10px;
                margin: 5px;
                border-radius: 5px;
                box-shadow: 0 0 12px #000;
                position: relative;
                opacity: 0.7;

                &:hover {
                    cursor: pointer;
                    opacity: 1;
                    color: rgb(179, 179, 179);
                }

                .dropdown-body {
                    border: 2px dashed rgb(0, 0, 0);
                    padding: 10px;
                    margin: 75px 0px;
                    border-radius: 5px;
                    box-shadow: 0 0 12px #000;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 95%;
                    z-index: 999;
                    background-color: #384452;
                }

                .body-item {
                    padding: 10px;
                    opacity: 0.7;
                    border-radius: 5px;
                }

                .body-item:hover {
                    cursor: pointer;
                    opacity: 1;
                    background-color: #252d36;
                }

                .icon {
                    background-image: url('../../assets/arrow.png');
                    background-color: #d3d3d3;
                    background-position: center center;
                    background-size: 38px 38px;
                    height: 38px;
                    width: 38px;
                    display: inline-block;
                    transform: rotate(0deg);
                    transition: rotate 1s;
                    border-radius: 100%;
                    margin: 5px;
                }

                .selected-item {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }

                .selected-item-text {
                    display: inline-block;
                }

                .body-expanded {
                    rotate: 90deg !important;
                }
            }
        `;
        
        const notificationsSampleHtml = `
            <div class="notifications-sample">
                <div class="section-content">
                    <label class="label medium">Notifications sample</label>
                    <button bind-event="click:onCreateInfoMessage">
                        Create info message
                    </button>
                    <button bind-event="click:onCreateSuccessMessage">
                        Create success message
                    </button>
                    <button bind-event="click:onCreateErrorMessage">
                        Create error message
                    </button>
                </div>
            </div>
        `;
        const notificationsSampleTS = `
            import { ChangeDetector } from "../../../framework/ui/change-detector";
            import { Component } from "../../../framework/ui/component";
            import { Notification, NotificationsService, NotificationType } from "../../services/notifications/notifications.service";
            import html from './notifications-sample.component.html';
            import './notifications-sample.component.scss';

            @Component({
                name: 'NotificationsSampleComponent',
                html: html
            })
            export class NotificationsSampleComponent  {
                constructor(private changeDetector: ChangeDetector, private notifications: NotificationsService) {
                }
                
                onCreateInfoMessage() {
                    const notification = {
                        title: 'Info',
                        body: 'I am info notification message!',
                        type: NotificationType.Info,
                        onClose: () => {
                            console.log('Notification closed.');
                        }
                    } as Notification;
                    this.notifications.notify(notification);
                }

                onCreateSuccessMessage() {
                    const notification = {
                        title: 'Success',
                        body: 'I am success notification message!',
                        type: NotificationType.Success
                    } as Notification;
                    this.notifications.notify(notification);
                }

                onCreateErrorMessage() {
                    const notification = {
                        title: 'Error',
                        body: 'I am error notification message! Delay is 3 seconds...',
                        type: NotificationType.Error,
                        autoCloseOn: 3000
                    } as Notification;
                    this.notifications.notify(notification);
                }
            }
        `;

        let promiseResult = new Promise((resolve, reject) => {
            const result = {
                DropDownComponent: {
                    // html: hljs.default.highlight((<any>dropDownComponentSample).html, { language: 'html' }).value,
                    // ts: hljs.default.highlight((<any>dropDownComponentSample).ts, { language: 'typescript' }).value,
                    // sass: hljs.default.highlight((<any>dropDownComponentSample).sass, { language: 'css' }).value,
                    html: hljs.default.highlight(dropDownComponentHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(dropDownComponentTS, { language: 'typescript' }).value,
                    sass: hljs.default.highlight(dropDownComponentSASS, { language: 'css' }).value,
                },
                NotificationsSampleComponent: {
                    html: hljs.default.highlight(notificationsSampleHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(notificationsSampleTS, { language: 'typescript' }).value,
                }
            }
            resolve(result);
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

        const formsBindingSampleSASS = `
            .forms-binding-sample-root {
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    label {
                        font-weight: bold;
                    }

                    input, textarea {
                        padding: 8px;
                        font-size: 14px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }

                    input:invalid, textarea:invalid {
                        border: 2px dashed crimson;
                    }

                    .invalid {
                        border: 2px dashed crimson;
                    }

                    button {
                        padding: 10px;
                        font-size: 16px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;

                        &:hover {
                            background-color: #0056b3;
                        }

                        &:disabled {
                            opacity: 0.7;
                            cursor: no-drop;
                        }
                    }
                }
            }
        `;

        const formsBindingSampleHtml = `
            <div class="forms-binding-sample-root">
                <div class="section-content">
                    <label class="label medium">Form bindings</label>
                    <form>
                        <div>
                            <label>Name:</label>                
                            <input type="text" 
                                bind-value="formData.name" 
                                bind-event="input:onInputChange"
                                required
                                pattern="[a-zA-Z0-9]+" />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" 
                                bind-value="formData.email" 
                                bind-event="input:onInputChange"
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+"
                                required />
                        </div>
                        <div>
                            <label>Message:</label>
                            <textarea bind-value="formData.message" 
                                bind-event="input:onInputChange"
                                required
                                maxlength="20">
                            </textarea>
                        </div>
                        <div>
                            <label>Field with custom validator:</label>
                            <input type="number" 
                                bind-value="customNumberValue" 
                                bind-event="input:onInputChange"
                                bind-class="invalid:customNumberValidation.invalid"
                                required />
                        </div>
                        <div bind-if="customNumberValidation.invalid" bind-dom-property="style.border:customNumberValidation.invalid">
                            <div bind-text="customNumberValidation.error"></div>
                        </div>
                        <div bind-if="isFormInvalid" bind-dom-property="style.border:invalidStyleValue">
                            Invalid data!
                        </div>
                        <input type="button" bind-event="click:onSubmit" bind-dom-property="disabled:isFormInvalid" value="Submit" />
                    </form>
                </div>
            </div>


        `;
        const formsBindingSampleTS = `
            import { Component } from "../../../framework/ui/component";
            import { ChangeDetector } from "../../../framework/ui/change-detector";
            import html from './forms-binding-sample.component.html';
            import './forms-binding-sample.component.scss';
            import { FormDataValidator } from "./validators/form-data.validator";

            @Component({
                name: 'FormsBindingSampleComponent',
                html: html
            })
            export class FormsBindingSampleComponent {
                formData = {
                    name: '',
                    email: '',
                    message: '',
                };

                _customNumberValue: any = 0;
                get customNumberValue() {
                    return this._customNumberValue;
                }

                set customNumberValue(v) {
                    this._customNumberValue = v;
                    this.customNumberValidation = this.formDataValidator.isValidNumber(parseFloat(this.customNumberValue));
                }

                private formDataValidator: FormDataValidator;
                private inputChangeTimeout: any;

                get isFormInvalid() {
                    const isFormValid = document.querySelector('form')?.checkValidity();
                    return !isFormValid;
                }

                get invalidStyleValue() {
                    return this.isFormInvalid ? '1px solid crimson' : '';
                }

                customNumberValidation: any;

                constructor(private changeDetector: ChangeDetector) {
                    this.formDataValidator = new FormDataValidator();
                }

                onInputChange(event: any) {
                    clearTimeout(this.inputChangeTimeout);
                    this.inputChangeTimeout = setTimeout(() => {
                        this.changeDetector.updateView(this);
                    }, 250);
                }

                onSubmit() {
                    console.log('Form submitted:', this.formData);
                }
            }

            // Custom validator TypeScript
            export class FormDataValidator {
                isValidNumber(customNumberValue: number) {
                    const result = { 
                        invalid: true,
                        error: 'Number should be bigger than 5!'
                    };

                    if (customNumberValue < 5) {
                        return result;
                    }

                    return null;
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
                }, 
                FormsBindingSampleComponent: {
                    html: hljs.default.highlight(formsBindingSampleHtml, { language: 'html' }).value,
                    ts: hljs.default.highlight(formsBindingSampleTS, { language: 'typescript' }).value,
                    sass: hljs.default.highlight(formsBindingSampleSASS, { language: 'css' }).value
                },
                
            };
            resolve(result);
        });
        return promiseResult;
    }

    async getServicesData() {
        const notificationsServiceTS = `
           import './notifications.scss';

            export class NotificationsService {
                private notifications: HTMLElement[] = [];

                notify(notification: Notification): void {
                    if (this.notifications.length >= 3) {
                        const oldestNotification = this.notifications.shift();
                        if (oldestNotification) {
                            document.body.removeChild(oldestNotification);
                        }
                    }

                    const notificationEl = this.createNotificationDom(notification);
                    const rootToAppend = notificationEl.querySelector('.title') as HTMLElement;
                    const closeBtnEl = this.createNotificationCloseButton(rootToAppend, notification.onClose);

                    document.body.appendChild(notificationEl);
                    rootToAppend.appendChild(closeBtnEl);

                    setTimeout(() => {
                        notificationEl.style.opacity = '1';
                    }, 0);

                    this.notifications.push(notificationEl);

                    if (notification.autoCloseOn) {
                        setTimeout(() => {
                            notificationEl.style.opacity = '0';
                            document.body.removeChild(notificationEl);
                            this.notifications = this.notifications.filter(t => t !== notificationEl);
                        }, notification.autoCloseOn);
                    }
                }

                createNotificationDom(notification: Notification) {
                    const notificationEl = document.createElement('div');
                    notificationEl.innerHTML = \`
                        <div class="title">
                            <div>\${notification.title}</div>
                        </div>
                        <div class="body">\${notification.body}</div>\`;

                    notificationEl.classList.add('notification');
                    notificationEl.style.top = \`\${10 + this.notifications.length * 100}px\`; // Changed from bottom to top
                    
                    const notificationClass = NotificationType[notification.type].toLowerCase().toString();
                    notificationEl.classList.add(notificationClass);
                    return notificationEl;
                }

                createNotificationCloseButton(notificationEl: HTMLElement, eventCallBack: Function) {
                    const closeButtonEl = document.createElement('button');
                    closeButtonEl.innerText = 'x';
                    closeButtonEl.classList.add('close-button');

                    closeButtonEl.onclick = () => {
                        notificationEl.style.opacity = '0';
                        this.notifications = this.notifications.filter(t => t !== notificationEl.parentElement as HTMLElement);
                        document.body.removeChild(notificationEl.parentElement as HTMLElement);
                        if (eventCallBack != null) {
                            eventCallBack();
                        }
                    };

                    return closeButtonEl;
                }
            }

            export enum NotificationType {
                Info,
                Success,
                Error,
            }

            export interface Notification {
                title: string;
                body: string;
                type: NotificationType;
                onClose: Function;
                autoCloseOn?: number;
            }
        `;

        const result = {
            NotificationsService: {
                ts: hljs.default.highlight(notificationsServiceTS, { language: 'typescript' }).value,
            }
        }
        
        return new Promise((resolve, reject) => { 
            resolve(result);
        });
    }
}