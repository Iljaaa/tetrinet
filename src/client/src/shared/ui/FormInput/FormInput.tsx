import React from "react";
import styles from "./FormInput.module.css"

type Props = {
  title: string,
  children: any,
  htmlFor?:string,
  style?: React.CSSProperties;
}

export const FormInput = (props:Props) => {
  return <div style={props.style}>
    <label htmlFor={props.htmlFor}
           className={styles.FormInputLabel}>{props.title}</label>
    <div className={styles.FormInputInput}>{props.children}</div>
  </div>
}