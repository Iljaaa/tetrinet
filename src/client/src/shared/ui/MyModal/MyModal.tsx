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
        padding: "1rem 2rem 2rem 2rem"
      },
    }}
    onRequestClose={() => {
      console.log ('Modal request close')
    }}>
    {props.children}
  </Modal>
}