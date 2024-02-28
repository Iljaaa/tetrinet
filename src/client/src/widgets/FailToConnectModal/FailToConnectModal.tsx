import React from "react";
import { MyModal } from "../../shared/ui/MyModal/MyModal";
import {Button} from "../../shared/ui/Button/Button";

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const FailToConnectModal = (props:Props) => <MyModal isOpen={props.isOpen}>
  <div style={{fontSize: "2rem", textAlign: "center"}}>
    Failed to connect<br />to the server
  </div>
  <div style={{marginTop: '1rem', textAlign: "center", transform: "translateX(-10px)"}}>
    <Button onClick={props.onClose}>Ok</Button>
  </div>
</MyModal>