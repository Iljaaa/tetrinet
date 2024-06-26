<?php

namespace Domain\Game\Enums;

/**
 * Cup state
 */
enum CupState : string
{
    case online = 'online';
    case over = 'over';
    case winner = 'winner';
}
