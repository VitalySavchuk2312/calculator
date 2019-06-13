const main = (function() {
    let currentValue = '';
    let operators = [];
    const selectors = {
        calcSymbolsArray: document.querySelectorAll('.calc__row-item:not(.calc__row-item-clear):not(.calc__row-item-evaluate)'),
        calcVisibleValue: document.querySelector('.calc__result-value'),
        calcOperators: document.querySelectorAll('.calc__row-item-operator'),
        calcDigits: document.querySelectorAll('.calc__row-item--digit'), 
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
            // calculatePriorOperators();
            const onlyDigits = getOnlyDigits();
            let result = onlyDigits[0];
            operators.forEach((item, index) => {
                if (onlyDigits[index + 1] !== undefined) {
                    switch(item) {
                        case "+": 
                            if (operators[index + 1] !== "*" && operators[index + 1] !== "/") {
                                result += onlyDigits[index + 1];
                            } else if(operators[index + 1] === "*") {
                                result += (onlyDigits[index + 1] * onlyDigits[index + 2]);
                                onlyDigits.splice(index + 1, 2, result);
                                operators.splice(index + 1, 1);
                            } else if(operators[index + 1] === "/") {
                                result += (onlyDigits[index + 1] / onlyDigits[index + 2]);
                                onlyDigits.splice(index + 1, 2, result);
                                operators.splice(index + 1, 1);
                            }
                            break;
                        case "-":
                            result -= onlyDigits[index + 1]; 
                            break;
                        case "*":
                            result *= onlyDigits[index + 1]; 
                            break;
                        case "/":
                            result /= onlyDigits[index + 1]; 
                            break;
                        default:
                            console.log('not correct operator');
                            break;
                    }
                }
                console.log(result);
            });
            // selectors.calcVisibleValue.innerHTML = result;
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
            });
        });
    };
    function getOnlyDigits() {
        // hardcode with filter!!!
        return currentValue.split(/[*+-/]/).filter(item => item !== "").map(item => Number(item));
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