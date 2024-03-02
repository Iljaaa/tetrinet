<?php

namespace App\Common\Messages;

use App\Common\Party;
use App\Common\Types\ResponseType;

class AfterSetMessage extends Message
{

    public function __construct(Party $party)
    {
        $this->setData('type', ResponseType::afterSet);
        $this->setData('state', $party->getGameState());
        $this->setData('cups', $party->getCupsResponse());
    }
}
