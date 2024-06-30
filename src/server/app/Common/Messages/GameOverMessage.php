<?php

namespace App\Common\Messages;

use App\Common\Types\ResponseType;
use Domain\Game\Entities\Party;

class GameOverMessage extends AfterSetMessage
{

    public function __construct(Party $party)
    {
        parent::__construct($party);

        // we use here after set, but we should make a new message type
        $this->setData('type', ResponseType::afterSet);
    }
}
