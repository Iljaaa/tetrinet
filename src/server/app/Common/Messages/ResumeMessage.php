<?php

namespace App\Common\Messages;

use App\Common\Party;
use App\Common\Types\ResponseType;

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
