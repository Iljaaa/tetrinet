<?php

namespace App\Common\Types;

/**
 * Cup state
 */
enum CupState : string
{
    case online = 'online';
    case over = 'over';
    case winner = 'winner';
}
