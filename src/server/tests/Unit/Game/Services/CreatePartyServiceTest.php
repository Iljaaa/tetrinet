<?php

namespace tests\Unit\Game\Services;

use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\CreatePartyObserver;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Player;
use Domain\Game\Services\GameEvents\CreatePartyService;
use PHPUnit\Framework\MockObject\Exception;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/**
 *
 * @property CreatePartyObserver|MockObject mockOfCreatePartyObserver
 */
class CreatePartyServiceTest extends TestCase
{

    protected function setUp(): void
    {
        parent::setUp();

        $this->mockOfCreatePartyObserver = $this->createMock(CreatePartyObserver::class);

    }

    /**
     * @return void
     * @throws Exception
     */
    public function test_create_party()
    {
        $this->mockOfCreatePartyObserver
            ->expects($this->once())
            ->method('onPartyCreated');

        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->expects($this->once())->method('createParty');
        $mockPartiesPool->expects($this->once())->method('addParty');

        $m = new CreatePartyService($mockPartiesPool, $this->mockOfCreatePartyObserver);

        $vasilyMockConnection = $this->createMock(Connection::class);
        $vasilyMockConnection->expects($this->atLeastOnce())
            ->method('getSocketId')
            ->willReturn('socket_id');

        $party = $m->handle([
            Player::create($vasilyMockConnection, 'Vlad Cepish')
        ]);

        $this->assertNotEmpty($party);
    }
}