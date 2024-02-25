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

    case getBonus = 'getBonus'; // when bonus received
}
