<?php

namespace Domain\Game\Contracts;

use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;

/**
 * Observer for events in join to party service
 */
interface JoinPartyObserver
{
    /**
     * Calls when player was created
     * @param Player $player
     * @param PartyType $partyType
     * @return void
     */
    public function onPlayerCreated(Player $player, PartyType $partyType): void;

    /**
     * Calls when party was created
     * @param Party $party
     * @return void
     */
    public function onPartyCreated(Party $party): void;
}