<?php

namespace tests\Unit\Game\Services;

use Domain\Game\Contracts\Party;
use Domain\Game\Entities\Cup;
use Domain\Game\Entities\Player;
use Domain\Game\Services\AllCupsResponseService;

use PHPUnit\Framework\TestCase;

class AllCupsResponseTest extends TestCase
{

    public function test_make_empty_array()
    {
        $partyMock = $this->createMock(Party::class);
        $partyMock->expects($this->once())->method('getPlayers')->willReturn([]);

        $s = new AllCupsResponseService($partyMock);
        $this->assertEmpty($s->handle());
    }

    public function test_make_array()
    {
        $mockCup = $this->createMock(Cup::class);
        $mockCup->expects($this->once())->method('createResponseData')->willReturn([]);

        $player = $this->createMock(Player::class);
        $player->expects($this->once())->method('getCup')->willReturn($mockCup);

        $partyMock = $this->createMock(Party::class);
        $partyMock->expects($this->once())->method('getPlayers')->willReturn([
            $player
        ]);


        $s = new AllCupsResponseService($partyMock);
        $this->assertCount(1, $s->handle());
    }


}