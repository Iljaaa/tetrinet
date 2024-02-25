import Modal from "react-modal";
import React from "react";

type Props = {
  isOpen: boolean
  customStyles: object
  submit: () => void
  cancel: () => void
}

export const BackModal = (props:Props) => <Modal
  isOpen={props.isOpen}
  style={props.customStyles}
  onRequestClose={() => {
    console.log ('Modal request close')
  }}
  contentLabel="Example Modal"
>
  <div style={{color: "black"}}>We found not finished game in your store.</div>
  <div style={{color: "black"}}>Do you want to back to this game?</div>
  <div>
    <button onClick={props.submit}>Yes</button>
    <button onClick={props.cancel}>No</button>
  </div>
</Modal>