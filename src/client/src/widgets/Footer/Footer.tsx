
import styles from "./footer.module.css"
import {Container} from "../../shared/ui/Container/Container";

export const Footer = () => {
  return <div className={styles.Footer}>
    <Container style={{margin: "0 auto"}}>v {process.env.REACT_APP_VERSION}</Container>
  </div>
}