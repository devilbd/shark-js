import { Component } from "../../../framework/ui/component";
import { ChangeDetector } from "../../../framework/ui/change-detector";
import html from './forms-binding-sample.component.html';
import './forms-binding-sample.component.scss';
import { FormDataValidator } from "./validators/form-data.validator";

@Component({
    name: 'FormsBindingSampleComponent',
    html: html
})
export class FormsBindingSampleComponent {
    formData = {
        name: '',
        email: '',
        message: '',
    };

    _customNumberValue: any = 0;
    get customNumberValue() {
        return this._customNumberValue;
    }

    set customNumberValue(v) {
        this._customNumberValue = v;
        this.customNumberValidation = this.formDataValidator.isValidNumber(parseFloat(this.customNumberValue));
    }

    private formDataValidator: FormDataValidator;
    private inputChangeTimeout: any;

    get isFormInvalid() {
        const isFormValid = document.querySelector('form')?.checkValidity();
        return !isFormValid;
    }

    get invalidStyleValue() {
        return this.isFormInvalid ? '1px solid crimson' : '';
    }

    customNumberValidation: any;

    constructor(private changeDetector: ChangeDetector) {
        this.formDataValidator = new FormDataValidator();
    }

    onInputChange(event: any) {
        clearTimeout(this.inputChangeTimeout);
        this.inputChangeTimeout = setTimeout(() => {
            this.changeDetector.updateView(this);
        }, 250);
    }

    onSubmit() {
        console.log('Form submitted:', this.formData);
    }
}
