
import styles from "./JoinButtons.module.css"
import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {Button} from "../../shared/ui/Button/Button";

export const JoinButtons = () =>
{


    return <div className={styles.JoinButtonsWrap}>
        <div>
            <Button onClick={() => {
                TetrinetSingleton.getInstance().joinToParty('duel')
            }}>Find a duel</Button>
        </div>
        <div>
            <Button onClick={() => {
                TetrinetSingleton.getInstance().joinToParty('party')
            }}>Find a deathmatch</Button>
        </div>
        <div>
            <Button onClick={() => {
                TetrinetSingleton.getInstance().justPlayTetris();
            }}>Just play tetris</Button>
        </div>
    </div>
}