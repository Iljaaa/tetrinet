import Modal from "react-modal";
import React from "react";

type Props = {
  isOpen: boolean
  customStyles: object
  message:string
  cancel: () => void
}

export const BackToPartyIsFail = (props:Props) => <Modal
  isOpen={props.isOpen}
  style={props.customStyles}
  onRequestClose={() => {
    alert ('Modal request close')
  }}
  contentLabel="Example Modal"
>
  <div style={{color: "black"}}>{props.message}</div>
  <div>
    <button onClick={props.cancel}>Ok</button>
  </div>
</Modal>