<?php

namespace Domain\Game\Enums;

/**
 * Player state
 */
enum PlayerState:string
{
    case online = 'online';
    case offline = 'offline'; // when connection is lost, or player leave a game
}
