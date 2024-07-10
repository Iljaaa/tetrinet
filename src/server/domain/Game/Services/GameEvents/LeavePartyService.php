<?php

namespace Domain\Game\Services\GameEvents;

use Domain\Game\Aggregates\PartyImp;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\ProcessGameOver;

class LeavePartyService
{
    public function __construct(private readonly PoolOfParties $partiesPool)
    {
    }

    /**
     * @param string $partyId
     * @param string $playerId
     * @return PartyImp
     * @throws DomainException
     */
    public function __invoke(string $partyId, string $playerId): PartyImp
    {
        $party = $this->partiesPool->getPartyById($partyId);
        if (!$party) {
            throw new DomainException('Party not found');
        }

        // find player in the party
        $player = $party->getPlayerById($playerId);
        if (!$player){
            throw new DomainException('Player not found in the party');
        }

        // mark player as offline
        $player->setOffline();

        // set cup as over
        $player->getCup()->setCupAsOver();

        // if it was last player
        // $party->determineGameOverInSetItOver();
        (new ProcessGameOver($party))();

        //
        return $party;
    }
}