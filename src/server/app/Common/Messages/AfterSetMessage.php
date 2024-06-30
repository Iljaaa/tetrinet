<?php

namespace App\Common\Messages;

use App\Common\Types\ResponseType;
use Domain\Game\Entities\Party;

class AfterSetMessage extends Message
{

    public function __construct(Party $party)
    {
        $this->setData('type', ResponseType::afterSet);
        $this->setData('state', $party->getGameState());
        $this->setData('cups', $party->getCupsResponse());
    }
}
