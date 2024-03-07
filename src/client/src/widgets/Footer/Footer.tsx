
import styles from "./footer.module.css"
import {Container} from "../../shared/ui/Container/Container";

export const Footer = () => {
  return <div className={styles.Footer}>
    <Container style={{margin: "0 auto"}} variant={'transparent'}>
      <div style={{display: "flex"}}>
        <div style={{flex: 1}}></div>
        <div>v {process.env.REACT_APP_VERSION}</div>
      </div>

    </Container>
  </div>
}