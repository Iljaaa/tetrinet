import React from "react";
import {Button} from "../../shared/ui/Button/Button";
import {MyModal} from "../../shared/ui/MyModal/MyModal";

type Props = {
  onClose: () => void
}

export const ConnectionLostModal = (props:Props) => <MyModal isOpen={true}>
  <div style={{fontSize: "2rem", textAlign: "center"}}>
    The connection<br />to the server<br />was lost.
  </div>
  <div style={{marginTop: '1rem', textAlign: "center", transform: "translateX(-10px)"}}>
    <Button onClick={props.onClose}>Ok</Button>
  </div>
</MyModal>