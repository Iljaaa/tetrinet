<?php

namespace App\Common;

/**
 * Player state
 */
enum PlayerState:string
{
    case online = 'online';
    case offline = 'offline'; // when connection is lost
}
