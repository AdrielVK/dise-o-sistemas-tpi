import React from "react";
import './Button.css'

type ButtonTypes = "submit" | "button" | "reset" | undefined;

interface ButtonProps{
    text:string,
    disable_option?:boolean,
    type?: ButtonTypes,
    onClickAction?: React.MouseEventHandler<HTMLButtonElement>| undefined;
}


const Button: React.FC<ButtonProps> = ({type,text, onClickAction, disable_option}) => (
    <button
        type={type}
        onClick={onClickAction}            
        className={`btn ${ disable_option ? 'bk-grey':'bk-blue'}`}
    >
        {text}
    </button>
)


export default Button;