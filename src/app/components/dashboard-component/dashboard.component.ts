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

    constructor(private changeDetector: ChangeDetector) {
        
    }

    expandFromOutside() {
        this.dropDownExpanded = !this.dropDownExpanded;
        this.changeDetector.updateView(this);
    }
}