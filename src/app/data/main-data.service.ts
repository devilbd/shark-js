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
        const simpleBindExampleHtml = `
            <div bind-text="testProperty"></div>
            <div bind-text="complexObject.property1"></div>
            <div bind-text="complexObject.deepProperty.test"></div>
            <input type="text" bind-value="complexObject.deepProperty.test" bind-event="keydown:onDeepValueChanged" />
            <input type="text" bind-value="testProperty" bind-event="keydown:onValueChanged" />
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
                        <label class="label small">visible as property of this context is <span bind-text="visible"></span></label>
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

        let promiseResult = new Promise((resolve, reject) => {
            const result = {
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
                }
            };
            resolve(result);
        });
        return promiseResult;
    }
}