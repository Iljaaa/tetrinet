<?php

namespace App\Common\Messages;

use App\Common\Types\PartyType;

class JoinToPartyMessage extends Message
{
    /**
     *
     * @param string $playerId
     * @return $this
     */
    public function setYourPlayerId(string $playerId): static
    {
        return $this->setData('yourPlayerId', $playerId);
    }

    /**
     *
     * @param PartyType $partyType
     * @return $this
     */
    public function setPartyType (PartyType $partyType): static
    {
        return $this->setData('partyType', $partyType->value);
    }

}
