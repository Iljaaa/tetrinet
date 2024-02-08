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
     * @param array $setData data received from set method
     */
    public function __construct (array $setData)
    {
        $this->cup = $setData;
    }
}
