<?php

namespace Domain\Game\Services\GameEvents;

use Domain\Game\Contracts\CreatePartyObserver;
use Domain\Game\Contracts\Party;
use Domain\Game\Contracts\PoolOfParties;

/**
 * When players enough in pool they marrged into party
 */
class CreatePartyService
{
    public function __construct(
        private readonly PoolOfParties $partiesPool,
        private readonly CreatePartyObserver $createPartyObserver
    )
    {
    }

    /**
     * @param array $players
     * @return Party
     */
    public function handle(array $players): Party
    {
        // create party
        $party = $this->partiesPool->createParty(generateRandomPlayerId(...));

        // move players to party
        foreach ($players as $p) $party->addPlayer($p);

        //
        $this->partiesPool->addParty($party);

        // run game
        $party->setGameRunning();

        // call observer
        $this->createPartyObserver->onPartyCreated($party);

        return $party;
    }
}