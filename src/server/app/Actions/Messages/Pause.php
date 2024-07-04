<?php

namespace App\Actions\Messages;

use App\Common\Connection;
use App\Common\ResponseMessages\PausedMessage;
use App\Common\SocketLogTrait;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\PauseService;

class Pause
{
    use SocketLogTrait;

    public function __construct(
        private readonly PoolOfParties $partiesPool,
    )
    {
    }

    /**
     * @throws DomainException
     */
    public function __invoke(Connection $connection, array $data): void
    {
        $this->info(__METHOD__);

        $partyId = $data['partyId'] ?? '';

        // fixme: omg! this is bad code, this must be fixed after client side update
        $playerId = $connection->getSocketId();

        // pause game
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) return;
//
//        /** @var Player $player */
//        $player = $party->getPlayerById($connection->getSocketId());
//        if (!$player) return;

//        //
//        if ($player->getPauses() <= 0) return;
//
//        // set pause
//        $party->setPause();
//
//        // decrease user pauses count
//        $player->decreasePause();

        $party = (new PauseService($this->partiesPool))($partyId, $playerId);

        //
        $party->sendMessageToAllPlayers(new PausedMessage($party));

        $player = $party->getPlayerById($playerId);

        // send chat message
        $intent = $data['intent'] ?? '';
        $s = ($intent)
            ? sprintf('Player __%s__ paused the game, because: %s. Left: %d', $player->getName(), $intent, $player->getPauses())
            : sprintf('Player __%s__ paused the game. Left: %d', $player->getName(), $player->getPauses());
        $party->addChatMessage($s);
        $party->sendChatToAllPlayers();
    }
}