<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\ResponseType;
use Domain\Game\Aggregates\PartyImp;

class AfterSetMessage extends Message
{

    public function __construct(PartyImp $party)
    {
        $this->setData('type', ResponseType::afterSet);
        $this->setData('state', $party->getGameState());
        $this->setData('cups', $party->getCupsResponse());
    }
}
