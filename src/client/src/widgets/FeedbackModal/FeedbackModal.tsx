import React from "react";
import { MyModal } from "../../shared/ui/MyModal/MyModal";
import {Button} from "../../shared/ui/Button/Button";
import {Input} from "../../shared/ui/Input/Input";
import {FormInput} from "../../shared/ui/FormInput/FormInput";
import {Textarea} from "../../shared/ui/Textarea/Textarea";
import {ButtonWithLoader} from "../../shared/ui/Button/ButtonWithLoader";
import {Feedback} from "../../entities/api/Feedback";
import {ValidateFeedback} from "../../process/validation/ValidateFeedback";

type Props = {
  isOpen: boolean
  onClose: () => void,
  variant: 'feedback' | 'issue',
  onFeedbackSaved: () => void
}

type State = {
  isLoading: boolean,
  name: string,
  email: string,
  message: string,
  validated: boolean
}

class FeedbackModal extends React.PureComponent<Props, State>
{
  public state:State = {
    isLoading: false,
    name: "",
    email: "",
    message: "",
    validated: false
  }

  getData () {
    return {
      name: this.state.name,
      email: this.state.email,
      message: this.state.message,
      variant: this.props.variant
    }
  }

  onSubmit = () =>
  {
    this.setState({validated: true})

    const data = this.getData()
    const v = ValidateFeedback(data, true)
    if (!v.isValid) return

    Feedback(data, this.onSuccess, this.onError)
  }

  onSuccess = () =>
  {
    this.setState({
      isLoading: false,
      name: '',
      email: '',
      message: '',
    })

    this.props.onFeedbackSaved()
  }

  onError = (error:string) => {
    alert ('We do not save your feedback, because: ' + error)
  }

  render ()
  {

    const v = ValidateFeedback(this.getData(), this.state.validated)

    return <MyModal isOpen={this.props.isOpen}>
      <div style={{fontSize: "2rem", width: "500px"}}>
        {(this.props.variant === 'issue') ? 'Issue report' : 'Feedback'}
      </div>
      <FormInput title="Please introduce yourself"
                 htmlFor="introduceYourSelf"
                 style={{marginTop: '1rem'}}>
        <Input value={this.state.name}
               id="introduceYourSelf"
               maxLength={100}
               disabled={this.state.isLoading}
               isInvalid={v.errors.name !== ''}
               onChange={(event:React.ChangeEvent<HTMLInputElement>) => this.setState({name: event.target.value})} />
      </FormInput>

      <div style={{marginTop: "2rem"}}>
        <FormInput title="Leave your contact email"
                   htmlFor="feedbackEmail"
                   style={{marginTop: '.5rem'}}>
          <Input value={this.state.email}
                 id="feedbackEmail"
                 maxLength={100}
                 disabled={this.state.isLoading}
                 isInvalid={v.errors.email !== ''}
                 onChange={(event:React.ChangeEvent<HTMLInputElement>) => this.setState({email: event.target.value})}/>
        </FormInput>
      </div>
      <div style={{marginTop: "2rem"}}>
        <FormInput title={(this.props.variant === 'issue') ? 'Please describe the problem in detail' : 'Your message'}
                   htmlFor="feedbackMessage"
                   style={{marginTop: '.5rem'}}>
          <Textarea rows={10}
                    id="feedbackMessage"
                    maxLength={1024}
                    disabled={this.state.isLoading}
                    isInvalid={v.errors.message !== ''}
                    onChange={(event:React.ChangeEvent<HTMLTextAreaElement>) => this.setState({message: event.target.value})}>{this.state.message}</Textarea>
        </FormInput>
      </div>
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

export default FeedbackModal