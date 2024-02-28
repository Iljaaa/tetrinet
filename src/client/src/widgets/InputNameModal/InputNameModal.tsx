import React, {useState} from "react";
import {Button} from "../../shared/ui/Button/Button";
import {MyModal} from "../../shared/ui/MyModal/MyModal";

type Props = {
  isOpen: boolean
  onSubmit: () => void
  onCancel: () => void
}

export const InputNameModal = (props:Props) => {
  const [name, setName] = useState('');
  return <MyModal isOpen={props.isOpen}>
    <div style={{fontSize: "2rem", textAlign: "center"}}>Enter your name</div>
    <div style={{margin: "2rem 0", display: "flex", justifyContent: "center"}}>
      <input type="text"
             style={{width: "250px", fontSize: "2rem", textAlign: "center", padding: ".5rem"}}
             maxLength={100}
             value={name}
             onChange={(event:React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}></input>
    </div>

    <div style={{marginTop: '1rem', textAlign: "center", transform: "translateX(-10px)"}}>
      <Button onClick={props.onSubmit} style={{marginRight: "1.5rem"}}>Ok</Button>
      <Button onClick={props.onCancel}>Cancel</Button>
    </div>
  </MyModal>
}