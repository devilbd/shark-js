import { MainDataService } from "../data/main-data.service";
import html from './dashboard.component.html';
import './dashboard.component.scss';

export class DashboardComponent {
    myProperty1 = 5;

    constructor(private mainDataService: MainDataService) {
        console.log(html);
        console.log(this.mainDataService);
    }

    async getData() {
        // await MainDataService.getData();
        // console.log('test');
    }
}