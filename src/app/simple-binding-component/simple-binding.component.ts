import { ChangeDetector } from "../../framework/ui/change-detector";
import { Component } from "../../framework/ui/component";
import html from './simple-binding.component.html';
import './simple-binding.component.scss';

@Component({
    name: 'SimpleBindingComponent',
    html: html
})
export class SimpleBindingComponent  {
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