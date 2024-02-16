<?php

namespace App\Common;

enum ResponseType:string
{
    case letsPlay = 'letsPlay';

    case afterSet = 'afterSet';
    case paused = 'paused';
    case resumed = 'resumed';
    case addLine = 'addLine';
    case getBonus = 'getBonus'; // when bonus received
}
