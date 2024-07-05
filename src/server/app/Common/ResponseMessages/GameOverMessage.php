<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\ResponseType;
use Domain\Game\Aggregates\PartyImp;

class GameOverMessage extends AfterSetMessage
{

    public function __construct(PartyImp $party)
    {
        parent::__construct($party);

        // we use here after set, but we should make a new message type
        $this->setData('type', ResponseType::afterSet);
    }
}
