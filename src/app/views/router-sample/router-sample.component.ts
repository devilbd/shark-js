import { Router } from "../../../framework/core/router/router.service";
import { ChangeDetector } from "../../../framework/ui/change-detector";
import { Component } from "../../../framework/ui/component";
import html from './router-sample.component.html';
import './router-sample.component.scss';

@Component({
    name: 'RouterSampleComponent',
    html: html
})
export class RouterSampleComponent  {
    constructor(private changeDetector: ChangeDetector, private router: Router) {

    }

    onNavigate() {
        this.router.navigateToRoute('/http-client-sample');
    }
}