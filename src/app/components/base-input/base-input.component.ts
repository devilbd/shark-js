import { Component } from "../../../framework/ui/component";
import html from './base-input.component.html';
import './base-input.component.scss';

@Component({
    name: 'BaseInputComponent',
    html: html
})
export class BaseInputComponent {
    inputValue: string = '';

    onInputChange(event: any) {
        this.inputValue = event.target.value;
    }
}
