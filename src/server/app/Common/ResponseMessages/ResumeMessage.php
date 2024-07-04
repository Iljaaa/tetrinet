<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\ResponseType;
use Domain\Game\Entities\Party;

class ResumeMessage extends Message
{

    /**
     *
     */
    public function __construct(Party $party)
    {
        $this->setData('type', ResponseType::resumed);
        $this->setData('state', $party->getGameState());
    }
}
