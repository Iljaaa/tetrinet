import React from "react";

import styles from "./Help.module.css"

export const Help = () => {
    return <div className={styles.Help}>
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
            <b>a</b> - Add Line - Adds a line of garbage.<br/>
            <b>c</b> - Clear Line - Clears a line from the bottom of the field.<br/>
            <b>b</b> - Clear Special Blocks - Transforms all special blocks into regular blocks.<br/>
            <b>r</b> - Random Blocks Clear - Randomly clears blocks, often making a messier field<br/>
            <b>o</b> - Block Bomb - Only has an effect if the target's field has a Block Bomb special on it.Causes any blocks within a 3x3 radius of those specials to be scattered around their field
            <b>q</b> - Blockquake - Shifts the blocks on each row, often making a messier field and giving an earthquake effect.<br/>
            <b>g</b> - Block Gravity - Causes all blocks to pull down to the bottom of the field, and will remove any lines cleared as a result.<br/>
            <b>s</b> - Switch Fields - Switches your field with the target's field.<br/>
            <b>n</b> - Nuke Field - Clears the entire field.<br/>
            // <b>i</b> - Immunity - Makes the target immune from being targetted by specials for X amount of seconds. Default = 15 seconds<br/>
            // <b>v</b> - Clear Column - Clears a random column.<br/>
            // <b>m</b> - Mutate Pieces - Makes the target's X next pieces large and odd shaped, often forcing the
            target to make a messier field. Default = 3 next pieces<br/>
            // <b>d</b> - Darkness - Turns the target's field black, hiding it from their view except for their current
            piece and a small window around it for X seconds. Default = 10 seconds<br/>
            // <b>f</b>- Confusion - Randomly switches the target's controls for X seconds. Default = 10 seconds
        </div>

    </div>
}