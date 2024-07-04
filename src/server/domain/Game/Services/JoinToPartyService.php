<?php

namespace Domain\Game\Services;

use App\Common\ResponseMessages\LetsPlayMessage;
use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;

/**
 * When user click button join to game
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
        $this->playersPool->addPlayerToPull($pollToAdd, $p, [$this, 'onCreateParty']);

        return $p;
    }

    /**
     * Callback method when players enough to make a party
     * todo: make stand alone service
     * @param Player[] $players
     * @return void
     */
    public function onCreateParty(array $players)
    {
        // create party
        $party = $this->partiesPool->createParty();

        // move players to party
        foreach ($players as $p) $party->addPlayer($p);

        //
        $this->partiesPool->addParty($party);

        // run game
        $party->setGameRunning();

        // create message
        $m = new LetsPlayMessage($party);
        $party->sendMessageToAllPlayers($m);

        // send chat message to all
        $party->sendChatToAllPlayers();
    }
}