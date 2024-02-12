<?php

namespace App\Common;

/**
 * This is one class
 */
class Cup
{

    /**
     * @var array['fields' => array<int>]
     */
    public array $fields = [];

    /**
     * todo: we should init by party size
     */
    public function __construct ()
    {

    }

    /**
     * Update data
     * @param array $data
     * @return void
     */
    public function updateByData (array $data)
    {
        // update fields info
        if ($data['fields']) {
            $this->fields = $data['fields'];
        }
    }
}
