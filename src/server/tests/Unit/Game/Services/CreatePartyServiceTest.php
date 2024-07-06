<?php

namespace tests\Unit\Game\Services;

use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Player;
use Domain\Game\Services\GameEvents\CreatePartyService;
use PHPUnit\Framework\MockObject\Exception;

// use Tests\TestCase;
use PHPUnit\Framework\TestCase;

/**
 * todo: change this test to Unit after that party will get generator of ids
 */
class CreatePartyServiceTest extends TestCase
{
//    protected function setUp(): void
//    {
//        parent::setUp();
//    }


    /**
     * @return void
     * @throws Exception
     */
    public function test_create_party()
    {
        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->expects($this->once())->method('createParty');
        $mockPartiesPool->expects($this->once())->method('addParty');

        $m = new CreatePartyService($mockPartiesPool);

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