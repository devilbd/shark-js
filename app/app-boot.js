(() => { 
    const components = [
        {
            name: 'DashboardComponent',
            type: DashboardComponent
        }
    ];
    const services = [
        {
            name: 'MainDataService',
            type: MainDataService
        }
    ];
    sharkJS.run('App', App, components, services);
})();