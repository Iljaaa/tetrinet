<?php

namespace Domain\Game\Services\GameEvents;

use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;

/**
 * When user click button join to game
 * todo: add observer object against callback that party created
 */
class JoinToPartyService
{
    public function __construct(
        private readonly PoolOfPlayers $playersPool,
        private readonly PoolOfParties $partiesPool,
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

        // add player to pool
        $this->playersPool->addPlayerToPull($pollToAdd, $p, function (array $players) {
            $party = (new CreatePartyService($this->partiesPool))
                ->handle($players);

        });

        return $p;
    }

}