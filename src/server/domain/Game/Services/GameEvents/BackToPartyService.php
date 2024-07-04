<?php

namespace Domain\Game\Services\GameEvents;

use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Party;
use Domain\Game\Exceptions\DomainException;

/**
 * Player try to return to party
 */
class BackToPartyService
{

    public function __construct(private readonly PoolOfParties $partiesPool)
    {
    }

    /**
     * @param string $partyId
     * @param string $playerId
     * @return Party
     * @throws DomainException
     */
    public function __invoke(string $partyId, string $playerId): Party
    {
        $party = $this->partiesPool->getPartyById($partyId);
        if (!$party) {
            throw new DomainException('Party not found');
        }

        // find play in the party
        $player = $party->getPlayerById($playerId);
        if (!$player){
            throw new DomainException('Player not found in the party');
        }

        // here mut be logic but it not ready

        return $party;
    }
}