<?php

namespace App\Actions\Messages;

use App\Common\Messages\JoinToPartyMessage;
use App\Common\Messages\LetsPlayMessage;
use App\Common\SocketLogTrait;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;
use Domain\Game\ValueObjects\Connection;

/**
 * Message when player start search party
 */
class JoinToParty
{
    use SocketLogTrait;

    public function __construct(
        private readonly PoolOfPlayers $playersPool,
        private readonly PoolOfParties $partiesPool,
    ){}

    /**
     * @param Connection $connection
     * @param array $data
     * @return void
     */
    public function __invoke(Connection $connection, array $data)
    {
        $this->info(__METHOD__);

        // in witch pool we should add user
        $pool = PartyType::from($data['partyType'] ?? 'duel');
        $playerName = trim($data['playerName']);

        $this->info('get request to add in pull', [
            'pool' => $pool->value,
            'socketId' => $connection->getSocketId(),
            'playerName' => $playerName]
        );

        // create new player
        $p = new Player($connection, $playerName);

        // create handshake message
        $m = (new JoinToPartyMessage())
            ->setPartyType($pool)
            ->setYourPlayerId($p->getConnectionId());

        // send answer to handshake with connection id
        $p->getConnection()->send($m->getDataAsString());

        // add player to pool
        $this->playersPool->addPlayerToPull($pool, $p, [$this, 'onCreateParty']);
    }

    /**
     * Callback method when players enough to make a party
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