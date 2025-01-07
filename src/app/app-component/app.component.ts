import { ChangeDetector } from "../../framework/ui/change-detector";
import { Component } from "../../framework/ui/component";
import { SharkJSContext } from "../../framework/ui/component-resolver";
import html from './app.component.html';
import './app.component.scss';

@Component({
    name: 'AppComponent',
    html: html
})
export class AppComponent {
    testProperty;
    testArray = [
        { key: 1, value: 'something' },
        { key: 2, value: 'something 2' },
        { key: 3, value: '', testProp: 5 },
    ];

    _iterator = 0;
    get iterator() {
        return this._iterator;
    }

    set iterator(v) {
        this._iterator = v;
        if (v % 2 === 0) {
            this.testHover = !this.testHover;
            this.changeDetector.updateCss();
        }
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

    testHover = false;

    constructor(private changeDetector: ChangeDetector) {
        this.testProperty = 123;
    }

    onValueChangedTimeout = 0;
    onValueChanged(e: any) {
        if (e.sharkJS) {
            let newValue = e.sharkJS.dataContext.value;
            this.testProperty = newValue;
        }
        this.changeDetector.updateView();
    }

    testClick(e: any) {
        if (e.sharkJS) {
            let newValue = e.sharkJS.dataContext.value;
            this.testProperty = newValue;
        }
        this.testArray[2].value = 'updated mannyally' + this.iterator;
        this.iterator++;
        this.changeDetector.updateView();
    }

    onMouseOver(e: any) {
        this.testHover = true;
        this.changeDetector.updateCss();
    }

    onMouseLeft(e: any) {
        this.testHover = false;
        this.changeDetector.updateCss();
    }
}