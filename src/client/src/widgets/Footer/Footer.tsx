
import styles from "./footer.module.css"
import {Container} from "../../shared/ui/Container/Container";
import React from "react";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import {FeedbackSuccessModal} from "../FeedbackModal/FeedbackSuccessModal";

type State = {
  showFeedbackModal: boolean,
  variant: 'feedback' | 'issue',
  feedbackSaved: boolean
}

export class Footer extends React.PureComponent<{}, State>
{
  public state:State = {
    showFeedbackModal: false,
    variant: "feedback",
    feedbackSaved: false
  }

  render (){
    return <div className={styles.Footer}>
      <Container style={{margin: "0 auto", padding: "2rem"}} variant={'transparent'}>
        <div style={{display: "flex", padding: "0 1rem"}}>
          <div style={{flex: 1}}>
            <div style={{display: "flex", alignItems: "center"}}>
              <div style={{marginRight: ".5rem"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
                </svg>
              </div>
              <div>
                If you find a problem in the code, text about it&nbsp;
                <span onClick={() => this.setState({showFeedbackModal: true, variant: "issue"})}
                      style={{color: "#ef7f57", cursor: "pointer"}}>here</span>.
              </div>
            </div>

            <div style={{marginTop: ".75rem"}}>
              Feedback form&nbsp;
              <span onClick={() => this.setState({showFeedbackModal: true, variant: "feedback"})}
                    style={{color: "#ef7f57", cursor: "pointer"}}>here</span>.
            </div>

            <div style={{marginTop: ".75rem"}}>
              Or just write by email.
            </div>

          </div>
          <div>v {process.env.REACT_APP_VERSION}</div>
        </div>
      </Container>

      <FeedbackModal isOpen={this.state.showFeedbackModal}
                     onClose={() => this.setState({showFeedbackModal: false})}
                     onFeedbackSaved={() => this.setState({feedbackSaved: true, showFeedbackModal: false})}
                     variant={this.state.variant} />

      {(this.state.feedbackSaved) && <FeedbackSuccessModal onClose={() => this.setState({feedbackSaved: false})} />}
    </div>
  }
}