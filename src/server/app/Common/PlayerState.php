<?php

namespace App\Common;

/**
 * Player state
 */
enum PlayerState:string
{
    case online = 'online';
    case dead = 'dead'; // when connection is lost
}
