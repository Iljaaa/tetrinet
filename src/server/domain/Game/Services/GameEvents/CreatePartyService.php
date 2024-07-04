<?php

namespace Domain\Game\Services\GameEvents;

use App\Common\ResponseMessages\LetsPlayMessage;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Party;

/**
 * When players enough in pool they marrged into party
 */
class CreatePartyService
{
    public function __construct(
        private readonly PoolOfParties $partiesPool,
        // private readonly \Collectable $onPartyCreated
    )
    {
    }

    /**
     * @param array $players
     * @return Party
     */
    public function handle(array $players): Party
    {
        // create party
        $party = $this->partiesPool->createParty();

        // move players to party
        foreach ($players as $p) $party->addPlayer($p);

        //
        $this->partiesPool->addParty($party);

        // run game
        $party->setGameRunning();

        // todo: move this to
        // create message
        $m = new LetsPlayMessage($party);
        $party->sendMessageToAllPlayers($m);

        // send chat message to all
        $party->sendChatToAllPlayers();

        return $party;
    }
}