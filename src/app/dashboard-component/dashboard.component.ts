import { ChangeDetector } from "../../framework/ui/change-detector";
import { Component } from "../../framework/ui/component";
import { MainDataService } from "../data/main-data.service";
import html from './dashboard.component.html';
import './dashboard.component.scss';

@Component({
    name: 'DashboardComponent',
    html: html
})
export class DashboardComponent {
    myProperty1: any = 5;

    constructor(private mainDataService: MainDataService, private changeDetector: ChangeDetector) {
        console.log(html);
        console.log(this.mainDataService);
    }

    async getData() {
        const result = await this.mainDataService.getData();
        this.myProperty1 = result;
        this.mainDataService.setData();
        console.log(this.myProperty1);
        this.changeDetector.updateView();
    }
}