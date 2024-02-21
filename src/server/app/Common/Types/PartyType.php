<?php

namespace App\Common\Types;

/**
 * Type messages received from client
 */
enum PartyType:string
{
    case duel = 'duel';
    case party = 'party';
}
