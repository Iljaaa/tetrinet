<?php

namespace tests\Unit\Game\Services;

use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Party;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\Services\ResumeService;
use PHPUnit\Framework\MockObject\Exception;
use PHPUnit\Framework\TestCase;

class ResumeServiceTest extends TestCase
{
    /**
     * @throws Exception
     * @throws DomainException
     */
    public function test_party_not_found()
    {
        $mockPartiesPool = $this->createMock(PoolOfParties::class);
        $mockPartiesPool->method('getPartyById')->willReturn(null);

        $service = new ResumeService($mockPartiesPool);

        $this->expectException(DomainException::class);
        // $this->expectExceptionMessage('Party not found');

        $service('123', '123');
    }

}