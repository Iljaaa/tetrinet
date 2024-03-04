import {InputHTMLAttributes} from "react";
import styles from './input.module.css'

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {

}

export const Input = (props:CustomInputProps) => {
  return <input {...props} className={styles.FormInput} />
}