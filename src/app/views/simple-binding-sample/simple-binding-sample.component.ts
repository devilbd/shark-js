import { ChangeDetector } from "../../../framework/ui/change-detector";
import { Component } from "../../../framework/ui/component";
import html from './simple-binding-sample.component.html';
import './simple-binding-sample.component.scss';

@Component({
    name: 'SimpleBindingSampleComponent',
    html: html
})
export class SimpleBindingSampleComponent  {
    testProperty;

    constructor(private changeDetector: ChangeDetector) {
        this.testProperty = 123;
    }

    onValueChangedTimeout: any;
    onValueChanged(e: any) {
        clearTimeout(this.onValueChangedTimeout);
        this.onValueChangedTimeout = setTimeout(() => {
            this.changeDetector.updateView();
        }, 250);
    }
}