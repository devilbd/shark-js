// https://api.coindesk.com/v1/bpi/currentprice.json

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
    constructor(private changeDetector: ChangeDetector, private httpClient: HttpClient) {

    }

    async getData() {
        const headers = [
            { name: 'Accept', value: 'application/json' }
        ];

        this.httpClient.createAndSend({
            type: HttpRequestType.GET,
            url: 'http://localhost:5186/weatherforecast/',
            headers: headers
        }).subscribe((data: any) => {
            console.log(data);
        });

        // const result = await fetch('https://official-joke-api.appspot.com/random_joke').then(response => {
        //     console.log((<any>response).data);
        // }).then(data => {
        //     console.log(data);
        // }).catch(error => {
        //     console.log(error);
        // }).finally(() => {});
        // console.log(result);
    }
}