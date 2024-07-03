<?php

namespace tests\Unit\Game\Services;

use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\SpeedUpService;
use PHPUnit\Framework\MockObject\Exception;
use PHPUnit\Framework\TestCase;

/**
 * todo: make test when cup status will change
 */
class SpeedUpServiceTest extends TestCase
{

    /**
     * @throws Exception
     * @throws DomainException
     */
    public function test_party_not_found()
    {
        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->method('getPartyById')->willReturn(null);

        $service = new SpeedUpService($mockPartiesPool);

        $this->expectException(DomainException::class);
        // $this->expectExceptionMessage('Party not found');

        $service('123', '123', '123');
    }

    /**
     * @throws Exception
     * @throws DomainException
     */
//    public function test_speed_not_updates()
//    {
//        $mockPartiesPool = $this->createMock(PoolOfParties::class);
//        $mockPartiesPool->method('getPartyById')->willReturn(null);
//
//        $service = new SpeedUpService($mockPartiesPool);
//
//        $this->expectException(DomainException::class);
//        // $this->expectExceptionMessage('Party not found');
//
//        $service('123', '123', '123');
//    }

}