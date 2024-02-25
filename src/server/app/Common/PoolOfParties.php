<?php

namespace App\Common;

class PoolOfParties
{

    /**
     * Pool of parties
     * where id is a PartyId and value is the party instance
     * @var Party[]
     */
    private array $parties = [];

    public function createParty(): Party
    {
        return new Party();
    }

    /**
     * @param string $playerId
     * @return Party|null
     */
    public function findPartyByPlayerId (string $playerId): Party|null
    {
        foreach ($this->parties as $p) {
            if ($p->isPartyHasPlayerById($playerId)) {
                return $p;
            }
        }

        return null;
    }

    public function getPartyById(string $partyId): Party|null
    {
        return $this->parties[$partyId] ?? null;
    }

    public function addParty (Party $p)
    {
        $this->parties[$p->partyId] = $p;
    }

    public function terminatePartyByPartyId (string $partyId)
    {
        if (isset($this->parties[$partyId])){
            unset($this->parties[$partyId]);
        }
    }

}
