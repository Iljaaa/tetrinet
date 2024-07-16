<?php

namespace tests\Feature\Messages;

use App\Actions\Messages\BackToParty;
use App\Common\Connection;
use Domain\Game\Contracts\Party;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Player;
use Tests\TestCase;

class BackToPartyMessageTest extends TestCase
{

    public function test_message_will_send_after_call_service()
    {
        $mockConnection = $this->createMock(Connection::class);
        $mockConnection->expects($this->never())->method('send');

        $mockPlayer = $this->createMock(Player::class);

        $mockParty = $this->createMock(Party::class);
        $mockParty->expects($this->once())->method('getPlayerById')->willReturn($mockPlayer);
        $mockParty->expects($this->once())->method('sendMessageToAllPlayers');

        $fakePartiesPool = $this->createMock(PoolOfParties::class);
        $fakePartiesPool->expects($this->once())->method('getPartyById')->willReturn($mockParty);

        $action = new BackToParty($fakePartiesPool);

        $action($mockConnection, [
            'playerId' => 123,
            'partyId' => 123
        ]);


    }
}