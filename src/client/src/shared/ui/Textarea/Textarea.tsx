import {InputHTMLAttributes} from "react";
import styles from './Textarea.module.css'

interface CustomInputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  rows?:number
}

export const Textarea = (props:CustomInputProps) => {
  return <textarea {...props} className={styles.FormInput} rows={props.rows} />
}