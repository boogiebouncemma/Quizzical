import React from 'react';

import Question from "./Question.js"
import Answer from "./Answer.js"
import {nanoid} from "nanoid"
import he from "he"


export default function App() {
    
    const [newGame, setNewGame] = React.useState(0)   
    const [responses, setResponses] = React.useState([])   
    const [correctAnswers, setCorrectAnswers] = React.useState(0)    
    const [isChecked, setIsChecked] = React.useState(false)
    
    React.useEffect( () => {
        fetch('https://opentdb.com/api.php?amount=5&difficulty=easy')
            .then((response) => response.json())
            .then((data) => setResponses(data.results.map(question => {
                return ({
                    question: he.decode(question.question),
                    answers: shuffle([{
                        value: he.decode(question.correct_answer),
                        isSelected: false,
                        isCorrect: true,
                        id: nanoid(),
                    }, ...question.incorrect_answers.map(elem => {
                        return {
                        value: he.decode(elem),
                        isSelected: false,
                        isCorrect: false,
                        id: nanoid(),
                    }
                    })])
                })
        })));
    }, [newGame])
    
    function shuffle(array) {
        var m = array.length, t, i;
        // While there remain elements to shuffle…
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }
        
    function startQuiz() {
        setNewGame(prevData => prevData + 1)
        setIsChecked(false)
    }
    
    

    function clickAnswer(id, question) {
        setResponses(oldResponses => oldResponses.map(elem => {
            return elem.question === question ?
                {    
                ...elem,
                answers: elem.answers.map(answ => {
                    return answ.id === id ? 
                        {...answ, isSelected: !answ.isSelected} :
                        {...answ, isSelected: false}
                })} : 
                elem
            
        }))
    }
    
    function checkAnswers() {
        setCorrectAnswers(
            responses.reduce((acc, elem) => acc + elem.answers.reduce((acc,answ) => (answ.isCorrect && answ.isSelected) ? acc + 1 : acc + 0, 0), 0)
        )
        setIsChecked(true)   
    } 
    
    const openingScreen = (
        <div className="openingScreen">
            <h1>Quizzical </h1>
            <span className="openingScreen-description" >You need to anwer 5 questions. <br /> Each question has only 1 correct answer.</span>
            <button className="openingScreen-button" onClick={startQuiz} >Start quiz</button>
        </div>
    ) 
    
    const questionsScreen = (
        <div className="questionsScreen" >
           
            {
                responses.map(elem => (
                    <div key={elem.question}>
                        <Question  question={elem.question} />
                        <div className="answers-container" >
                            {elem.answers.map(answ => 
                                <Answer 
                                    key={answ.id}
                                    answerValue={answ.value}
                                    isSelected={answ.isSelected} 
                                    isCorrect={answ.isCorrect}
                                    isChecked={isChecked}
                                    clickAnswer={()=>clickAnswer(answ.id, elem.question)}
                                />)}
                        </div>
                        <hr />
                    </div>
                    ))
            }
            {
                !isChecked ?
                    <div className="checkAnswers-container">
                        <button className="checkAnswers-button" onClick={checkAnswers} >Check answers </button>
                    </div>
                :
                    <div className="answersChecked-container">
                        <span>You scored {correctAnswers}/{responses.length} correct answers</span>
                        <button className="checkAnswers-button" onClick={startQuiz} >Play again</button>
                    </div>
            }
            
        </div>
    )
    
    return (
        <main>

            {newGame === 0 ? openingScreen : questionsScreen}
        </main>
    )
}
