<?php

namespace App\Common\Types;

/**
 * Type messages received from client
 */
enum MessageType:string
{

    case join = 'join'; // add to search game pool
    case back = 'back';
    case leave = 'leave'; // player leave a game
    case set = 'set'; // this is when cup updated
    case pause = 'pause';
    case resume = 'resume';
    case sendBonus = 'sendBonus'; // surprise, surprise mother facker
    case chatMessage = 'chatMessage'; // chat message
    case speedUp = 'speedUp'; // speed up message

    // not used
    case addLine = 'addLine';
    case start = 'start';
}
