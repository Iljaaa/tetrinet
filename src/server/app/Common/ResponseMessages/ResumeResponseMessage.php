<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\ResponseType;
use Domain\Game\Aggregates\PartyImp;

class ResumeResponseMessage extends ResponseMessage
{

    /**
     *
     */
    public function __construct(PartyImp $party)
    {
        $this->setData('type', ResponseType::resumed);
        $this->setData('state', $party->getGameState());
    }
}
