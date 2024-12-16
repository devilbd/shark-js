class DashboardComponent {
    myProperty1 = 5;
    
    constructor() {

    }

    async getData() {
        await MainDataService.getData();
        console.log('test');
    }
}