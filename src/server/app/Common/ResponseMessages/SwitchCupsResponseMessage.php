<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\BonusType;
use App\Common\Types\ResponseType;
use Domain\Game\Aggregates\PartyImp;
use Domain\Game\Entities\Cup;

class SwitchCupsResponseMessage extends ResponseMessage
{

    public function __construct(PartyImp $party)
    {
        $this->setData('type', ResponseType::getBonus);
        $this->setData('bonus', BonusType::switch);
        $this->setPartyId($party->getId());
    }

    public function setSwitchData(string $target, string $source, Cup $yourCup): static
    {
        $this->setData('target', $target);
        $this->setData('source', $source);
        $this->setData('yourCup', $yourCup->createResponseData());
        return $this;
    }


}
