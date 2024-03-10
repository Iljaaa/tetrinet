<?php

namespace App\Common\Types;

enum ResponseType:string
{
    case letsPlay = 'letsPlay';
    case backToParty = 'backToParty';
    case afterSet = 'afterSet';

    case paused = 'paused';
    case resumed = 'resumed';

    /**
     * @deprecated
     */
    case addLine = 'addLine';

    /**
     * Someone use a bonus
     */
    case getBonus = 'getBonus'; // when bonus received

    /**
     * When we send chat to all players
     */
    case chat = 'chat';
}
