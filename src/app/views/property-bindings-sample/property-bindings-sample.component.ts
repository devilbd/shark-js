import { ChangeDetector } from "../../../framework/ui/change-detector";
import { Component } from "../../../framework/ui/component";
import html from './property-bindings-sample.component.html';
import './property-bindings-sample.component.scss';

@Component({
    name: 'PropertyBindingsSampleComponent',
    html: html
})
export class PropertyBindingsSampleComponent {
    constructor(private changeDetector: ChangeDetector) {

    }
}