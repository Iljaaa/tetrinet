import React, {InputHTMLAttributes} from "react";
import styles from './input.module.css'

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?:React.RefObject<HTMLInputElement>,
  isInvalid?: boolean
}

export const Input = (props:CustomInputProps) => {
  return <input {...props}
                className={`${styles.FormInput} ${(props.isInvalid) ? styles.invalid : ''}`}
                ref={props.ref} />
}