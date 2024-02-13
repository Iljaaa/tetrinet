<?php

namespace app\Common;

/**
 * Cup state
 */
enum CupState : string
{
    case online = 'online';
    case over = 'over';
}
