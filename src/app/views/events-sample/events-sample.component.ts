import { ChangeDetector } from "../../../framework/ui/change-detector";
import { Component } from "../../../framework/ui/component";
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