<?php

namespace tests\Unit\Game\Services\GameEvents;


use App\Common\Connection;
use Domain\Game\Aggregates\PartyImp;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\CupState;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\GameEvents\LeavePartyService;
use PHPUnit\Framework\MockObject\Exception;
use PHPUnit\Framework\TestCase;

class LeavePartyServiceTest extends TestCase
{

    /**
     * @throws Exception
     * @throws DomainException
     */
    public function test_party_not_found()
    {
        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->method('getPartyById')->willReturn(null);

        $service = new LeavePartyService($mockPartiesPool);

        $this->expectException(DomainException::class);
        // $this->expectExceptionMessage('Party not found');

        $service('123', '123');
    }

    public function test_player_not_found_in_party()
    {
        // todo: fix it to party object when you fix oll solid problems from there
        // $party = new Party();
        $mockParty = $this->createMock(PartyImp::class);
        $mockParty->method('getPlayerById')->willReturn(null);

        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->method('getPartyById')->willReturn($mockParty);

        $service = new LeavePartyService($mockPartiesPool);

        $this->expectException(DomainException::class);
        // $this->expectExceptionMessage('Player not found in the party');

        $service('123', '123');
    }


    /**
     * player status changed to offline
     * cup status changed
     * party terminated if it was last player
     *
     * @return void
     * @throws DomainException
     * @throws Exception
     */
    public function test_player_leave_success()
    {
        $mocConnection = $this->createMock(Connection::class);

        $player = new Player($mocConnection, 'Vlad');

        // todo: fix it to party object when you fix oll solid problems from there
        // $party = new Party();
        $mockParty = $this->createMock(PartyImp::class);
        $mockParty->expects($this->once())->method('getPlayerById')->willReturn($player);
        $mockParty->expects($this->once())->method('determineGameOverInSetItOver');

        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->method('getPartyById')->willReturn($mockParty);

        $party = (new LeavePartyService($mockPartiesPool))('123', '123');

        $this->assertTrue($player->isOffLine()); // should it
        $this->assertEquals(CupState::over, $player->getCup()->getState());
        // $this->assertEquals(GameState::over, $party->getGameState());
    }
}