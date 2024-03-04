import React from "react"
import styles from "./button.module.css"

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children: any,
  onClick?: () => void
  disabled?: boolean
}

export const Button = (props:ButtonProps) => {
  return <button className={styles.JoinButton}
                 style={props.style}
                 onClick={() => { if(props.onClick) props.onClick()}}
                 disabled={props.disabled}>{props.children}</button>
}