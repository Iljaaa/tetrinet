<?php

namespace app\Actions\Messages;

use App\Common\Messages\SpeedupMessage;
use App\Common\SocketLogTrait;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\SpeedUpService;

class SpeedUp
{
    use SocketLogTrait;

    public function __construct(
        private readonly PoolOfParties $partiesPool,
    )
    {
    }

    /**
     * @throws DomainException
     */
    public function __invoke(array $data)
    {
        $this->info('data from speed up request', $data);

        // party
        $partyId = $data['partyId'] ?? '';
        $newSpeed = $data['speed'] ?? null;
        // if (!$partyId) return;

        $party = (new SpeedUpService($this->partiesPool))($partyId, $newSpeed);

        $this->info('speed up', [
            'partyId' => $partyId,
            'speed' => $party->getSpeed()
        ]);

        $m = sprintf('Speed has increased to: %s', $party->getSpeed());

        $party->addChatMessage($m);
        $party->sendChatToAllPlayers();

        $party->sendMessageToAllPlayers(new SpeedupMessage($party, $party->getSpeed()));
    }
}