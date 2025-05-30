import { useState, useRef } from 'react'
import party from 'party-js'
import placeSound from './assets/place.mp3'
import winSound from './assets/win.mp3'
import loseSound from './assets/lose.mp3'
import nextSound from './assets/next.mp3'
import './App.css'

function App(){

  // audio
  const loseAudio = useRef(new Audio(loseSound))
  const placeAudio = useRef(new Audio(placeSound))
  const winAudio = useRef(new Audio(winSound))
  const nextAudio = useRef(new Audio(nextSound))

  // board
  const rows = 8
  const cols = 4

  // state
  const colors = ['red', 'orange', 'yellow', 'lightgreen', '#2a52be', '#ff00ed', 'grey', 'white']
  const [selection, setSelection] = useState('red')
  const [holes, setHoles] = useState(Array.from({ length: rows }, () => Array(cols).fill('')))
  const [goal, setGoal] = useState(() => randomGenerator())
  const [pegs, setPegs] = useState(Array.from({ length: rows }, () => Array(cols).fill('')))
  const [level, setLevel] = useState(1)


  // fill color
  function fillColor(i, j) {

    placeAudio.current.play()

    setHoles((prevHoles) => {
      const newHoles = [...prevHoles]
      newHoles[i][j] = selection 
      return newHoles
    })

  }

  // generate random combination
  function randomGenerator() {

    // shuffle then pick
    const uniqueColor = [...colors]
    for (let i = uniqueColor.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueColor[i], uniqueColor[j]] = [uniqueColor[j], uniqueColor[i]]
    }
    return uniqueColor.slice(0, 4)

  }

  // checking matches
  const checkBtn = useRef()
  function check() {

    nextAudio.current.play()

    const guess = holes[8 - level]

    // black
    let black = 0
    for (let i = 0; i < 4; i++) {
      if (guess[i] == goal[i]) {black += 1}
    }

    // white
    let white = 0
    for (let color of guess) {
      if (goal.includes(color)) {white += 1}
    }

    const currentPegs = []
    for (let i = 0; i < black; i++) {currentPegs.push("black")}
    for (let i = 0; i < white - black; i++) {currentPegs.push("white")}
    for (let i = 0; i < 4 - white; i++) {currentPegs.push("")}

    setPegs((prevPegs) => {

      const newPegs = [...prevPegs]
      newPegs[8 - level] = currentPegs
      return newPegs

    })

    // win
    if (currentPegs[3] == "black"){
      
      setTimeout(() => {

        winAudio.current.play()

        party.confetti(checkBtn.current, {
	        count: party.variation.range(0, 100),
	        size: party.variation.range(0.6, 1.4 ),
        })

        setTimeout(() => {
          setGoal(() => randomGenerator())
          setHoles(Array.from({ length: rows }, () => Array(cols).fill('')))
          setPegs(Array.from({ length: rows }, () => Array(cols).fill('')))
          setLevel(1)
        }, 1000)


      }, 1000)
      
      return
    }
    
    setLevel(level + 1)

    // game over
    if (level == 8) {

      loseAudio.current.play()

      setTimeout(() => {
        setGoal(() => randomGenerator())
        setHoles(Array.from({ length: rows }, () => Array(cols).fill('')))
        setPegs(Array.from({ length: rows }, () => Array(cols).fill('')))
        setLevel(1)
      }, 1000)

    }

  }

  // components to renders
  return (
    <div className="board">

      <div className="game">

        <div className="holes">
          {holes.map((row, i) => (
            <div className={i % 2 == 0 ? "holes-row odd" : "holes-row even"} key={i}>
              {row.map((cell, j) => (
                <div 
                  onClick={() => fillColor(i, j)}
                  style={{backgroundColor: cell}}
                  className="hole" 
                  key={j}
                ></div>
              ))}
            </div>
          ))}
        </div>

        <div className="pegs">
          {pegs.map((row, i) => (
            <div className={i % 2 == 0 ? "pegs-row odd" : "pegs-row even"} key={i}>
              {row.map((cell, j) => (
                <div 
                  onClick={() => updateColor(i, j)}
                  style={{backgroundColor: cell}}
                  className="peg" 
                  key={j}
                ></div>
              ))}
            </div>
          ))}

        </div>
        
      </div>

      <div className="selector">

        {colors.map((color) => (
          <div
            key = {color}
            onClick={() => {
              placeAudio.current.play()
              setSelection(color)}
            }
            className={selection == color? "color-box selected" : "color-box"}
            style={{backgroundColor: color}}
          ></div>
        ))}

      </div>

      <div ref={checkBtn} className="check-btn" onClick={() => check()}>BINGO</div>
    </div>
  )

}

export default App