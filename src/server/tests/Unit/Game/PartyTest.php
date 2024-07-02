<?php

namespace tests\Unit\Game;

// chach party terminated when last player leave

use App\Common\Types\PlayerState;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Party;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\CupState;
use Domain\Game\Services\LeavePartyService;
use Domain\Game\ValueObjects\Connection;
use PHPUnit\Framework\TestCase;

class PartyTest extends TestCase
{
//    public function test_add_player_success()
//    {
//        $mockConnection = $this->createMock(Connection::class);
//        $mockConnection
//            ->expects($this->once())
//            ->method('getSocketId')
//            ->willReturn('mock_connection_id');
//
//
//        $player = new Player($mockConnection, 'Vlad');
//
//        $party = new Party();
//        $party->addPlayer($player);
//        $this->assertNotEmpty($party->getPlayerById('mock_connection_id'));
//
//    }

//    public function test_player_leave()
//    {
//        $mocConnection = $this->createMock(Connection::class);
//
//        $player = new Player($mocConnection, 'Vlad');
//
//        $party = new Party();
//        $party->addPlayer($player);
//
//        $mockPartiesPool = $this->createMock(PoolOfParties::class);
//        $mockPartiesPool->method('getPartyById')->willReturn($mockParty);
//
//        $party = (new LeavePartyService($mockPartiesPool))('123', '123');
//
//        $this->assertEquals(PlayerState::offline, $player->state);
//        $this->assertEquals(CupState::over, $player->getCup()->getState());
//    }
}