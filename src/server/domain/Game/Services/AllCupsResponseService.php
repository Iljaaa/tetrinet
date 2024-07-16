<?php

namespace Domain\Game\Services;

use Domain\Game\Contracts\Party;
use Domain\Game\Entities\Player;

/**
 * This service collect from party all cups and make one array for answer
 * I'm not sure should it be a service or iy should be a method
 */
class AllCupsResponseService
{
    public function __construct(private readonly Party $party)
    {
    }

    /**
     * @return array
     */
    public function handle(): array
    {
        return array_map(function (Player $p): array {
            return $p->getCup()->createResponseData();
        }, $this->party->getPlayers());
    }
}