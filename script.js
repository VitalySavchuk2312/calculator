const main = (function() {
    return {
        currentValue: '',
        operators: [],
        selectors: {
            calcSymbolsArray: document.querySelectorAll('.calc__row-item:not(.calc__row-item-clear):not(.calc__row-item-evaluate)'),
            calcVisibleValue: document.querySelector('.calc__result-value'),
            calcOperators: document.querySelectorAll('.calc__row-item-operator'),
            calcEvaluate: document.querySelector('.calc__row-item-evaluate')
        },
        showOperation() {
            this.selectors.calcSymbolsArray.forEach(item => {
                item.addEventListener('click', (e) => {
                    this.currentValue += e.target.innerHTML;
                    this.selectors.calcVisibleValue.innerHTML = this.currentValue;
                })
            })
        },
        calculate() {
            this.selectors.calcEvaluate.addEventListener('click', (e) => {
                const onlyDigits = this.currentValue.split(/[*+-/]/);
                const result = operators.forEach((item, index) => {
                    switch(item) {
                        case '+':
                            onlyDigits[index]
                    }
                });
            });
        },
        clear() {
            document.querySelector('.calc__row-item-clear').addEventListener('click', () => {
                this.currentValue = [];
                this.selectors.calcVisibleValue.innerHTML = 0;
            });
        },
        test() {
            this.selectors.calcOperators.forEach(item => {
                item.addEventListener('click', (e) => {
                    this.operators.push(e.target.innerHTML);
                })
            })
        },
        init() {
            this.showOperation();
            this.calculate();
            this.test();
            this.clear();
        }
    }
})();

main.init(); 