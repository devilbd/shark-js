import { ChangeDetector } from './../../../framework/ui/change-detector';
import { Component } from "../../../framework/ui/component";
import html from './app-root.component.html';
import './app-root.component.scss';
import { MainDataService } from '../../data/main-data.service';

import 'highlight.js/styles/github-dark-dimmed.min.css';
import { environment } from '../../environment';

@Component({
    name: 'AppRootComponent',
    html: html
})
export class AppRootComponent {
    // TODO - needs to implement if condition during resolving of components into component resolver
    selectedPage: string = '';
    selectedComponent: string = '';

    get codingSectionVisible() {
        if (this.selectedComponentData != null) {
            return true;
        }
        return false;
    }

    get appVersion() {
        return environment.version;
    }

    componentSamples = [
        {
            title: 'App boot conf',
            visible: false,
            name: 'ApBootConfiguration',
        },
        {
            title: 'Simple bindings',
            visible: false,
            name: 'SimpleBindingSampleComponent',
        },
        {
            title: 'Repeatable bindings',
            visible: false,
            name: 'RepeatableSampleComponent',
        },
        {
            title: 'Event bindings',
            visible: false,
            name: 'EventsSampleComponent',
        },
        {
            title: 'Conditional bindings',
            visible: false,
            name: 'ConditionsSampleComponent',
        },
        {
            title: 'HTTP client',
            visible: false,
            name: 'HttpClientSampleComponent'
        },
        {
            title: 'Property bindings',
            visible: false,
            name: 'PropertyBindingsSampleComponent'
        }, 
        {
            title: 'Form bindings',
            visible: false,
            name: 'FormsBindingSampleComponent'
        },
        {
            title: 'Routing',
            visible: false,
            name: 'RouterSampleComponent'
        },
    ];

    components = [
        {
            title: 'Drop down',
            visible: false,
            name: 'DropDownComponent'
        },
        {
            title: 'Notifications',
            visible: false,
            name: 'NotificationsSampleComponent'
        }
    ];

    services = [
        {
            title: 'Notifications service',
            visible: false,
            name: 'NotificationsService'
        }
    ];

    componentsSamplesData: any;
    componentsData: any;
    servicesData: any;

    selectedComponentData: any;
    selectedService: any;

    constructor(private changeDetector: ChangeDetector, private mainDataService: MainDataService) {
        this.mainDataService.getComponentsSampleValues().then((data: any) => {
            this.componentsSamplesData = data;
        });
        this.mainDataService.getComponentsValues().then((data: any) => {
            this.componentsData = data;
        });
        this.mainDataService.getServicesData().then((data: any) => {
            this.servicesData = data;
        });
    }

    onSelectPage(eventArgs: any) {
        this.selectedPage = eventArgs.event.value;
        this.componentSamples.forEach((component: any) => {
            if (component.name === eventArgs.event.value.name) {
                this.selectedComponentData = this.componentsSamplesData[component.name];
            }
        });

        this.hideAll();
        eventArgs.event.value.visible = true;        
        this.changeDetector.updateView(this);
    }

    onSelectComponent(eventArgs: any) {
        this.selectedComponent = eventArgs.event.value;
        this.components.forEach((component: any) => {
            if (component.name === eventArgs.event.value.name) {
                this.selectedComponentData = this.componentsData[component.name];
            }
        });

        this.hideAll();
        eventArgs.event.value.visible = true;        
        this.changeDetector.updateView(this);
    }

    onSelectService(eventArgs: any) {
        this.selectedService = eventArgs.event.value;
        this.services.forEach((service: any) => {
            if (service.name === eventArgs.event.value.name) {
                this.selectedComponentData = this.servicesData[service.name];
            }
        });

        this.hideAll();
        eventArgs.event.value.visible = true;        
        this.changeDetector.updateView(this);
    }

    hideAll() {
        for (let idx in this.componentSamples) {
            this.componentSamples[idx].visible = false;
        }

        for (let idx in this.components) {
            this.components[idx].visible = false;
        }

        for (let idx in this.services) {
            this.services[idx].visible = false;
        }
    }
}