import { MainDataService } from "../data/main-data.service";
import html from './dashboard.component.html';

export class DashboardComponent {
    myProperty1 = 5;
    
    constructor() {
        console.log(html);
    }

    async getData() {
        // await MainDataService.getData();
        // console.log('test');
    }
}