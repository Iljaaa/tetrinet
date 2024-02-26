
import styles from "./JoinButtons.module.css"
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";

export const JoinButtons = () =>
{


    return <div className={styles.JoinButtonsWrap}>
        <div>
            <button className={styles.JoinButton} onClick={() => {
                TetrinetSingleton.getInstance().joinToParty('duel')
            }}>Find a duel</button>
        </div>
        <div>
            <button className={styles.JoinButton} onClick={() => {
                TetrinetSingleton.getInstance().joinToParty('party')
            }}>Find a deathmatch</button>
        </div>
        <div>
            <button className={styles.JoinButton} onClick={() => {
                TetrinetSingleton.getInstance().justPlayTetris();
            }}>Just play tetris</button>
        </div>
    </div>
}