<?php

namespace Domain\Game\Services\GameEvents;

use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\CreatePartyObserver;
use Domain\Game\Contracts\JoinPartyObserver;
use Domain\Game\Contracts\Party;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;

/**
 * When user click button join to game
 */
class JoinToPartyService implements CreatePartyObserver
{
    public function __construct(
        private readonly PoolOfPlayers $playersPool,
        private readonly PoolOfParties $partiesPool,
        private readonly JoinPartyObserver $joinPartyObserver
    )
    {
    }

    /**
     * @param Connection $connection
     * @param PartyType $pollToAdd
     * @param string $playerName
     * @return Player
     */
    public function handle(Connection $connection, PartyType $pollToAdd, string $playerName): Player
    {
        // create new player
        $p = Player::create($connection, $playerName);

        $this->joinPartyObserver->onPlayerCreated($p, $pollToAdd);

        // add player to pool
        $this->playersPool->addPlayerToPull($pollToAdd, $p, function (array $players) {
            (new CreatePartyService($this->partiesPool, $this))
                ->handle($players);

        });

        return $p;
    }

    public function onPartyCreated(Party $party): void
    {
        $this->joinPartyObserver->onPartyCreated($party);
    }
}