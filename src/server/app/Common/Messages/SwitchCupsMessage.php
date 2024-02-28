<?php

namespace App\Common\Messages;

use App\Common\Cup;
use App\Common\Party;
use App\Common\Types\BonusType;
use App\Common\Types\ResponseType;

class SwitchCupsMessage extends Message
{

    public function __construct(Party $party)
    {
        $this->setData('type', ResponseType::getBonus);
        $this->setData('bonus', BonusType::switch);
        $this->setPartyId($party->partyId);
    }

    public function setSwitchData(string $target, string $source, Cup $yourCup): static
    {
        $this->setData('target', $target);
        $this->setData('source', $source);
        $this->setData('yourCup', $yourCup->createResponseData());
        return $this;
    }


}
