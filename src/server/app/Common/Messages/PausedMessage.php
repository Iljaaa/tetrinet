<?php

namespace App\Common\Messages;

use App\Common\Types\ResponseType;
use Domain\Game\Entities\Party;

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
