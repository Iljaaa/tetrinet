<?php

namespace Domain\Game\Contracts;

interface PoolOfParties
{

    /**
     * Create new party
     * @return Party
     */
    public function createParty(\Closure $partyIdGenerator): Party;

    /**
     * Add party to pull
     */
    public function addParty(Party $party): void;

    /**
     * @param string $partyId
     * @return Party|null
     */
    public function getPartyById(string $partyId): ?Party;

    /**
     * @param string $playerId
     * @return Party|null
     */
    public function findPartyByPlayerId(string $playerId): ?Party;

    /**
     * Close all payers connections and destroy party
     * @param string $partyId
     * @return void
     */
    public function terminatePartyByPartyId(string $partyId): void;

}