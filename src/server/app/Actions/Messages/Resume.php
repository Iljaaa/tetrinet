<?php

namespace App\Actions\Messages;

use App\Common\Connection;
use App\Common\Messages\ResumeMessage;
use App\Common\SocketLogTrait;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Player;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\ResumeService;

class Resume
{
    use SocketLogTrait;

    public function __construct(
        private readonly PoolOfParties $partiesPool,
    )
    {
    }

    /**
     * @param Connection $connection
     * @param array $data
     * @return void
     * @throws DomainException
     */
    public function __invoke(Connection $connection, array $data): void
    {
        $this->info(__METHOD__);

        $partyId = $data['partyId'] ?? '';

        // fixme: omg! this is bad code, this must be fixed after client side update
        $playerId = $connection->getSocketId();

        // resume game
        // $party = $this->partiesPool->getPartyById($partyId);
        // $party->setGameRunning();

        $party = (new ResumeService($this->partiesPool))($partyId);

        // send resume command to all
        $party->sendMessageToAllPlayers(new ResumeMessage($party));

        // send chat message
        /** @var Player $player */
        $player = $party->getPlayerById($playerId);
        $intent = $data['intent'] ?? '';
        $s = ($intent)
            ? sprintf('Player __%s__ resumed the game because: %s', $player->getName(), $intent)
            : sprintf('Player __%s__ resumed the game', $player->getName());
        $party->addChatMessage($s);
        $party->sendChatToAllPlayers();
    }
}