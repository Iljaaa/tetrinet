import React from "react";
import styles from "./contaner.module.css"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
  variant?: 'green' | 'gray' | 'orange' | 'transparent',
}

export const Container = (props:Props) =>
{
  let cl = 'green'
  if (props.variant === 'gray') cl = styles.gray
  if (props.variant === 'orange') cl = styles.orange
  if (props.variant === 'transparent') cl = styles.transparent

  return <div className={`${styles.Container} ${cl} ${props.className ? props.className : ''}`} style={props.style}>{props.children}</div>
}