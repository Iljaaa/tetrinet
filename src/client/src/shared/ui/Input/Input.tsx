import React, {InputHTMLAttributes} from "react";
import styles from './input.module.css'

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?:React.RefObject<HTMLInputElement>
}

export const Input = (props:CustomInputProps) => {
  return <input {...props} className={styles.FormInput} ref={props.ref} />
}