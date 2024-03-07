<?php

namespace App\Common\Types;

/**
 * Type messages received from client
 */
enum MessageType:string
{
    case start = 'start';
    case join = 'join';
    case back = 'back';
    case leave = 'leave'; // player leave a game
    case set = 'set'; // this is when cup updated
    case pause = 'pause';
    case resume = 'resume';
    case addLine = 'addLine';
    case sendBonus = 'sendBonus'; // surprise, surprise mother facker
    case chatMessage = 'chatMessage'; // chat message
}
