<?php

namespace App\Common;

enum ResponseType:string
{
    case letsPlay = 'letsPlay';
    case addLine = 'addLine';

    case afterSet = 'afterSet';
    case paused = 'paused';
    case resumed = 'resumed';
}
