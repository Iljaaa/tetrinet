<?php

namespace App\Actions\Messages;

use App\Common\ResponseMessages\SendBonusMessage;
use App\Common\ResponseMessages\SwitchCupsMessage;
use App\Common\SocketLogTrait;
use App\Common\Types\BonusType;
use App\Common\Types\ResponseType;
use App\Helper;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\GameEvents\SwitchCupsBonusService;

/**
 * Send bonus
 * here we do not have a domain service
 * only for switch cups
 */
class SendBonus
{
    use SocketLogTrait;

    public function __construct(
        private readonly PoolOfParties $partiesPool,
    )
    {
    }

    public function __invoke($data)
    {
        // party
        $partyId = $data['partyId'] ?? '';

        // source player
        $playerId = $data['playerId'];

        // Target player id
        $target = $data['target'];

        $bonus = BonusType::from((int)$data['bonus']);

        // special situation split cup bonus
        if ($bonus == BonusType::switch) {
            $this->info('process switch', ['data' => $data]);
            $this->processSwitchSpecial($partyId, $playerId, $target);
            return;
        }

        // pause game
        // $party = $this->party;
        $party = $this->partiesPool->getPartyById($partyId);

        $player = $party->getPlayerById($playerId);
        $targetPlayer = $party->getPlayerById($target);

        $this->info("send bonus", [
            'opponent' => $player->getId(),
            'target' => $target,
            'bonus' => $bonus,
        ]);

        // send command with bonus to target player
        if ($targetPlayer) {
//            $targetPlayer->getConnection()->send(json_encode([
//                'type' => ResponseType::getBonus,
//                'source' => $playerId,
//                'target' => $target,
//                'bonus' => $bonus->value
//            ]));
            $party->sendMessageToAllPlayers((new SendBonusMessage($playerId, $target, $bonus)));
        }

        // add message
        $party->addChatMessage(sprintf('Player __%s__ sent __%s__ to __%s__', $player->getName(), Helper::GetNiceBlockName($bonus), $targetPlayer->getName()));
        $party->sendChatToAllPlayers();
    }


    /**
     * todo: make stand alone service
     * This is process special block Switch
     * @param string $partyId
     * @param string $sourcePlayerId
     * @param string $targetPlayerId
     * @return void
     * @throws DomainException
     */
    private function processSwitchSpecial(string $partyId, string $sourcePlayerId, string $targetPlayerId): void
    {
        $this->info(__METHOD__, ['partyId' => $partyId, 'sourcePlayerId' => $sourcePlayerId, 'targetPlayerId' => $targetPlayerId]);
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) return;
//        // $this->info("party: ".$party->partyId);
//
//        $sourcePlayer = $party->getPlayerById($sourcePlayerId);
//        if (!$sourcePlayer) return;
//        // $this->info('source player: '.$sourcePlayer->getConnectionId());
//
//        $targetPlayer = $party->getPlayerById($targetPlayerId);
//        if (!$targetPlayer) return;
//        // $this->info('target: '.$targetPlayer->getConnectionId());
//
//        // split cups
//        $targetPlayerCup = $targetPlayer->getCup();
//
//        $targetPlayer->setCup($sourcePlayer->getCup());
//        $sourcePlayer->setCup($targetPlayerCup);

        $party = (new SwitchCupsBonusService($this->partiesPool))($partyId, $sourcePlayerId, $targetPlayerId);

        $sourcePlayer = $party->getPlayerById($sourcePlayerId);
        $targetPlayer = $party->getPlayerById($targetPlayerId);

        $m = new SwitchCupsMessage($party);

        // send new cup to target player
        $m->setSwitchData($targetPlayerId, $sourcePlayerId, $targetPlayer->getCup());
        $targetPlayer->getConnection()->send($m->getDataAsString());

        // send new cup to source player
        $m->setSwitchData($targetPlayerId, $sourcePlayerId, $sourcePlayer->getCup());
        $sourcePlayer->getConnection()->send($m->getDataAsString());

        // send message to chat
        $party->addChatMessage(sprintf('Player __%s__ switch cup with __%s__', $sourcePlayer->getName(), $targetPlayer->getName()));
        $party->sendChatToAllPlayers();
    }
}