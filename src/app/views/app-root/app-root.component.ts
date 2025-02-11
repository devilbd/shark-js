import { ChangeDetector } from './../../../framework/ui/change-detector';
import { Component } from "../../../framework/ui/component";
import html from './app-root.component.html';
import './app-root.component.scss';
import { MainDataService } from '../../data/main-data.service';

import 'highlight.js/styles/monokai.min.css';
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
    ];

    components = [
        {
            title: 'Drop down component',
            visible: false,
            name: 'DropDownComponent'
        }
    ];

    componentsSamplesData: any;
    componentsData: any;
    selectedComponentData: any;

    constructor(private changeDetector: ChangeDetector, private mainDataService: MainDataService) {
        this.mainDataService.getComponentsSampleValues().then((data: any) => {
            this.componentsSamplesData = data;
        });
        this.mainDataService.getComponentsValues().then((data: any) => {
            this.componentsData = data;
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

    hideAll() {
        for (let idx in this.componentSamples) {
            this.componentSamples[idx].visible = false;
        }

        for (let idx in this.components) {
            this.components[idx].visible = false;
        }
    }
}