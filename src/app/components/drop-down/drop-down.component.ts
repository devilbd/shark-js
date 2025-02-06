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
    constructor(private changeDetector: ChangeDetector) {

    }

    onExpand(e: any) {
        this.expanded = true;
        this.changeDetector.updateView(this);
    }

    onCollapse(e: any) {
        this.expanded = false;
        this.changeDetector.updateView(this);
    }
}