import { ChangeDetector } from "../../../framework/ui/change-detector";
import { Component } from "../../../framework/ui/component";
import html from './app-root.component.html';
import './app-root.component.scss';

@Component({
    name: 'AppRootComponent',
    html: html
})
export class AppRootComponent {
    constructor(private changeDetector: ChangeDetector) {
        
    }
}