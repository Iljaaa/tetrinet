<?php

namespace App\Actions\Messages;

use App\Common\ResponseMessages\JoinToPartyMessage;
use App\Common\ResponseMessages\LetsPlayMessage;
use App\Common\SocketLogTrait;
use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\CreatePartyObserver;
use Domain\Game\Contracts\Party;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;
use Domain\Game\Services\GameEvents\JoinToPartyService;

/**
 * Message when player start search party
 */
class JoinToParty implements CreatePartyObserver
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
    public function __invoke(Connection $connection, array $data): void
    {
        $this->info(__METHOD__);

        // in witch pool we should add user
        $pool = PartyType::from($data['partyType'] ?? 'duel');

        // player name
        $playerName = trim($data['playerName']);

        $this->info('get request to add in pull', [
            'pool' => $pool->value,
            'socketId' => $connection->getSocketId(),
            'playerName' => $playerName]
        );

        $player = (new JoinToPartyService($this->playersPool, $this->partiesPool, $this))
            ->handle($connection, $pool, $playerName);

        // send handshake
        $this->sendHandShake($player, $pool);


    }

    private function sendHandShake(Player $player, PartyType $pool): void
    {
        // create handshake message
        $m = (new JoinToPartyMessage())
            ->setPartyType($pool)
            // ->setYourPlayerId($player->getConnection()->getSocketId());
            ->setYourPlayerId($player->getId());

        // send answer to handshake with connection id
        $player->getConnection()->send($m->getDataAsString());
    }

    /**
     * @param Party $party
     * @return void
     */
    public function onPartyCreated(Party $party): void
    {
        // create message
        $m = new LetsPlayMessage($party);
        $party->sendMessageToAllPlayers($m);

        // send chat message to all
        $party->sendChatToAllPlayers();
    }


}