import {TetrinetSingleton} from "../../Common/TetrinetSingleton";
import {Button} from "../../shared/ui/Button/Button";
import {Container} from "../../shared/ui/Container/Container";
import {PureComponent} from "react";
import {GameState} from "../../Common/Tetrinet/types";

import styles from "./JoinButtons.module.css"
import Modal from "react-modal";

type State = {
    gameState: GameState,
}

export class JoinButtons extends PureComponent<{}, State>
{

    public state:State = {
        gameState: GameState.waiting,
    }

    componentDidMount()
    {
        TetrinetSingleton.getInstance().setOnGameStateChangeForButtons((newGameState:GameState) => {
            this.setState({gameState: newGameState})
        })
    }

    render (){
        return <>
            <Container>
                <div className={styles.ButtonsWrap}>
                    {(this.state.gameState === GameState.waiting) && <SearchGameButtons />}
                    {(this.state.gameState === GameState.searching) && <LookingForAGame />}
                    {(this.state.gameState === GameState.running
                      || this.state.gameState === GameState.paused) && <GameInProgress />}
                    {(this.state.gameState === GameState.over) && <GameOver />}
                </div>
            </Container>

        </>
    }


}

const SearchGameButtons = () =>
{
    return <div className={styles.SearchButtonsWrap}>
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

const LookingForAGame = () => {
    return <div className={styles.LookingForAGame}>
        <h1 style={{flex: 1}}>Looking for game...</h1>
        <div>
            <Button onClick={() => {
                TetrinetSingleton.getInstance().cancelSearch();
            }}>Cancel</Button>
        </div>
    </div>
}

const GameInProgress = () =>
{
    const f = () => {
        if (window.confirm('Quit game?')) {
            TetrinetSingleton.getInstance().quitGame();
        }
    }

    return <div className={styles.LookingForAGame}>
        <h1 style={{flex: 1}}>You are playing</h1>
        <div>
            <Button onClick={f}>Quit game</Button>
        </div>
    </div>
}

const GameOver = () => {
    return <div className={styles.LookingForAGame}>
        <h1 style={{flex: 1}}>The game is over</h1>
        <div>
            <Button onClick={() => {
                TetrinetSingleton.getInstance().cancelSearch();
            }}>Back to serch</Button>
        </div>
    </div>
}