export class ChangeDetector {
    updateView!: Function;
    
    constructor(args: any) {
        this.updateView = (<any>this).injectedData.updateView;
    }
}