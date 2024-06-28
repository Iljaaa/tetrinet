<?php

namespace App\Common\Messages;

use App\Common\Types\ResponseType;
use domain\Game\Entities\Party;

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
