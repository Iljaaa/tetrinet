import {InputHTMLAttributes} from "react";
import styles from './Textarea.module.css'

interface CustomInputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  rows?:number
  isInvalid?: boolean
}

export const Textarea = (props:CustomInputProps) => {
  return <textarea {...props} className={`${styles.FormInput} ${(props.isInvalid) ? styles.invalid : ''}`} rows={props.rows} />
}