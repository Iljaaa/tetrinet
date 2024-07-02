<?php

namespace tests\Unit\Game\Services;

use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Party;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\PauseService;
use PHPUnit\Framework\MockObject\Exception;
use PHPUnit\Framework\TestCase;

class PauseServiceTest extends TestCase
{
    /**
     * @throws Exception
     * @throws DomainException
     */
    public function test_party_not_found()
    {
        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->method('getPartyById')->willReturn(null);

        $service = new PauseService($mockPartiesPool);

        $this->expectException(DomainException::class);
        // $this->expectExceptionMessage('Party not found');

        $service('123', '123');
    }

    public function test_player_not_found_in_party()
    {
        // todo: fix it to party object when you fix oll solid problems from there
        // $party = new Party();
        $mockParty = $this->createMock(Party::class);
        $mockParty->method('getPlayerById')->willReturn(null);

        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->method('getPartyById')->willReturn($mockParty);

        $service = new PauseService($mockPartiesPool);

        $this->expectException(DomainException::class);
        // $this->expectExceptionMessage('Player not found in the party');

        $service('123', '123');
    }
}