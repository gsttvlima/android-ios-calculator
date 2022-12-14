import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';
import { useState, useEffect } from 'react';

// Nerdamer (library)
var nerdamer = require('nerdamer');
require('nerdamer/Algebra');
require('nerdamer/Calculus');
require('nerdamer/Solve');
require('nerdamer/Extra');

export default function App() {

  // Hooks
  const [character, addCharacter] = useState('');
  const [display, setDisplay] = useState('');
  const [operation, setOperation] = useState('');
  const [message, setMessage] = useState('');

  function getResult() {

    // Makes the operation legible by the library
    let replaced = character
    let last = replaced.slice(-1)

    while (last.includes("%") || last.includes("+") || last.includes("-") || last.includes("*") || last.includes("√") || last.includes(".") || last.includes("^")) {
      replaced = replaced.slice(0, -1)
      last = replaced.slice(-1)
    }

    replaced = replaced.split("÷").join("/")
    replaced = replaced.split("x").join("*")
    replaced = replaced.split("√").join("sqrt(")

    // The code below checks if there's a square root in the operation, because it's necessary to close the sqrt() tag
    var oneByOne = replaced.split('')
    let sqrt = false
    var replaced_new = '';
    oneByOne.forEach(function (one, i) {
      var newValue = one;
      if ((one === 's') || (one === 'q') || (one === 'r') || (one === 't') || (one === '(' && oneByOne[i - 1] === 't')) {
        sqrt = true
      }
      if (sqrt === true) {
        if ((one === '+') || (one === '-') || (one === '/') || (one === '*')) {
          newValue = ')' + one
          sqrt = false
        }
        if (typeof oneByOne[i + 1] !== 'string') {
          newValue = one + ')'
          sqrt = false
        }
      }
      replaced_new = replaced_new + newValue
    })

    // Calculate using Nerdamer
    let calculate = nerdamer(replaced_new).evaluate()

    // Replaces all values ​​with the result of the operation
    addCharacter(calculate)


  }

  // Clear values
  function clearAll() {
    setMessage('')
    addCharacter('')
  }

  // Delete the last character typed
  function deleteLast() {
    setMessage('')
    addCharacter(display.slice(0, -1))
  }

  // Update the display with the 'character' usestate value
  // This function is called everytime the usestate changed 

  function updateDisplay() {

    // The code below runs when the user is typing and not when the result is got
    if (typeof character == 'string') {
      var values = character.split(operation);
      var lastValue = values[values.length - 1]
      values.splice(-1)
      var penultimateValue = values[values.length - 1]

      let last = character.slice(-1)
      let penultimate = character.slice(0, -1).slice(-1)

      // Treatment 
      
      if(character[0] === '\%' || character[0] === '÷' || character[0] === '.' || character[0] === 'x' || character[0] === ')'){
        addCharacter(character.substring(0, character.length - 1))

      }
      if (
        (last.includes("+") && (penultimate.includes("√") || penultimate.includes(".")))
        ||
        (last.includes("-") && ( penultimate.includes("√") || penultimate.includes(".") ))
        ||
        (last.includes("x") && (penultimate.includes("-") || penultimate.includes("+") || penultimate.includes("√") || penultimate.includes("÷") || penultimate.includes(".")))
        ||
        (last.includes(".") && (penultimate.includes("-") || penultimate.includes("+") || penultimate.includes("√") || penultimate.includes("÷") || penultimate.includes("x")))
        ||
        (last.includes("÷") && (penultimate.includes("x") || penultimate.includes("+") || penultimate.includes("-") || penultimate.includes("√") || penultimate.includes(".") || penultimate.includes("\%")))
        || 
        (last.includes("+") && (penultimate.includes("x") || penultimate.includes("+") || penultimate.includes("-") || penultimate.includes("√") || penultimate.includes(".") || penultimate.includes("\%")))
        || 
        (last.includes("-") && (penultimate.includes("x") || penultimate.includes("+") || penultimate.includes("-") || penultimate.includes("√") || penultimate.includes(".") || penultimate.includes("\%")))
        || 
        (last.includes("x") && (penultimate.includes("x") || penultimate.includes("+") || penultimate.includes("-") || penultimate.includes("√") || penultimate.includes(".")))
        || 
        (last.includes("\%") && (penultimate.includes("x") || penultimate.includes("+") || penultimate.includes("-") || penultimate.includes("√") || penultimate.includes(".") || penultimate.includes("\%") || penultimate.includes("÷")))
        || 
        (penultimate.includes("^") && (last.includes("x") || last.includes("√") || last.includes(".") || last.includes("\%") || last.includes("÷")))) {
        addCharacter(character.substring(0, character.length - 1))
      }

      // Prevents the comma from being repeated 
      if (lastValue?.includes('.')) {
        var lastCharacter = lastValue.slice(-1)
        var lastValueWithoutLastCharacter = character.substring(0, character.length - 1)
        if (lastValueWithoutLastCharacter?.includes('.') && lastCharacter === '.') {
          addCharacter(character.substring(0, character.length - 1))
        }
      }

    }

    // Update the 'display' usestate
    setDisplay(String(character).slice(0, 16))

  }

  // The called function is responsible for preventing operations and commas from repeating unduly and finally updates the display
  useEffect(() => {
    updateDisplay()
  }
  )

  return (

    <>

      <View style={[styles.container]}>

        <Text style={[styles.display]}>{display}</Text>

        <View style={[styles.line]}>

          <TouchableHighlight onPress={function () { addCharacter(character + '^'); }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>^</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={function () { addCharacter(character + '√'); }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>√</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => clearAll()} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>C</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => deleteLast()} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>←</Text>
          </TouchableHighlight>

        </View>

        <View style={[styles.line]}>

          <TouchableHighlight onPress={function () { addCharacter(character + '('); setOperation('&#40;') }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>&#40;</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={function () { addCharacter(character + ')'); setOperation('&#41;') }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>&#41;</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={function () { addCharacter(character + '%'); setOperation('%') }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>%</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={function () { addCharacter(character + '÷'); setOperation('÷') }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>÷</Text>
          </TouchableHighlight>

        </View>

        <View style={[styles.line]}>

          <TouchableHighlight onPress={() => addCharacter(character + '7')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>7</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => addCharacter(character + '8')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>8</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => addCharacter(character + '9')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>9</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={function () { addCharacter(character + 'x'); setOperation('x') }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>x</Text>
          </TouchableHighlight>

        </View>

        <View style={[styles.line]}>

          <TouchableHighlight onPress={() => addCharacter(character + '4')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>4</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => addCharacter(character + '5')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>5</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => addCharacter(character + '6')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>6</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={function () { addCharacter(character + '-'); setOperation('-') }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>-</Text>
          </TouchableHighlight>

        </View>

        <View style={[styles.line]}>

          <TouchableHighlight onPress={() => addCharacter(character + '1')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>1</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => addCharacter(character + '2')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>2</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => addCharacter(character + '3')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>3</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={function () { addCharacter(character + '+'); setOperation('+') }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>+</Text>
          </TouchableHighlight>

        </View>

        <View style={[styles.line]}>

          <TouchableHighlight onPress={() => addCharacter(character + '0')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>0</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => addCharacter(character + '00')} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>00</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={function () { addCharacter(character + '.') }} style={[styles.touchableButton]}>
            <Text style={[styles.touchableText]}>.</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => getResult()} style={[styles.touchableButton, styles.equal]}>
            <Text style={[styles.touchableText]}>=</Text>
          </TouchableHighlight>



        </View>

      </View>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableButton: {
    backgroundColor: '#212529',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  touchableText: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'center'
  },

  display: {
    height: '29%',
    fontSize: 90,
    width: '100%',
    textAlign: 'right',
    bottom: 0,
    textAlignVertical: 'center',
    right: 30
  },
  line: {
    flexDirection: "row",
    height: '11.9%'
  },

  equal: {
    backgroundColor: '#0d6efd',
  }
});
