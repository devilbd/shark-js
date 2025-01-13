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