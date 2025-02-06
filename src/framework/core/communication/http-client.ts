import { Subject } from "rxjs";

export enum HttpRequestType {
    GET = 1,
    POST = 2,
    PUT = 3,
    PATCH = 4,
    DELETE = 5,
}

export interface Header {
    name: string;
    value: string;
}

export interface HttpRequestOptions {
    url: string;
    headers?: Header[];
    body?: object;
    type: HttpRequestType;
}

export interface HttpResponse {
    data: any;
}

export class HttpClient {
    public createAndSend(httpRequestOptions: HttpRequestOptions) {
        const httpResponseSubject = new Subject<HttpResponse>();
        try {
            const httpRequest = new XMLHttpRequest();

            httpRequest.open(HttpRequestType[httpRequestOptions.type], httpRequestOptions.url, true);

            httpRequestOptions.headers?.forEach(header => {
                httpRequest.setRequestHeader(header.name, header.value);    
            });

            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
                    httpResponseSubject.next({ 
                        data: JSON.parse(httpRequest.response)
                    } as HttpResponse);
                    httpResponseSubject.complete();
                } else if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status !== 200) {
                    httpResponseSubject.error(httpRequest.status);
                }
            }
            
            let data;
            if (httpRequestOptions.body) {
                data = JSON.stringify(httpRequestOptions.body);
            }
            httpRequest.send(data);
        }
        catch (error) { 
            console.error(error);
        }

        return httpResponseSubject.asObservable();
    }
}