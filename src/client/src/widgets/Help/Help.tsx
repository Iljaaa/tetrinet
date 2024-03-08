import React from "react";

import styles from "./Help.module.css"
import {Container} from "../../shared/ui/Container/Container";

import img from "../../sprite.png"

export const Help = () => {
    return <Container variant={'orange'}>
        <div style={{padding: '0 2rem'}}>
            <h2>Help</h2>
            <div className={styles.Help}>
                <div className={styles.ControlsColl}>
                    <div className={styles.Title}>Controls:</div>
                    <b>A</b> - left<br/>
                    <b>D</b> - right<br/>
                    <b>E</b> - rotate clockwise<br/>
                    <b>Q</b> - rotate counterclockwise<br/>
                    <b>S</b> - down<br/>
                    <b>Space</b> - drop<br/>
                    <b>`</b> - apply the bonus to yourself<br/>
                    <b>1-5</b> - apply bonus to opponent<br/>
                    <b>P</b> - pause<br/>
                </div>
                <div>
                    <div className={styles.Title}>Bonus fields:</div>
                    <BlockBlock delta={0}>Add Line - Adds a line to the bottom of the field.</BlockBlock>
                    <BlockBlock delta={32}>Clear Line - Clears a line from the bottom of the field.</BlockBlock>
                    <BlockBlock delta={64}>Clear Special Blocks - Transforms all special blocks into regular blocks.</BlockBlock>
                    <BlockBlock delta={96}>Random Blocks Clear - Randomly clears blocks, often making a messier field</BlockBlock>
                    <BlockBlock delta={128}>Block Bomb - Only has an effect if the target's field has a Block Bomb special on it.Causes
                        any blocks within radius of those specials to be scattered around their field.</BlockBlock>
                    <BlockBlock delta={160}>Blockquake - Shifts the blocks on each row, often making a messier field and giving an
                        earthquake effect.</BlockBlock>
                    <BlockBlock delta={192}>Block Gravity - Causes all blocks to pull down to the bottom of the field, and will
                        remove any lines cleared as a result</BlockBlock>
                    <BlockBlock delta={224}>Switch Fields - Switches your field with the target's field.</BlockBlock>
                    <BlockBlock delta={256}>Nuke Field - Clears the entire field.</BlockBlock>

                    {/*<div style={{textDecoration: "line-through"}}>*/}
                    {/*    <b>i</b> - Immunity - Makes the target immune from being targetted by specials for X amount of*/}
                    {/*    seconds.*/}
                    {/*    Default = 15 seconds<br/>*/}
                    {/*</div>*/}
                    {/*<div style={{textDecoration: "line-through"}}>*/}
                    {/*    <b>v</b> - Clear Column - Clears a random column.*/}
                    {/*</div>*/}
                    {/*<div style={{textDecoration: "line-through"}}>*/}
                    {/*    <b>m</b> - Mutate Pieces - Makes the target's X next pieces large and odd shaped, often forcing*/}
                    {/*    the*/}
                    {/*    target to make a messier field. Default = 3 next pieces*/}
                    {/*</div>*/}
                    {/*<div style={{textDecoration: "line-through"}}>*/}
                    {/*    <b>d</b> - Darkness - Turns the target's field black, hiding it from their view except for their*/}
                    {/*    current*/}
                    {/*    piece and a small window around it for X seconds. Default = 10 seconds*/}
                    {/*</div>*/}
                    {/*<div style={{textDecoration: "line-through"}}>*/}
                    {/*    <b>f</b>- Confusion - Randomly switches the target's controls for X seconds. Default = 10*/}
                    {/*    seconds*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    </Container>
}

type BlockBlock = {
    delta: number
    children: string
}

const BlockBlock = (props:BlockBlock) => <div className={styles.BlockBlock}>
    <div className={styles.BlockIcon}
         style={{backgroundImage: `url(${img})`, backgroundPosition: `${320 - props.delta}px 510px`}}></div>
    <div>{props.children}</div>
</div>