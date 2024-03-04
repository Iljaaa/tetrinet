import React from "react"
import {Button, ButtonProps} from "./Button";

interface Props extends ButtonProps {
  isLoading: boolean
}

export const ButtonWithLoader = (props: Props) => {
  return <Button {...props} style={{...props.style, minWidth: "150px"}} disabled={props.disabled || props.isLoading}>
    {(props.isLoading) ? <Loader /> : props.children}
  </Button>
}

const Loader = () => <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 8">
  <circle cx="4" cy="4" r="3" fill="currentColor">
    <animate id="svgSpinners3DotsFade0" fill="freeze" attributeName="opacity"
             begin="0;svgSpinners3DotsFade1.end-0.25s" dur="0.75s" values="1;0.2"/>
  </circle>
  <circle cx="12" cy="4" r="3" fill="currentColor" opacity="0.4">
    <animate fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.15s" dur="0.75s"
             values="1;0.2"/>
  </circle>
  <circle cx="20" cy="4" r="3" fill="currentColor" opacity="0.3">
    <animate id="svgSpinners3DotsFade1" fill="freeze" attributeName="opacity"
             begin="svgSpinners3DotsFade0.begin+0.3s" dur="0.75s" values="1;0.2"/>
  </circle>
</svg>