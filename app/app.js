class App {
    testProperty;
    testArray = [
        { key: 1, value: 'something' },
        { key: 2, value: 'something 2' },
        { key: 3, value: '', testProp: 5 },
    ];

    _iterator = 0;
    get iterator() {
        return this._iterator;
    }

    set iterator(v) {
        this._iterator = v;
        if (v % 2 === 0) {
            this.testHover = !this.testHover;
            this.updateCss();
        }
    }

    greenStyledItem(e) {
        if (e.dataContext.value == 'something') {
            return true;
        }
        return false;
    }

    blueStyledItem(e) {
        if (e.dataContext.testProp == 5) {
            return true;
        }
        return false;
    }

    testHover = false;

    constructor() {
        this.testProperty = 123;
    }

    onValueChangedTimeout = 0;
    onValueChanged(e) {
        this.updateView();
    }

    testClick(e) {
        if (e.sharkJS) {
            let newValue = e.sharkJS.dataContext.value;
            this.testProperty = newValue;
        }
        this.testArray[2].value = 'updated mannyally' + this.iterator;
        this.iterator++;
        // mannually updated
        this.updateView();
    }

    onMouseOver(e) {
        this.testHover = true;
        this.updateCss();
    }

    onMouseLeft(e) {
        this.testHover = false;
        this.updateCss();
    }
}