
import styles from "./JoinButtons.module.css"

export const JoinButtons = () => {
    return <div className={styles.JoinButtonsWrap}>
        <div>
            <button className={styles.JoinButton}>Find a duel</button>
        </div>
        <div>
            <button className={styles.JoinButton}>Find a deathmatch</button>
        </div>
        <div>
            <button className={styles.JoinButton}>Just play tetris</button>
        </div>
    </div>
}