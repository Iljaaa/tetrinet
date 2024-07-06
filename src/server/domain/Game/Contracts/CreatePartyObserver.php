<?php

namespace Domain\Game\Contracts;

/**
 * Observer for events in create party service
 */
interface CreatePartyObserver
{

    /**
     * Calls when party was created
     * @param Party $party
     * @return void
     */
    public function onPartyCreated(Party $party): void;
}