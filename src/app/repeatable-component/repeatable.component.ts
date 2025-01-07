import { ChangeDetector } from "../../framework/ui/change-detector";
import { Component } from "../../framework/ui/component";
import { SharkJSContext } from "../../framework/ui/component-resolver";
import html from './repeatable.component.html';
import './repeatable.component.scss';

@Component({
    name: 'RepeatableComponent',
    html: html
})
export class RepeatableComponent  {

    testArray = [
        { key: 1, value: 'something' },
        { key: 2, value: 'something 2' },
        { key: 3, value: '', testProp: 5 },
    ];

    constructor(private changeDetector: ChangeDetector) {
    }

    testClick(e: SharkJSContext) {
        console.log(e);
    }
}