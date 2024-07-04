<?php

namespace App\Actions\Messages;

use App\Common\Connection;
use App\Common\ResponseMessages\BackToPartyMessage;
use App\Common\SocketLogTrait;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\GameEvents\BackToPartyService;

/**
 * When player leave a game and then try to back
 * this method does not work now
 */
class BackToParty
{
    use SocketLogTrait;

    public function __construct(
        private readonly PoolOfParties $partiesPool,
    ){}

    /**
     * @param Connection $connection
     * @param array $data
     * @return void
     */
    public function __invoke(Connection $connection, array $data)
    {
        $this->info(__METHOD__);

        $playerId = $data['playerId'];
        $partyId = $data['partyId'];
        $this->info('back to', ['partyId' => $partyId, 'playerId' => $playerId]);

        // response message
//        $m = new BackToPartyMessage();
//
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party){
//            $this->info('party not found');
//            $m->partyNotFound('Party not found');
//            $connection->send($m->getDataAsString());
//            return;
//        }
//
//        // find play in the party
//        $player = $party->findPlayerById($playerId);
//        if (!$player){
//            $this->info('Player not found in the party');
//            $m->partyNotFound('Player not found in the party');
//            $connection->send($m->getDataAsString());
//            return;
//        }

        try {
            $party = (new BackToPartyService($this->partiesPool))($partyId, $playerId);
        }
        catch (DomainException $ex) {
            $m = new BackToPartyMessage();
            $m->partyNotFound($ex->getMessage());
            $connection->send($m->getDataAsString());
            return;
        }

        // change socket id
        // $conn->socketId = $playerId;

        // todo: add log message
        // $party->addChatMessage('Player return to game');

        // return cups info
        $m = new BackToPartyMessage();
        $m->setCupsResponseData($party->getCupsResponse());

        //
        $this->info('party found');
        $party->sendMessageToAllPlayers($m);
    }
}