import React from "react";
import "./styles.css";

export default function App() {
  const [display, setDisplay] = React.useState("0");
  const [equation, setEquation] = React.useState("0");
  const [answer, setAnswer] = React.useState("0");
  const [status, setStatus] = React.useState("new equation");
  const [period, setPeriod] = React.useState(false);

  const numerals = /[0123456789]/;
  const numeralsOverZero = /[123456789]/;
  const mathOperators = /[-*+/]/;
  const lastNumberNoPeriodRegex = /[-*+/]{1}[0123456789]+$|^[0123456789]+$/;
  const firstNumberInOperandIsZeroRegex = /[-*+/]{1}[0]{1}$/;
  const firstNumberInOperandHasPeriodRegex = /[-*+/]{1}[0]{1}.$/;

  const handleButtonClick = (event) => {
    let buttonValue = event.target.value;
    // Backspace button
    if (buttonValue === "<") {
      if (display.split("").length === 1) {
        setDisplay("0");
        setStatus("new equation");
      } else {
        setDisplay(display.slice(0, -1));
        let lastCharacter = display.slice(0, -1).split("").pop();
        if (lastCharacter.match(numerals) || lastCharacter === ".") {
          setStatus("operand");
          if (display.match(lastNumberNoPeriodRegex)) {
            setPeriod(false);
          } else {
            setPeriod(true);
          }
        } else if (lastCharacter.match(mathOperators)) {
          setStatus("operator");
          setPeriod(false);
        }
      }
    }

    // Clear display button
    if (buttonValue === "C") {
      if (display === "0") {
        setEquation("0");
      }
      setDisplay("0");
      setStatus("new equation");
    }

    switch (status) {
      case "new equation":
        if (buttonValue.match(numeralsOverZero) || display === "Infinity") {
          setDisplay(buttonValue);
          setStatus("operand");
          setPeriod(false);
        } else if (buttonValue.match(mathOperators)) {
          setDisplay(display + buttonValue);
          setStatus("operator");
        } else if (buttonValue === ".") {
          setDisplay(display + buttonValue);
          setPeriod(true);
          setStatus("operand");
        }
        break;
      case "operand":
        if (buttonValue.match(numerals)) {
          if (display.match(firstNumberInOperandIsZeroRegex)) {
            setDisplay(display.slice(0, -1) + buttonValue);
          } else if (display.match(firstNumberInOperandHasPeriodRegex)) {
            setDisplay(display + buttonValue);
          } else {
            setDisplay(display + buttonValue);
          }
        } else if (buttonValue.match(mathOperators)) {
          setDisplay(display + buttonValue);
          setStatus("operator");
        } else if (buttonValue === "=") {
          setEquation(display);
          setDisplay(eval(display).toString());
          setStatus("new equation");
          setAnswer(eval(display).toString());
        } else if (
          buttonValue === "." &&
          display.match(lastNumberNoPeriodRegex)
        ) {
          setDisplay(display + buttonValue);
          setPeriod(true);
        }
        break;
      case "operator":
        if (buttonValue.match(mathOperators)) {
          setDisplay(display.slice(0, -1) + buttonValue);
        } else if (buttonValue.match(numerals)) {
          setDisplay(display + buttonValue);
          setStatus("operand");
          setPeriod(false);
        } else if (buttonValue === ".") {
          setDisplay(display + "0" + buttonValue);
          setPeriod(true);
        }
        break;
      default:
        setDisplay("none");
        setStatus("new equation");
    }
  };

  return (
    <div className="App">
      <h1>Calculator + Number Facts</h1>
      <Display display={display} equation={equation} />
      <NumberPad handleButtonClick={handleButtonClick} />
      <NumberFact equation={equation} answer={answer} />
    </div>
  );
}

function Display({ display, equation }) {
  return (
    <div className="Display">
      <p className="Display__equation">{equation}</p>
      <p className="Display__calc">{display}</p>
    </div>
  );
}

function NumberPad({ handleButtonClick }) {
  return (
    <div className="NumberPad">
      <InputButton value="7" handleButtonClick={handleButtonClick} />
      <InputButton value="8" handleButtonClick={handleButtonClick} />
      <InputButton value="9" handleButtonClick={handleButtonClick} />
      <InputButton value="/" handleButtonClick={handleButtonClick} />
      <InputButton value="4" handleButtonClick={handleButtonClick} />
      <InputButton value="5" handleButtonClick={handleButtonClick} />
      <InputButton value="6" handleButtonClick={handleButtonClick} />
      <InputButton value="*" handleButtonClick={handleButtonClick} />
      <InputButton value="1" handleButtonClick={handleButtonClick} />
      <InputButton value="2" handleButtonClick={handleButtonClick} />
      <InputButton value="3" handleButtonClick={handleButtonClick} />
      <InputButton value="-" handleButtonClick={handleButtonClick} />
      <InputButton value="0" handleButtonClick={handleButtonClick} />
      <InputButton value="." handleButtonClick={handleButtonClick} />
      <InputButton value="=" handleButtonClick={handleButtonClick} />
      <InputButton value="+" handleButtonClick={handleButtonClick} />
      <InputButton value="C" handleButtonClick={handleButtonClick} />
      <InputButton value="<" handleButtonClick={handleButtonClick} />
    </div>
  );
}

function InputButton({ value, handleButtonClick, ...rest }) {
  return (
    <input
      value={value}
      onClick={handleButtonClick}
      className="btn"
      type="button"
    />
  );
}

// http://numbersapi.com/?ref=apilist.fun#42
function NumberFact({ equation, answer }) {
  const [numberFact, setNumberFact] = React.useState(null);

  React.useEffect(() => {
    fetchNumberFact(answer).then((numberFactData) => {
      setNumberFact(numberFactData);
    });
  }, [equation, answer]);

  if (!numberFact) {
    return <div className="NumberFact">{null}</div>;
  }

  return (
    <div className="NumberFact">
      <h2>Did you know...</h2>
      <p>{numberFact}</p>
    </div>
  );
}

function fetchNumberFact(number) {
  if (!number.match(/^\d+$/)) {
    number = number.split('.')[0]
  }
  const baseURL = "http://numbersapi.com/" + number + "?json";
  return window
    .fetch(baseURL)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
    })
    .then((response) => response.text);
}
