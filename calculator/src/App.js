import "./styles.css"

import DigitButton from "./DigitButtons";
import OperationButton from "./OperationButton";
import './App.css';
import { useReducer } from "react"

// This ACTIONS object is defined. It containes action types that are used to describe various actions that can be dispacted to update the state in your application. 
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}
// the reducer function, handles the states updates based on different action types. It takes the current state and action object as parameters and returns a new state based on the action type and payload. It handles the ADD_DIGIt action type, updating the current operand based on certain conditions. action object inside a reducer functions stores two property type and payload. 
function reducer(state, {type, payload}){
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state}
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state}
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
        // this part of the reducer handles the Choose Operation action type. It updates the state when a mathematical operation is chosen, considering carious scenarios like whether theres a previous operand or not. 
      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOperand == null && state.previousOperand == null) {
          return state
        }

        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation
          }
        }
        if (state.previousOperand == null) {
          return {
            ...state, 
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null, 
          }
        }
        return {
          ...state, 
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }
      // for the clear action type, this part returns an empty object, effectively resetting the state. 
      case ACTIONS.CLEAR:
        return {}
        // the delete digit action type is handled. It allows for deleting digits from the current operand while considering overwrite conditions and minimum length requirements. 
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite:false,
            currentOperand: null
          }
        }
        if (state.currentOperand == null) return state
        if (state.currentOperand.length === 1) {
          return {...state, currentOperand: null}
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
        // Evaluate action type, which computes the result of a mathematical operation and updates the state accordingly. 
      case ACTIONS.EVALUATE: 
      if (state.operation === null || state.operand === null || state.previousOperand === null) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }
}
// Evaluate function calculates the result of a mathematical operation based on the current and previous operands and the chosen operation type. It returns the computed result as a string. 
function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
  }
  return computation.toString()
}
// Instance of Intl.NumberFormat for formatting numbers as integers, specifying that no fractional digits should be displayed. 
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
// formatOperand function takes an operand as inpout, splits it into integer and decimal parts, and formats it according to the previously defined Integer_formatter
function formatOperand(operand) {
  if (operand==null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
// use the useREducer hook to manage the applications state and return JSX code to render the calculator interface. the dispatch function is used to dispatch actions to the reducer. 
function App() {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} /> 
      <DigitButton digit="2" dispatch={dispatch} /> 
      <DigitButton digit="3" dispatch={dispatch} /> 
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} /> 
      <DigitButton digit="5" dispatch={dispatch} /> 
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} /> 
      <DigitButton digit="8" dispatch={dispatch} /> 
      <DigitButton digit="9" dispatch={dispatch} /> 
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} /> 
      <DigitButton digit="0" dispatch={dispatch} /> 
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
