<?php

namespace Domain\Game\Services\GameEvents;

use Domain\Game\Aggregates\PartyImp;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\ProcessGameOver;

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
     * @return PartyImp
     * @throws DomainException
     */
    public function __invoke(string $partyId, string $playerId, array $cupData): PartyImp
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
        // $party->determineGameOverInSetItOver();
        (new ProcessGameOver($party))();

        return $party;
    }
}