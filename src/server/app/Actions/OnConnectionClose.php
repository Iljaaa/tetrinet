<?php

namespace App\Actions;

use App\Contracts\Game\PoolOfParties;
use App\Contracts\Game\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\ValueObjects\Connection;

class OnConnectionClose
{
    public function __construct(
        private readonly Connection $connection,
        private readonly PoolOfPlayers $playersPool,
        private readonly PoolOfParties $partiesPool,
    ){}

    public function handle(): void
    {
        // if connection was in search pool
        $this->playersPool->onConnectionClose($this->connection);

        // when connection closed we mark party as paused
        $party = $this->partiesPool->findPartyByPlayerId($this->connection->getSocketId());
        if (!$party) return;

        // double check that user exists
        $player = $party->getPlayerById($this->connection->getSocketId());
        if (!$player) return;

        // player may be offline if he leaves game before
        if (!$player->isOffLine())
        {
            // notify all players
            $party->addChatMessage(sprintf('Connection with the user __%s__ was lost', $player->getName()));
            $party->sendChatToAllPlayers();

            // set player is offline
            $player->setOffline();

            // set cup as over
            $player->getCup()->setCupAsOver();

            // determine end of the game
            // $this->determineGameOverInSetItOver($party);
            $party->determineGameOverInSetItOver();
        }

        // if all players offline we party should be terminated
        $partyPlayers = $party->getPlayers();
        $onLinePlayers = array_filter($partyPlayers, fn(Player $p) => $p->isOnLine());
        if (count($onLinePlayers) == 0) {
            $this->partiesPool->terminatePartyByPartyId($party->partyId);
        }
    }
}