export class ChangeDetector {
    updateView!: Function;
    updateCss!: Function;
    
    constructor(args: any) {
        this.updateView = (<any>this).injectedData.updateView;
        this.updateCss = (<any>this).injectedData.updateCss;
    }
}