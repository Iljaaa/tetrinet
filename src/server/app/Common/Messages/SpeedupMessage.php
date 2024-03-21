<?php

namespace app\Common\Messages;

use App\Common\Party;
use App\Common\Types\ResponseType;

class SpeedupMessage extends Message
{

    /**
     *
     */
    public function __construct(Party $party, int $newSpeed)
    {
        $this->setData('type', ResponseType::speedUp);
        $this->setPartyId($party->partyId);
        $this->setData('speed', $newSpeed);
    }
}
