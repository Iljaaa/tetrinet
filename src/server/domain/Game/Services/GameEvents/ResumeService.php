<?php

namespace Domain\Game\Services\GameEvents;

use Domain\Game\Aggregates\PartyImp;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;

class ResumeService
{

    public function __construct(private readonly PoolOfParties $partiesPool)
    {
    }

    /**
     * @param string $partyId
     * @return PartyImp
     * @throws DomainException
     */
    public function __invoke(string $partyId): PartyImp
    {
        $party = $this->partiesPool->getPartyById($partyId);
        if (!$party) {
            throw new DomainException('Party not found');
        }

        // resume game
        $party = $this->partiesPool->getPartyById($partyId);
        $party->setGameRunning();

        return $party;
    }
}