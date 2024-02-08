<?php

namespace App\Common;

/**
 * This is cup object received in set method
 */
class Cup
{

    /**
     * @var array['fields' => array<int>]
     */
    public array $cup = [];

    /**
     * todo: we should init by party size
     */
    public function __construct ()
    {

    }

    public function setCupByPartyIndex(int $partyIndex, array $cup)
    {
        $this->cup[$partyIndex] = $cup;
    }
}
