import { ChangeDetector } from './../../../framework/ui/change-detector';
import { Component } from "../../../framework/ui/component";
import html from './clock.component.html';
import './clock.component.scss';
import { draggable } from '../../../framework/core/helpers/drag.behavior';

@Component({
    name: 'ClockComponent',
    html: html
})
export class ClockComponent {
    time!: string;

    _isMouseIn = false;
    get isMouseIn() {
        return this._isMouseIn;
    }

    set isMouseIn(v: boolean) {
        this._isMouseIn = v;
    }

    constructor(private changeDetector: ChangeDetector) {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        setTimeout(() => {
            const componentRef = document.querySelector(`[bind-component="ClockComponent"]`) as HTMLElement;
            draggable(componentRef);
        });
    }

    updateTime() {
        const now = new Date();
        this.time = now.toLocaleTimeString();
        this.changeDetector.updateView(this);
    }

    onMouseEnter(e: any) {
        this.isMouseIn = true;
        setTimeout(() => {
            this.changeDetector.updateView(this);
        });
    }

    onMouseLeave(e: any) {
        this.isMouseIn = false;
        setTimeout(() => {
            this.changeDetector.updateView(this);
        });
    }
}
