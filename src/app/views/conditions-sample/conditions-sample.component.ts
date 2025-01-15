import { ChangeDetector } from '../../../framework/ui/change-detector';
import { Component } from '../../../framework/ui/component';
import html from './conditions-sample.component.html';
import './conditions-sample.component.scss';

@Component({
    name: 'ConditionsSampleComponent',
    html: html
})
export class ConditionsSampleComponent  {
    visible = true;

    constructor(private changeDetector: ChangeDetector) {

    }

    onShow(e: any) {
        this.visible = true;
        this.changeDetector.updateView(this);
    }

    onHide(e: any) {
        this.visible = false;
        this.changeDetector.updateView(this);
    }

    onVisiblePropertyChanged(newValue: any) {
        this.visible = newValue;
        this.changeDetector.updateView(this);
    }
}