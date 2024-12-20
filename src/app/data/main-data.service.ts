export class MainDataService {
    async getData() {
        let promiseResult = new Promise((resolve, reject) => {
            resolve(5 + 5);
        });
        return promiseResult;
    }
}