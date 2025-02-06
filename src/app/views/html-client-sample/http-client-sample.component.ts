import { HttpClient, HttpRequestType, Header } from "../../../framework/core/communication/http-client";
import { ChangeDetector } from "../../../framework/ui/change-detector";
import { Component } from "../../../framework/ui/component";
import html from './http-client-sample.component.html';
import './http-client-sample.component.scss';

@Component({
    name: 'HttpClientSampleComponent',
    html: html
})
export class HttpClientSampleComponent {

    _isLoading!: boolean;

    get isLoading() { 
        return this._isLoading;
    }

    set isLoading(value: boolean) { 
        this._isLoading = value;
        this.changeDetector.updateView(this);
    }

    get showData() {
        return this.viewModel.setup !== '';
    }

    viewModel = {
        punchline: '',
        setup: '',
        type: '',
    };

    constructor(private changeDetector: ChangeDetector, private httpClient: HttpClient) {

    }

    async getData() {
        this.isLoading = true;
        this.httpClient.createAndSend({
            type: HttpRequestType.GET,
            url: 'https://official-joke-api.appspot.com/random_joke',
        }).subscribe((result: any) => {
            this.viewModel = result.data;
            this.isLoading = false;
        });
    }
}