<?php

namespace App\Common\Messages;

use App\Common\Types\ResponseType;
use domain\Game\Entities\Party;

class AfterSetMessage extends Message
{

    public function __construct(Party $party)
    {
        $this->setData('type', ResponseType::afterSet);
        $this->setData('state', $party->getGameState());
        $this->setData('cups', $party->getCupsResponse());
    }
}
