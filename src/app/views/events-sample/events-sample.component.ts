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
    _iterator = 0;

    get iterator() {
        return this._iterator;
    }

    set iterator(v) {
        this._iterator = v;
        if (v % 2 === 0) {
            this.testHover = !this.testHover;
        }
    }

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