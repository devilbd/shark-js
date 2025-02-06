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
    itemsSource: any[] = [];
    selectedItem: any;

    constructor(private changeDetector: ChangeDetector) {
        setTimeout(() => {
            this.selectedItem = this.itemsSource[0];
        });
    }

    onBodyToggle(e: any) {
        this.expanded = !this.expanded;
        this.changeDetector.updateView(this);
    }

    onSelectItem(e: any) {
        console.log(e);
        this.selectedItem = e.event.value;
        this.onBodyToggle(e);
    }
}