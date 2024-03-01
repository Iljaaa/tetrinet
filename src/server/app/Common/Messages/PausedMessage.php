<?php

namespace App\Common\Messages;

use App\Common\Party;
use App\Common\Types\ResponseType;

class PausedMessage extends Message
{

    /**
     *
     */
    public function __construct(Party $party)
    {
        $this->setData('type', ResponseType::paused);
        $this->setData('state', $party->getGameState());
    }
}
