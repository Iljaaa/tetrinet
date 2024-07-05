<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\ResponseType;
use Domain\Game\Entities\Party;

class SpeedupMessage extends Message
{

    /**
     *
     */
    public function __construct(Party $party, int $newSpeed)
    {
        $this->setData('type', ResponseType::speedUp);
        $this->setPartyId($party->getId());
        $this->setData('speed', $newSpeed);
    }
}
