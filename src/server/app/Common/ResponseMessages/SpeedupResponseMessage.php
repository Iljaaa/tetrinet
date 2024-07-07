<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\ResponseType;
use Domain\Game\Aggregates\PartyImp;

class SpeedupResponseMessage extends ResponseMessage
{

    /**
     *
     */
    public function __construct(PartyImp $party, int $newSpeed)
    {
        $this->setData('type', ResponseType::speedUp);
        $this->setPartyId($party->getId());
        $this->setData('speed', $newSpeed);
    }
}
