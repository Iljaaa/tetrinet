<?php

namespace Domain\Game\Contracts;

use Domain\Game\Entities\Player;
use Domain\Game\ValueObjects\Connection;

interface PoolOfPlayers
{
    /**
     * When player connection close
     * @param Connection $c
     * @return void
     */
    public function onConnectionClose(Connection $c): void;

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