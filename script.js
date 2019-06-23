const calculator = (function() {
    // properties
    const availableOperators = ['+', '-', '*', '/'];
    const selectors = {
        calcSymbolsArray: document.querySelectorAll('.calc__row-item:not(.calc__row-item-clear):not(.calc__row-item-evaluate)'),
        calcResultValue: document.querySelector('.calc__result-value'),
        calcEvaluate: document.querySelector('.calc__row-item-evaluate'),
        calcClear: document.querySelector('.calc__row-item-clear')
    };
    let userInputValue = '';
    let usedOperators = [];
    let onlyDigits = [];
    // methods
    function showOperation() {
        selectors.calcSymbolsArray.forEach(item => {
            item.addEventListener('click', (e) => {
                const userInputValueLength = userInputValue.length;
                const currentEntryIsOperator = availableOperators.includes(e.target.innerHTML);
                const previousEntryWasOperator = availableOperators.includes(userInputValue[userInputValueLength - 1]);
                if (currentEntryIsOperator) {
                   // A case, if user uses negative prefix in the beginning of expression. 
                   // Only '-' can be the first operator, because there's no sense to put +/* before the first number.
                    if (userInputValueLength === 0 && e.target.innerHTML === '-') {
                        setUserInput(e.target.innerHTML);
                        return;
                    }
                   // Adding an operator to usedOperators array and showing it in the result section, only if the 
                   // previous entry is a number, in order to not allowed one operator to be next to another one (e.g. 1+-2).
                   // Also making sure it won't be the first symbol in expression.
                    if (userInputValueLength !== 0 && !previousEntryWasOperator) {
                        usedOperators.push(e.target.innerHTML);
                        setUserInput(e.target.innerHTML);
                    }
                    return;
                }
                setUserInput(e.target.innerHTML);
            })
        })
    }
    function setUserInput(value) {
        userInputValue += value;
        selectors.calcResultValue.innerHTML = userInputValue;
    }
    function evaluate() {
        selectors.calcEvaluate.addEventListener('click', (e) => {
            getOnlyDigits();
            let result = onlyDigits[0];
            // Converting number to negative, if the first symbol is a minus. Also removing this minus from
            // user's input string, since the result can become a positive after calculation.
            if (userInputValue[0] === '-') {
                userInputValue = userInputValue.substring(1);
                result = -Math.abs(result);
            }
            usedOperators.forEach((item, index) => {
                const nextOperator = usedOperators[index + 1];
                if (onlyDigits[index + 1] !== undefined) {
                    switch(item) {
                        /*
                          Special checks for '+' and '-' operators. Since they have less priority, comparing to
                          multiplication and division, we want to be sure that the next operators are 
                          not '*' or '/' before calculation. But if they are, we need firstly to calculate those 
                          operations and only then perform addition or subtraktion. The logic for this is implemented in 
                          calculatePriorNumber function.
                        */
                        case "+": 
                            if (nextOperator !== "*" && nextOperator !== "/") {
                                result += onlyDigits[index + 1];
                            } else {
                                calculatePriorNumber(index + 1);
                                result += onlyDigits[index + 1];
                            }
                            break;
                        case "-":
                            if (nextOperator !== "*" && nextOperator !== "/") {
                                result -= onlyDigits[index + 1];
                            } else {
                                calculatePriorNumber(index + 1);
                                result -= onlyDigits[index + 1];
                            }
                            break;
                        case "*":
                            result *= onlyDigits[index + 1];
                            break;
                        case "/":
                            result /= onlyDigits[index + 1];
                            break;
                        default:
                            result = 'error';
                            break;
                    }
                }
            });
            // saving calculated result
            selectors.calcResultValue.innerHTML = result;
            onlyDigits = [result];
            usedOperators = [];
            userInputValue = result;
        });
    };
    function clear() {
        selectors.calcClear.addEventListener('click', () => {
            userInputValue = [];
            usedOperators = [];
            selectors.calcResultValue.innerHTML = 0;
        });
    };
    function calculatePriorNumber(i) {
        // Mapping through the array of used operators, while operator is multiplication or division. Replacing two numbers
        // in used digits array with received result of math operation. Also removing operator from used operators' arr.
        while (usedOperators[i] === "*" || usedOperators[i] === "/") {
            if (usedOperators[i] === "*") {
                onlyDigits.splice(i, 2, onlyDigits[i] * onlyDigits[i + 1]);
            } else if (usedOperators[i] === "/") {
                onlyDigits.splice(i, 2, onlyDigits[i] / onlyDigits[i + 1]);
            }
            usedOperators.splice(i, 1);
        }
    };
    function getOnlyDigits() {
        onlyDigits = userInputValue.split(/[*+-/]/).filter(item => item !== "").map(item => parseInt(item));
    }
    function init() {
        showOperation();
        evaluate();
        clear();
    }
    return { init }
})();

calculator.init(); 