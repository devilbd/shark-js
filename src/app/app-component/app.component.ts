import { ChangeDetector } from "../../framework/ui/change-detector";
import { Component } from "../../framework/ui/component";
import html from './app.component.html';
import './app.component.scss';

@Component({
    name: 'AppComponent',
    html: html
})
export class AppComponent {
    constructor(private changeDetector: ChangeDetector) {
        
    }
}