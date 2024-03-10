<?php

namespace App\Common\Messages;

use App\Common\Party;
use App\Common\Types\ResponseType;

class GameOverMessage extends AfterSetMessage
{

    public function __construct(Party $party)
    {
        parent::__construct($party);

        // we use here after set, but we should make a new message type
        $this->setData('type', ResponseType::afterSet);
    }
}
