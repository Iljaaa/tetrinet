<?php

namespace Domain\Game\Contracts;

/**
 * Observer for events in create party service
 */
interface CreatePartyObserver
{
    public function onPartyCreated(Party $party): void;
}