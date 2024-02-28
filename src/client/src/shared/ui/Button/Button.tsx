import React from "react"
import styles from "./button.module.css"

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children: any,
  onClick?: () => void
}

export const Button = (props:Props) => {
  return <button className={styles.JoinButton}
                 style={props.style}
                 onClick={() => { if(props.onClick) props.onClick()}}>{props.children}</button>
}