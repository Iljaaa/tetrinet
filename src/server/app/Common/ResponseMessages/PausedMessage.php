<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\ResponseType;
use Domain\Game\Aggregates\PartyImp;

class PausedMessage extends Message
{

    /**
     *
     */
    public function __construct(PartyImp $party)
    {
        $this->setData('type', ResponseType::paused);
        $this->setData('state', $party->getGameState());
    }
}
