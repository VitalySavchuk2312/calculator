const main = (function() {
    // properties
    const availableOperators = ['+', '-', '*', '/'];
    const selectors = {
        calcSymbolsArray: document.querySelectorAll('.calc__row-item:not(.calc__row-item-clear):not(.calc__row-item-evaluate)'),
        calcResult: document.querySelector('.calc__result-value'),
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
                /* 
                  add an operator to usedOperators array, if that's actually an operator and the previous 
                  item in userInput entry is a number, in order to not add needless operators into array,
                  since we need only one between two numbers.
                */
                if (availableOperators.includes(e.target.innerHTML) && !availableOperators.includes(userInputValue[userInputValueLength - 1])) {
                    usedOperators.push(e.target.innerHTML);
                }
                /*
                  make sure only minus operator can be before first number, because +/* as a first index in the expression
                  (+100+50*2/4...) doesn't make any sense. If user tries to use them, simply return.
                */
                if (userInputValueLength === 0 && availableOperators.includes(e.target.innerHTML)) {
                    if (e.target.innerHTML === '-') {
                        userInputValue += e.target.innerHTML;
                        selectors.calcResult.innerHTML = userInputValue;
                    }
                    return;
                }
                /*
                  show user's input, if it's an operator, but the previous one was not
                  (to not repeat two operators in same place), or if it's just a number.
                */
                if (!availableOperators.includes(userInputValue[userInputValueLength - 1]) || !availableOperators.includes(e.target.innerHTML)) {
                    userInputValue += e.target.innerHTML;
                    selectors.calcResult.innerHTML = userInputValue;
                }
            })
        })
    }
    function evaluate() {
        selectors.calcEvaluate.addEventListener('click', (e) => {
            getOnlyDigits();
            let result = onlyDigits[0];
            /* 
              Convert number to negative, if the first symbol is minus. Also remove this minus from the 
              array of operators in order to not use it in the iteration, because it's related only to the first element,
              but isn't an operand between two digits.
            */
            if (userInputValue[0] === '-') {
                userInputValue = userInputValue.substring(1);
                result = -Math.abs(result);
                usedOperators.shift();
            }
            usedOperators.forEach((item, index) => {
                const nextItem = onlyDigits[index + 1];
                if (nextItem !== undefined) {
                    switch(item) {
                        /*
                          special checks for '+' and '-' operators. Since they have less priority, comparing to
                          multivision and division, we want to be sure that the next operator is neither '*' nor '/'.
                          If they are, we need firstly to calculate those operations and only then perform addition or
                          subtraktion. The logic for this is implemented in calculatePriorNumber() function.
                        */
                        case "+": 
                            if (usedOperators[index + 1] !== "*" && usedOperators[index + 1] !== "/") {
                                result += nextItem;
                            } else {
                                calculatePriorNumber(index + 1);
                                result += nextItem;
                            }
                            break;
                        case "-":
                            if (usedOperators[index + 1] !== "*" && usedOperators[index + 1] !== "/") {
                                result -= nextItem;
                            } else {
                                calculatePriorNumber(index + 1);
                                result -= nextItem;
                            }
                            break;
                        case "*":
                            result *= nextItem;
                            break;
                        case "/":
                            result /= nextItem;
                            break;
                        default:
                            result = 'error';
                            break;
                    }
                }
            });
            // saving calculated result
            selectors.calcResult.innerHTML = result;
            onlyDigits = [result];
            usedOperators = [];
            userInputValue = result;
        });
    };
    function clear() {
        selectors.calcClear.addEventListener('click', () => {
            userInputValue = [];
            usedOperators = [];
            selectors.calcResult.innerHTML = 0;
        });
    };
    function calculatePriorNumber(i) {
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
        // hardcoded with filter!!!
        onlyDigits = userInputValue.split(/[*+-/]/).filter(item => item !== "").map(item => Number(item));
    }
    function init() {
        showOperation();
        evaluate();
        clear();
    }
    return { init }
})();

main.init(); 