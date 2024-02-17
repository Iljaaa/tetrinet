<?php

namespace App\Common\Types;

enum BonusType:int
{
    case add = 0; // a : Add Line - Adds a line of garbage
    case clear = 1; // c : Clear Line - Clears a line from the bottom of the field.
    case clearSpecials = 2; // b : Clear Special Blocks - Transforms all special blocks into regular blocks.
    case randomClear = 3;  //  r : Random Blocks Clear - Randomly clears blocks, often making a messier field
    case blockBomb = 4; // o : Block Bomb - Only has an effect if the target's field has a Block Bomb special on it. Causes any blocks within a 3x3 radius of those specials to be scattered around their field.
    case blockQuake = 5; // q : Blockquake - Shifts the blocks on each row, often making a messier field and giving an earthquake effect.
    case gravity = 6; // g : Block Gravity - Causes all blocks to pull down to the bottom of the field, and will remove any lines cleared as a result.
    case switch = 7; //case s : Switch Fields - Switches your field with the target's field.
    case nuke = 8; //  n : Nuke Field - Clears the entire field.
    //case i : Immunity - Makes the target immune from being targetted by specials for X amount of seconds. Default = 15 seconds
    // case v : Clear Column - Clears a random column.
    // case m : Mutate Pieces - Makes the target's X next pieces large and odd shaped, often forcing the target to make a messier field. Default = 3 next pieces
    case darkness = 9; //  d : Darkness - Turns the target's field black, hiding it from their view except for their current piece and a small window around it for X seconds. Default = 10 seconds
    // case f : Confusion - Randomly switches the target's controls for X seconds. Default = 10 seconds
}
