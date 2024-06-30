<?php

namespace Domain\Game\Contracts;

use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;
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
     * Add player to waining pool
     *  todo: may be it will be the good idea to make a class with __invoke method for callback function it would allow describe function params
     * @param PartyType $party
     * @param Player $player
     * @param callable $playersEnoughToMakeParty callback method when players enough to start party
     * @return void
     */
    public function addPlayerToPull(PartyType $party, Player $player, callable $playersEnoughToMakeParty): void;

    /**
     * Pool size,
     * method only for debug
     * @param PartyType $party
     * @return int
     */
    public function getPullSize(PartyType $party): int;


}