<?php

namespace App\Contracts\Game;

use App\Common\Connection;
use app\Common\Player;
use Ratchet\ConnectionInterface;

interface PoolOfPlayers
{
    /**
     * When player connection close
     * @param Connection $conn
     * @return void
     */
    public function onConnectionClose(ConnectionInterface $conn): void;

    /**
     * Add player to a pool for waiting other players
     * todo: make one method width constant
     * @param Player $player
     * @param callable $onPartyFullCallback call this method when players enough to start party
     * @return void
     */
    public function addToDuels(Player $player, callable $onPartyFullCallback): void;
    public function addToParty(Player $player, callable $onPartyFullCallback): void;


}