<?php

namespace Domain\Game\Aggregates;

use Domain\Game\Contracts\Party;
use Domain\Game\Contracts\PoolOfParties;
use Random\RandomException;

class BasePoolOfParties implements PoolOfParties
{

    /**
     * Pool of parties
     * where id is a PartyId and value is the party instance
     * @var PartyImp[]
     */
    private array $parties = [];

    /**
     * Create party from constructor
     * @return PartyImp
     * @throws RandomException
     */
    public function createParty(): Party
    {
        return new PartyImp(generateRandomPlayerId());
    }

    /**
     * @param string $playerId
     * @return Party|null
     */
    public function findPartyByPlayerId(string $playerId): ?Party
    {
        foreach ($this->parties as $p) {
            if ($p->isPartyHasPlayerById($playerId)) {
                return $p;
            }
        }

        return null;
    }

    /**
     * @param string $partyId
     * @return Party|null
     */
    public function getPartyById(string $partyId): ?Party
    {
        return $this->parties[$partyId] ?? null;
    }

    /**
     * @param Party $party
     * @return void
     */
    public function addParty(Party $party): void
    {
        $this->parties[$party->getId()] = $party;
    }

    /**
     * @param string $partyId
     * @return void
     */
    public function terminatePartyByPartyId (string $partyId): void
    {
        if (isset($this->parties[$partyId])) {
            unset($this->parties[$partyId]);
        }
    }

}
