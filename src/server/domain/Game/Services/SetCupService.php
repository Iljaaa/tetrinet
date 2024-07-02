<?php

namespace Domain\Game\Services;

use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Party;
use Domain\Game\Exceptions\DomainException;

class SetCupService
{
    public function __construct(
        private readonly PoolOfParties $partiesPool,
    )
    {
    }

    /**
     * @param string $partyId
     * @param string $playerId
     * @param array $cupData
     * @return Party
     * @throws DomainException
     */
    public function __invoke(string $partyId, string $playerId, array $cupData): Party
    {
        $party = $this->partiesPool->getPartyById($partyId);
        if (!$party) {
            throw new DomainException('Party not found');
        }

        // find player in the party
        $player = $party->getPlayerById($playerId);
        if (!$player) {
            throw new DomainException('Player not found in the party');
        }

        // save cup info
        $party->updateCupByPlayerId($playerId, $cupData);

        // try to determine game over
        $party->determineGameOverInSetItOver();

        return $party;
    }
}