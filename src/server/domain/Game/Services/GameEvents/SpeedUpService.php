<?php

namespace Domain\Game\Services\GameEvents;

use Domain\Game\Aggregates\PartyImp;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;

class SpeedUpService
{
    public function __construct(
        private readonly PoolOfParties $partiesPool,
    )
    {
    }

    /**
     * @param string $partyId
     * @param int $newSpeed
     * @return PartyImp
     * @throws DomainException
     */
    public function __invoke(string $partyId, int $newSpeed): PartyImp
    {
        $party = $this->partiesPool->getPartyById($partyId);
        if (!$party) {
            throw new DomainException('Party not found');
        }

        if (!$newSpeed) {
            throw new DomainException('Incorrect speed not received from request');
        }

        // increase speed
        // $party->speedUp();
        if (!$party->setSpeed($newSpeed)) {
            // throw new DomainException('Incorrect speed not received from request');
        }

        return $party;
    }
}