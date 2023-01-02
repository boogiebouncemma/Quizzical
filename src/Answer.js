import React from "react"

export default function App(props) {
    function changeColor() {
        if (!props.isChecked && props.isSelected) {
            return ("trivia-answer-selected")
        } else if(props.isChecked && props.isSelected && props.isCorrect) {
            return ("trivia-answer-correct")
        } else if(props.isChecked && !props.isSelected && props.isCorrect) {
            return ("trivia-answer-notselected-correct")
        } else if(props.isChecked && props.isSelected && !props.isCorrect){
            return ("trivia-answer-incorrect")
        } else if (props.isChecked && !props.isSelected) {
            return ("trivia-answer-notselected")
        }
    }

    return (
        <button type="button" className={"trivia-answer " +changeColor()} onClick={props.clickAnswer} >
            {props.answerValue}
        </button>
    )
}

