import React from "react";
import {Container} from "../../shared/ui/Container/Container";

import styles from "./Header.module.css"
import {PlayerNameHelper} from "../../Common/heplers/PlayerNameHelper";

type State =
{
  /**
   * Display player name
   */
  playerName: string
}

export class Header extends React.PureComponent<{}, State> {

  public state:State = {
    playerName: ''
  }

  constructor(props: {}, context: any) {
    super(props, context);

    // write listener to change
    PlayerNameHelper.setPlayerNameChangeListener(this.onPlayerNameChange)
  }

  onPlayerNameChange = (newPlayerName: string): void => {
    this.setState({playerName: newPlayerName})
  }

  render () {
    return <Container variant={'transparent'} style={{padding: 0}}>
      <div className={styles.HeaderWrapper}>
        <div className={styles.AppHeader}><Logo/></div>
        <UserBlock/>
      </div>
    </Container>
  }
}


const UserBlock = () => {
  return <div className={styles.UserBlock}>
    <div className={styles.UserName}>
      <div style={{width: "24px", height: "24px", marginRight: ".3rem"}}><UserIcon /></div>
      <div>{PlayerNameHelper.getPlayerName()}</div>
    </div>
    <div className={styles.UserNameEditBlock}>
      <div onClick={() => PlayerNameHelper.editPlayerName()}>edit</div>
    </div>
  </div>
}

const Logo = () => {
  return <svg width="268" height="60" viewBox="0 0 615 138" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/*<svg width="615" height="138" viewBox="0 0 615 138" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
    <path d="M344.5 40H373L410 89.5V0H439V138H414.5L372 81.5V138H344.5V40Z" fill="url(#paint0_linear_3_22)"/>
    <path d="M450 0H615V32H450V0Z" fill="url(#paint1_linear_3_22)"/>
    <rect x="308" width="27" height="138" fill="#538708"/>
    <path d="M158 0H293V32H158V0Z" fill="#C55F04"/>
    <path
      d="M86 40H271C307 40.5 308 104.5 271 104.5C297 138 297 138 297 138H269.5C269.5 138 244.5 103.5 239 97C237 88.5 242 83 245.5 83C252.5 83 263.5 83 269 83C274.5 83 276 76 276 72.5C276 69 274.688 62 269 62C264.5 62 209.5 62 209.5 62V138H189L187.5 62H111V79H150.5V98.5H111V115.5H152.5V138H86V40Z"
      fill="black"/>
    <path d="M0 0H147.5V32H76.5V138H44V32H0V0Z" fill="#CF100B"/>
    <path d="M450 40H614L604 61.5H572.5V138H551.5V61.5H473V80.5H514.5V98H473V115.5H517V138H450V40Z"
          fill="black"/>
    <defs>
      <linearGradient id="paint0_linear_3_22" x1="387.5" y1="12" x2="357.5" y2="131.5"
                      gradientUnits="userSpaceOnUse">
        <stop offset="0.551394" stopColor="#0248D6"/>
        <stop offset="1" stopColor="#7AA981"/>
      </linearGradient>
      <linearGradient id="paint1_linear_3_22" x1="613.5" y1="15.5" x2="451" y2="16"
                      gradientUnits="userSpaceOnUse">
        <stop stopColor="#B8075A"/>
        <stop offset="1" stopColor="#A70D6F"/>
      </linearGradient>
    </defs>
  </svg>
}

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
</svg>