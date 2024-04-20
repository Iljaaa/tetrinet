import React from "react";
import Modal from "react-modal";

type Props = {
  isOpen: boolean
  children: any
}

export const MyModal = (props:Props) => {
  return <Modal
    isOpen={props.isOpen}
    style={{
      content: {
        top: '35%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#008080",
        padding: "2rem 2rem 2rem 2rem",
        boxShadow: "rgb(218 165 32 / 38%) 15px 15px 0px 0px"
      }
    }}
    onRequestClose={() => {
      console.info ('Modal request close')
    }}>
    {props.children}
  </Modal>
}