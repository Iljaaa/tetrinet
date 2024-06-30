<?php

namespace App\Common\Messages;

use App\Common\Types\ResponseType;
use Domain\Game\Entities\Party;

class LetsPlayMessage extends Message
{

    /**
     *
     */
    public function __construct(Party $party)
    {
        $this->setData('type', ResponseType::letsPlay);
        $this->setPartyId($party->partyId);

        // create party info
        $partyResponse = [];
        foreach ($party->getPlayers() as $p) $partyResponse[] = [
            'playerId' => $p->getConnection()->getSocketId(),
            'name' => $p->getName()
        ];

        $this->setPartyInfo($partyResponse);
    }

    /**
     * @param array $partyData
     * @return static
     */
    private function setPartyInfo(array $partyData): static
    {
        $this->setData('party', $partyData);
        return $this;
    }
}
