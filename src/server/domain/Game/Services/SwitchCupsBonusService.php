<?php

namespace Domain\Game\Services;

use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Party;
use Domain\Game\Exceptions\DomainException;

class SwitchCupsBonusService
{

    public function __construct(
        private readonly PoolOfParties $partiesPool,
    )
    {
    }

    /**
     * @param string $partyId
     * @param string $sourcePlayerId
     * @param string $targetPlayerId
     * @return Party
     * @throws DomainException
     */
    public function __invoke(string $partyId, string $sourcePlayerId, string $targetPlayerId): Party
    {
        $party = $this->partiesPool->getPartyById($partyId);
        if (!$party) {
            throw new DomainException('Party not found');
        }

        // find player in the party
        $sourcePlayer = $party->getPlayerById($sourcePlayerId);
        if (!$sourcePlayer) {
            throw new DomainException('Source player not found in the party');
        }

        $targetPlayer = $party->getPlayerById($targetPlayerId);
        if (!$targetPlayer) {
            throw new DomainException('Target player not found in the party');
        }

        // split cups
        $targetPlayerCup = $targetPlayer->getCup();

        $targetPlayer->setCup($sourcePlayer->getCup());
        $sourcePlayer->setCup($targetPlayerCup);

        return $party;
    }
}