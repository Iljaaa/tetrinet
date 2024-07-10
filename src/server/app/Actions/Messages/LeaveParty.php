<?php

namespace App\Actions\Messages;

use App\Common\Connection;
use App\Common\ResponseMessages\BackToPartyMessage;
use App\Common\SocketLogTrait;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\GameEvents\LeavePartyService;
use Domain\Game\Services\ProcessGameOver;

class LeaveParty
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

        $playerId = $data['playerId'] ?? '';
        $partyId = $data['partyId'] ?? '';
        $this->info('leave', ['partyId' => $partyId, 'playerId' => $playerId]);

//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) return;
//
//        // find player in the party
//        $player = $party->findPlayerById($playerId);
//        if (!$player) return;
//
//        // mark player as offline
//        $player->setOffline();
//
//        // set cup as over
//        $player->getCup()->setCupAsOver();

        try {
            $party = (new LeavePartyService($this->partiesPool))($partyId, $playerId);
        }
        catch (DomainException $ex) {
            // todo: make something with this place
            $m = new BackToPartyMessage();
            $m->partyNotFound($ex->getMessage());
            return;
        }

        // notify users about
        // todo: move it to the service because this message must be before message about end of the game
        $player = $party->getPlayerById($playerId);
        $party->addChatMessage(sprintf('Player __%s__ leave the game', $player->getName()));
        $party->sendChatToAllPlayers();

        // detect end game
        // $this->determineGameOverInSet($party);
        // $party->determineGameOverInSetItOver();
        // (new ProcessGameOver($party))();

    }
}