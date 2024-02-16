/**
 * todo: extends bonuses
 */
export enum Bonus {
    add = 0, // a : Add Line - Adds a line of garbage
    clear = 1, // c : Clear Line - Clears a line from the bottom of the field.
    clearSpecials = 2, // b : Clear Special Blocks - Transforms all special blocks into regular blocks.
    randomClear = 3,  //  r : Random Blocks Clear - Randomly clears blocks, often making a messier field
    blockBomb = 4, // o : Block Bomb - Only has an effect if the target's field has a Block Bomb special on it. Causes any blocks within a 3x3 radius of those specials to be scattered around their field.
    blockQuake = 5, // q : Blockquake - Shifts the blocks on each row, often making a messier field and giving an earthquake effect.
    gravity = 6, // g : Block Gravity - Causes all blocks to pull down to the bottom of the field, and will remove any lines cleared as a result.
    switch = 7, //case s : Switch Fields - Switches your field with the target's field.
    nuke = 8, //  n : Nuke Field - Clears the entire field.
    // i : Immunity - Makes the target immune from being targetted by specials for X amount of seconds. Default = 15 seconds
    // v : Clear Column - Clears a random column.
    // m : Mutate Pieces - Makes the target's X next pieces large and odd shaped, often forcing the target to make a messier field. Default = 3 next pieces
    darkness = 9, //  d : Darkness - Turns the target's field black, hiding it from their view except for their current piece and a small window around it for X seconds. Default = 10 seconds
    //  f : Confusion - Randomly switches the target's controls for X seconds. Default = 10 seconds
}