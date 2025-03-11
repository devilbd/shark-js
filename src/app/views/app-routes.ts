import { IRoute } from "../../framework/core/router/router.service";

export function routes() {
    return [
        {
            componentName: 'HttpClientSampleComponent',
            path: '#http-client-sample',
            parameters: undefined
        } as IRoute
    ]
}