<?php

namespace App\Actions\Messages;

use App\Common\ResponseMessages\AfterSetMessage;
use App\Common\ResponseMessages\BackToPartyMessage;
use App\Common\SocketLogTrait;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\GameEvents\SetCupService;

/**
 * Update cup state
 */
class SetCup
{
    use SocketLogTrait;

    public function __construct(
        private readonly PoolOfParties $partiesPool,
    )
    {
    }

    public function __invoke(array $data)
    {
        $partyId = (isset($data['partyId'])) ? $data['partyId'] : '';
        $playerId = (isset($data['playerId'])) ? $data['playerId'] : '';
        $this->info("set", [
            'partyId' => $partyId,
            'playerId' => $playerId
        ]);
        // $this->info("received", ['data.cup' => $data['cup']]);

        //
        $cupData = $data['cup'] ?? null;
        if (!$cupData) {
            $this->info('Cup data not received');
            return;
        }

//        if (empty($partyId)) {
//            $this->info("Party id is empty, ignore request");
//            return;
//        }
//
//        if (empty($playerId)){
//            $this->info("Player id is empty, ignore request");
//            return;
//        }
//
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) {
//            $this->info(sprintf('Party %s not found', $partyId));
//            return;
//        }

        // save cup info
//        $party->updateCupByPlayerId($playerId, $data['cup']);
//
//        // try to determine game over
//        $this->determineGameOverInSet($party);

        try {
            $party = (new SetCupService($this->partiesPool))($partyId, $playerId, $cupData);
        } catch (DomainException $ex) {
            $m = new BackToPartyMessage();
            $m->partyNotFound($ex->getMessage());
            return;
        }

        // todo: may be we should refactor this method and send only one cup instead of all party
        $party->sendMessageToAllPlayers(new AfterSetMessage($party));
    }
}