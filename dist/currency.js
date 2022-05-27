/*
    To get debugger to work in vs code, set breakpoint on a line
    On the run panel, select run and debug (play button with bug)
    Select node.js

    To make more streamline, there is an option to create a 
    launch.json file under the run and debug button.
    Can change "name" to whatever you want the debugger to be named
    Be sure to change the "program" to current directory

    To see output from debug process, use : ctrl + shift + y
    It can also be accessed through the 3 dots above terminal window

    To step into, press arrow down key in visual studio code
    Use step over to figure out values.
    Check for values either in variables section, or by hovering

    Call stack section of debugger tells you what function called what function

    Add a conditional break point by right clicking on breakpoint

    Add objects to watch to keep track of them
*/

const rates = {};

function setExchangeRate(rate, sourceCurrency, targetCurrency) {
  if (rates[sourceCurrency] === undefined) {
    rates[sourceCurrency] = {};
  }

  if (rates[targetCurrency] === undefined) {
    rates[targetCurrency] = {};
  }

  for (const currency in rates){
      if (currency !== targetCurrency){
          // Use a pivot rate for currencies that don't have the direct?
          const pivotRate = currency === sourceCurrency ? 1 : rates[currency];
          rates[currency][targetCurrency] = rate * pivotRate;
          rates[targetCurrency][currency] = 1 / (rate * pivotRate);
      }
  }
}

function convertToCurrency(value, sourceCurrency, targetCurrency) {
  const exchangeRate = rates[sourceCurrency][targetCurrency];
  return exchangeRate && value * exchangeRate;
}

function formatValueForDisplay(value) {
  return value.toFixed(2);
}

function printForeignValues(value, sourceCurrency) {
  console.info(`The value of ${value} ${sourceCurrency} is:`);

  for (const targetCurrency in rates) {
    if (targetCurrency !== sourceCurrency) {
      const convertedValue = convertToCurrency(value, sourceCurrency, targetCurrency);
      const displayValue = formatValueForDisplay(convertedValue);
      console.info(`- ${displayValue} ${targetCurrency}`);
    }
  }
}

setExchangeRate(0.88, 'USD', 'EUR');
setExchangeRate(107.4, 'USD', 'JPY');
printForeignValues(10, 'EUR');