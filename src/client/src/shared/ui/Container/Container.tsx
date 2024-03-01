import React from "react";
import styles from "./contaner.module.css"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
  variant?: 'green' | 'gray' | 'orange',
}

export const Container = (props:Props) =>
{
  let cl = ''
  if (props.variant === 'gray') cl = styles.gray
  if (props.variant === 'orange') cl = styles.orange

  return <div className={`${styles.Container} ${cl} ${props.className}`}>{props.children}</div>
}