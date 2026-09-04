import { useEffect, useState, useRef } from "react";
import "./Calculator.css"
import { evaluate, number } from "mathjs";

function Calculator() {

    const [display, setDisplay] = useState("0")
    const displayRef = useRef("")

    function updateDisplay(value) {
        displayRef.current = value
        setDisplay(value)
    }

    function getNumbers(string) {

        let lastIndex = -1;
        let firstIndex = -1;
        let foundNumber = false;
        let numbers = []

        console.log(string)

        for(let i = string.length - 1; i >= 0; i--) {

            let char = string[i]

            if(!foundNumber && lastIndex != -1) {

                lastIndex = -1;
                firstIndex = -1;

            }

            if(char == "." || isNumber(char)) {

                if(lastIndex != -1) {

                    firstIndex = i

                } else {

                    lastIndex = i

                }

                foundNumber = true;
            } else {
                if(foundNumber) {
                    foundNumber = false
                    numbers.push(string.slice(firstIndex, lastIndex + 1))
                }

            }


        }

        if(lastIndex != -1 && firstIndex == -1) {
            firstIndex = lastIndex
        }

        numbers.push(string.slice(firstIndex, lastIndex + 1))

        numbers.reverse()

        return numbers

    }


    function isNumber(char) {

        if(Number.isNaN(parseInt(char))) {
            return false
        } else {
            return true
        }

    }

    

    function handleOperation(e, operator=null) {
        let overlap = false;

        if(!isNumber(displayRef.current[displayRef.current.length - 1])) {
            overlap = true;
        }

        if(operator == null) {
            operator = e.target.id
        }

        switch(operator) {

            case "percentual":
                if(overlap) {
                    updateDisplay(`${displayRef.current.slice(0, displayRef.current.length - 1)}%`)
                } else {
                    updateDisplay(`${displayRef.current}%`)

                }

                break;
                
            case "division":
                if(overlap) {
                    updateDisplay(`${displayRef.current.slice(0, displayRef.current.length - 1)}/`)
                } else {
                    updateDisplay(`${displayRef.current}/`)

                }

                break;
                
            case "multiplication":
                if(overlap) {
                    updateDisplay(`${displayRef.current.slice(0, displayRef.current.length - 1)}*`)
                } else {
                    updateDisplay(`${displayRef.current}*`)

                }

                break;
                
            case "minus":
                if(overlap) {
                    updateDisplay(`${displayRef.current.slice(0, displayRef.current.length - 1)}-`)
                } else {
                    updateDisplay(`${displayRef.current}-`)

                }

                break;
                
            case "addition":
                if(overlap) {
                    updateDisplay(`${displayRef.current.slice(0, displayRef.current.length - 1)}+`)
                } else {
                    updateDisplay(`${displayRef.current}+`)

                }

                break;

        }

    }


    function handleNumOperation(e, num=null) {
        if(num == null) {
            if(e.target.id.startsWith("num")) {
                num = parseInt(e.target.id.at(-1));
                
            }
        } else {
            
            num = parseInt(num)
        }


        let lastNumber = "";
        let newLastNumber = "";

        if(isNumber(displayRef.current.at(-1))) {
            lastNumber = getNumbers(displayRef.current).at(-1)
            newLastNumber = lastNumber

            if(lastNumber[0] == 0 && lastNumber[1] != "." && lastNumber.length > 0) {

                newLastNumber = lastNumber.slice(1, lastNumber.length)

            }

        }
        newLastNumber = newLastNumber + num

        updateDisplay(`${displayRef.current.slice(0, displayRef.current.length - lastNumber.length)}${newLastNumber}`)
        
    }

    function handleOpposite() {
        if(isNumber(displayRef.current.at(-1))) {
            let lastNumber = getNumbers(displayRef.current).at(-1).toString();

            var noLastNumber = displayRef.current.slice(0, displayRef.current.length - lastNumber.length)

            if(getNumbers(displayRef.current).length > 1) {
                if(displayRef.current.at(displayRef.current.length - lastNumber.length - 1) == "-" && displayRef.current.at(displayRef.current.length - lastNumber.length - 2) == "(") {
                    updateDisplay(`${noLastNumber.slice(0, noLastNumber.length - 2)}${lastNumber}`)
                } else {
                    updateDisplay(`${noLastNumber}(-${lastNumber}`)
                }
            } else {
                updateDisplay(`(-${displayRef.current}`)
            }
        }

    }

    function handleDot() {

        if(!isNumber(displayRef.current[displayRef.current.length - 1])) {
            return
        }

        updateDisplay(`${displayRef.current}.`)

    }

    function openParenthesesCount(string) {

        let openParenthesesCount = 0

        for(let i = 0; i < string.length; i++) {

            let char = string[i]

            if(char == "(") {
                openParenthesesCount++
            } else if(char == ")") {
                openParenthesesCount--
            }

        }

        return openParenthesesCount

    }

    function handleParentheses() {

        if((displayRef.current.at(-1) == ")" || isNumber(displayRef.current.at(-1))) && openParenthesesCount(displayRef.current) > 0) {
            updateDisplay(`${displayRef.current})`)
        } else {

            if(displayRef.current.at(-1) == "(") {
                updateDisplay(`${displayRef.current}(`)
            } else {
                updateDisplay(`${displayRef.current}*(`)
            }
        }

    }

    function handleEquals() {

        const result = evaluate(displayRef.current)

        updateDisplay(result.toString())


    }

    useEffect(() => {

        function handleKeyDown(e) {
            if(isNumber(e.key)) {

                handleNumOperation(null, e.key)

            } else {

                switch (e.key.toLowerCase()) {
                    case "%":
                        handleOperation(null, "percentual")
                        
                        break;

                    case "(":
                        handleParentheses()
                        break

                    case ")":
                        handleParentheses();
                        break;

                    case "/":
                        handleOperation(null, "division")
                        break

                    case "Backspace":
                        updateDisplay(displayRef.current.slice(0, displayRef.current.length - 1))
                        if(displayRef.current == "")
                            updateDisplay("0")
                        break;

                    case "c":
                        updateDisplay("0")
                        break;

                    case "*":
                        handleOperation(null, "multiplication")
                        break;

                    case "+":
                        handleOperation(null, "addition")
                        break;

                    case "-":
                        handleOperation(null, "minus")
                        break;

                    case "=":
                        handleEquals()
                        break;

                    case "Enter":
                        handleEquals();
                        break;

                    case ".":
                        handleDot()
                        break;

                    case ",":
                        handleDot();
                        break;
                
                    default:
                        break;
                }

            }


        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }

    }, [])


    return (

        <>
        
            <section className="calculator">

                
                <div className="calculator-display">{ display }</div>


                <div className="calculator-buttons">

                    <button className="normal-button" id="clear" onClick={ () => { updateDisplay("0") } }>C</button>
                    <button className="normal-button" id="parentheses" onClick={ handleParentheses }>()</button>
                    <button className="normal-button" id="percentual" onClick={ handleOperation }>%</button>
                    <button className="operator-button" id="division" onClick={ handleOperation }>÷</button>



                    <button className="normal-button" id="num7" onClick={ handleNumOperation }>7</button>
                    <button className="normal-button" id="num8" onClick={ handleNumOperation }>8</button>
                    <button className="normal-button" id="num9" onClick={ handleNumOperation }>9</button>
                    <button className="operator-button" id="multiplication" onClick={ handleOperation }>×</button>



                    <button className="normal-button" id="num4" onClick={ handleNumOperation }>4</button>
                    <button className="normal-button" id="num5" onClick={ handleNumOperation }>5</button>
                    <button className="normal-button" id="num6" onClick={ handleNumOperation }>6</button>
                    <button className="operator-button" id="minus" onClick={ handleOperation }>-</button>



                    <button className="normal-button" id="num1" onClick={ handleNumOperation }>1</button>
                    <button className="normal-button" id="num2" onClick={ handleNumOperation }>2</button>
                    <button className="normal-button" id="num3" onClick={ handleNumOperation }>3</button>
                    <button className="operator-button" id="addition" onClick={ handleOperation }>+</button>

                    <button className="normal-button" id="opposite" onClick={ handleOpposite }>+/-</button>
                    <button className="normal-button" id="num0" onClick={ handleNumOperation }>0</button>
                    <button className="normal-button" id="dot" onClick={ handleDot }>.</button>
                    <button className="equals-button" id="equals" onClick={ handleEquals }>=</button>

                </div>


            </section>
        
        </>

    )

}

export default Calculator
