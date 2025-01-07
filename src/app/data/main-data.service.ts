export class MainDataService {
    private testProp = 5;
    setData() {
        this.testProp += 5;
    }

    async getData() {
        let promiseResult = new Promise((resolve, reject) => {
            resolve(this.testProp);
        });
        return promiseResult;
    }
}