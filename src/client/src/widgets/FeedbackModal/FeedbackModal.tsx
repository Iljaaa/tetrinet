import React from "react";
import { MyModal } from "../../shared/ui/MyModal/MyModal";
import {Button} from "../../shared/ui/Button/Button";
import {Input} from "../../shared/ui/Input/Input";
import {FormInput} from "../../shared/ui/FormInput/FormInput";
import {Textarea} from "../../shared/ui/Textarea/Textarea";
import {ButtonWithLoader} from "../../shared/ui/Button/ButtonWithLoader";

type Props = {
  isOpen: boolean
  onClose: () => void,
  variant: 'feedback' | 'issue',
}

type State = {
  isLoading: boolean,
}

export class FeedbackModal extends React.PureComponent<Props, State>
{
  public state:State = {
    isLoading: false
  }

  onSubmit = () => {
    this.setState({isLoading: !this.state.isLoading})
  }

  render (){
    return <MyModal isOpen={true}>
      <div style={{fontSize: "2rem", width: "500px"}}>
        {(this.props.variant === 'issue') ? 'Issue report' : 'Feedback'}
      </div>
      <FormInput title="Please introduce yourself"
                 htmlFor="introduceYourSelf"
                 style={{marginTop: '1rem'}}>
        <Input value={"asdsad"}
               id="introduceYourSelf"
               disabled={this.state.isLoading}  />
      </FormInput>
      <FormInput title="Leave your contact email"
                 htmlFor="feedbackEmail"
                 style={{marginTop: '.5rem'}}>
        <Input value={"asdsad"}
               id="feedbackEmail"
               disabled={this.state.isLoading} />
      </FormInput>
      <FormInput title={(this.props.variant === 'issue') ? 'Please describe the problem in detail' : 'Your message'}
                 htmlFor="feedbackMessage"
                 style={{marginTop: '.5rem'}}>
        <Textarea rows={10}
                  id="feedbackMessage"
                  disabled={this.state.isLoading}>asdd</Textarea>
      </FormInput>
      <div style={{marginTop: '1rem', textAlign: "right", transform: "translateX(-10px)"}}>
        <ButtonWithLoader onClick={this.onSubmit}
                          isLoading={this.state.isLoading}
                          style={{marginRight: '1.5rem'}}>Ok</ButtonWithLoader>
        <Button onClick={this.props.onClose}
                disabled={this.state.isLoading}>Cancel</Button>
      </div>
    </MyModal>
  }
}
