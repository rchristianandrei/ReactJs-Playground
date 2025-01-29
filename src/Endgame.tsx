import { useEffect, useRef, useState } from "react";
import LanguageCard from "./LanguageCard";
import Letter from "./Letter";
import Alphabet from "./Alphabet";

export default function Endgame(){

    enum State{
        Start,
        Playing,
        Over
    }

    const shouldEvaluate = useRef(false)
    const deadLanguages = useRef(0)
    const prevRevealed = useRef(0)
    const isCorrect = useRef(false)
    const isWin = useRef(false)

    const [state, setState] = useState(State.Start)

    useEffect(() => {
        if(state === State.Start){
            NewGame()
        }
    }, [state])

    const words = [
        "computer", "keyboard", "elephant", "software", "mountain",
        "football", "lightning", "backspace", "umbrella", "document"
    ];

    const [languages, setLanguages] = useState([
        {language: "HTML", backgroundColor: "orange", darkMode: true, isDead: false},
        {language: "CSS", backgroundColor: "aqua", darkMode: true, isDead: false},
        {language: "JavaScript", backgroundColor: "#ece90d", darkMode: true, isDead: false},
        {language: "React", backgroundColor: "#0decd9", darkMode: true, isDead: false},
        {language: "TypeScript", backgroundColor: "#031e96", darkMode: false, isDead: false},
        {language: "Node js", backgroundColor: "#06bd43", darkMode: false, isDead: false},
        {language: "Python", backgroundColor: "#aa8c08", darkMode: false, isDead: false},
        {language: "Ruby", backgroundColor: "#c70b14", darkMode: false, isDead: false},
        {language: "Assembly", backgroundColor: "blue", darkMode: false, isDead: false},
    ])

    useEffect(() => {
        if(deadLanguages.current > guessedLetters.length){
            isWin.current = false
            setState(State.Over)
            return
        }
    }, [languages])

    const [guessedLetters, setGuessedLetters] = useState<{letter: string, isRevealed: boolean}[]>([])

    useEffect(() => {
        if (state !== State.Playing){
            setState(State.Playing)
            return
        }

        if(!shouldEvaluate.current) return
        shouldEvaluate.current = false

        // Evaluate winning or losing condition
        let isSame = true
        for(let i = 0; i < guessedLetters.length; i++){
            if(guessedLetters[i].isRevealed) continue
            isSame =false
            break
        }

        if(isSame){
            isWin.current = true
            setState(State.Over)
            return
        }

        if(isCorrect.current) return

        const temp = [...languages]
        temp[deadLanguages.current].isDead = true
        deadLanguages.current += 1

        setLanguages(l => l = temp)
        
    }, [guessedLetters])

    const [choices, setChoices] = useState(Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(value => (
        {alphabet: value, isChosen: false}
    )))

    useEffect(() => {
        if(state !== State.Playing) return

        let temp: string[] = []

        for(let i = 0; i < choices.length; i++){
            if(!choices[i].isChosen) continue
            temp.push(choices[i].alphabet)
        }

        let currentRevealed = 0

        for(let i = 0; i < guessedLetters.length; i++){
            if(temp.includes(guessedLetters[i].letter)){
                currentRevealed++
            }
        }

        setGuessedLetters(l => l.map(value => !temp.includes(value.letter) ? {...value} : {...value, isRevealed: true}))

        isCorrect.current = prevRevealed.current < currentRevealed
        prevRevealed.current = currentRevealed
    }, [choices])

    // New Game!
    function NewGame(){
        deadLanguages.current = 0

        const word = words[Math.floor(Math.random() * words.length)].toUpperCase()
        const letters = word.split("")
        setGuessedLetters(letters.map(value => ({letter: value, isRevealed: false})))
        setLanguages(l => l.map(value => ({...value, isDead: false})))
        setChoices(c => c.map(value => ({...value, isChosen: false})))
    }

    // Callbacks
    function selectChoice(index: number){
        if(state !== State.Playing) return

        if(choices[index].isChosen) return;
        shouldEvaluate.current = true
        setChoices(c => c.map((value, i) => i !== index ? {...value} : {...value, isChosen: !value.isChosen}))
    }

    function handleNewGame(){
        setState(State.Start)
    }

    const languageElements = languages.map((value, index) =>
        <LanguageCard 
            key={index} 
            language={value.language} 
            backgroundColor={value.backgroundColor}
            darkMode={value.darkMode}
            isDead={value.isDead}></LanguageCard>
    )

    const wordField = guessedLetters.map((value, index) =>
        <Letter key={index} letter={value.letter} isRevealed={value.isRevealed}></Letter>
    )

    const alphabet = choices.map((value, index) =>
        <Alphabet key={index} index={index} letter={value.alphabet} isChosen={value.isChosen} onClick={selectChoice}></Alphabet>
    )

    return (
        <>
        <h1 className="header">Assembly: Endgame</h1>
        <p className="instructions">Guess the word in under 8 attempts to keep the programming world safe from Assembly</p>

        <div className="result">
            {state === State.Over && (isWin.current ? 
            <div className="win">
                <h2>You Won!</h2>
                <p>Well Done! 🎉</p>
            </div> : 
            <div className="lose">
                <h2>You Lose!</h2>
                <p>Better Luck Next Time 🥲</p>
            </div>
            )}
        </div>
        
        <div className="programming">
            {languageElements}
        </div>
        <div className="word">
            {wordField}
        </div>
        <div className="letters">
            {alphabet}
        </div>
        {state === State.Over && <button onClick={handleNewGame} className="button">New Game</button>}
        </>
    )
}
