<?php

namespace tests\Unit\Game\Services;

use App\Common\Connection;
use Domain\Game\Aggregates\PartyImp;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Player;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\GameEvents\SetCupService;
use Domain\Game\Services\GameEvents\SwitchCupsBonusService;
use PHPUnit\Framework\MockObject\Exception;
use PHPUnit\Framework\TestCase;

/**
 * todo: make test when cup status will change
 */
class SwitchCupBonusServiceTest extends TestCase
{

    /**
     * @throws Exception
     * @throws DomainException
     */
    public function test_party_not_found()
    {
        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->method('getPartyById')->willReturn(null);

        $service = new SwitchCupsBonusService($mockPartiesPool);

        $this->expectException(DomainException::class);
        // $this->expectExceptionMessage('Party not found');

        $service('123', '123', '123');
    }

    public function test_player_not_found_in_party()
    {
        // todo: fix it to party object when you fix oll solid problems from there
        // $party = new Party();
        $mockParty = $this->createMock(PartyImp::class);
        $mockParty->method('getPlayerById')->willReturn(null);

        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->method('getPartyById')->willReturn($mockParty);

        $service = new SwitchCupsBonusService($mockPartiesPool);

        $this->expectException(DomainException::class);
        // $this->expectExceptionMessage('Player not found in the party');

        $service('123', '123', '333');
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
    public function test_set_cup_success()
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

        $party = (new SetCupService($mockPartiesPool))('123', '123', []);

        // $this->assertEquals(PlayerState::online, $player->state);
        // $this->assertEquals(CupState::online, $player->getCup()->getState());
        // $this->assertEquals(GameState::over, $party->getGameState());
    }
}