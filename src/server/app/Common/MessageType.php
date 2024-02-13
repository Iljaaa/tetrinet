<?php

namespace App\Common;

/**
 * Type messages received from client
 */
enum MessageType:string
{
    case start = 'start';
    case join = 'join';
    case set = 'set'; // this is when cup updated
    case pause = 'pause';
    case resume = 'resume';
    case addLine = 'addLine';
}
