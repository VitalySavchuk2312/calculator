const main = (function() {
    let currentValue = '';
    let currentResult = [];
    let operators = [];
    const selectors = {
        calcSymbolsArray: document.querySelectorAll('.calc__row-item:not(.calc__row-item-clear):not(.calc__row-item-evaluate)'),
        calcVisibleValue: document.querySelector('.calc__result-value'),
        calcOperators: document.querySelectorAll('.calc__row-item-operator'),
        calcEvaluate: document.querySelector('.calc__row-item-evaluate')
    };
    function showOperation() {
        selectors.calcSymbolsArray.forEach(item => {
            item.addEventListener('click', (e) => {
                currentValue += e.target.innerHTML;
                selectors.calcVisibleValue.innerHTML = currentValue;
            })
        })
    }
    function evaluate() {
        selectors.calcEvaluate.addEventListener('click', (e) => {
            let result = currentResult[0];
            const test = operators.filter(item => item !== "*" && item !== "/");
            test.forEach((item, index) => {
                if (currentResult[index + 1] !== undefined) {
                    switch(item) {
                        case "+": 
                            result += currentResult[index + 1]; 
                            break;
                        case "-":
                            result -= currentResult[index + 1]; 
                            break;
                        default:
                            console.log('not correct operator');
                            break;
                    }
                }
            });
        });
    };
    function clear() {
        document.querySelector('.calc__row-item-clear').addEventListener('click', () => {
            currentValue = [];
            operators = [];
            selectors.calcVisibleValue.innerHTML = 0;
        });
    };
    function operate() {
        selectors.calcOperators.forEach(item => {
            item.addEventListener('click', (e) => {
                operators.push(e.target.innerHTML);
                calculatePriorOperators();
            });
        })
    };
    function getOnlyDigits() {
        // hardcode with filter!!!
        return currentValue.split(/[*+-/]/).filter(item => item !== "").map(item => Number(item));
    }
    // multiply and divide
    function calculatePriorOperators() {
        const onlyDigits = getOnlyDigits();
        if (currentResult.length < 1) {
            currentResult = onlyDigits;
        }
        if (operators.length > 1 && operators[operators.length - 2] === "*") {
            const result = onlyDigits[operators.length - 2] * onlyDigits[operators.length - 1];
            currentResult.splice(operators.length - 2, 2, result);
            console.log(currentResult);
        }
    }
    function init() {
        showOperation();
        evaluate();
        operate();
        clear();
    }
    return { init }
})();

main.init(); 