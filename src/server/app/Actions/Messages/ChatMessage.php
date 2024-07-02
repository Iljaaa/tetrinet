<?php

namespace App\Actions\Messages;

use App\Common\SocketLogTrait;
use Domain\Game\Contracts\PoolOfParties;

class ChatMessage
{
    use SocketLogTrait;

    public function __construct(
        private readonly PoolOfParties $partiesPool,
    )
    {
    }


    /**
     * @param array $data
     * @return void
     */
    public function __invoke(array $data): void
    {
        // party
        $partyId = $data['partyId'] ?? '';
        if (!$partyId) return;
        $party = $this->partiesPool->getPartyById($partyId);
        if (!$party) return;

        // player
        $playerId = $data['playerId'] ?? '';
        if (!$playerId) return;
        $player = $party->getPlayerById($playerId);
        if (!$player) return;

        $this->info('new chat message', [
            'partyId' => $partyId,
            'playerId' => $playerId
        ]);

        $message = $data['message'] ?? '';

        // add message
        $party->addChatMessage($message, $player->getName(), $playerId);
        $party->sendChatToAllPlayers();
    }
}