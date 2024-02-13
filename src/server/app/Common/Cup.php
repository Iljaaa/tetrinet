<?php

namespace App\Common;

/**
 * This is one class
 */
class Cup
{

    /**
     * Field state data
     * @var array['fields' => array<int>]
     */
    private array $fields = [];

    /**
     * todo: we should init by party size
     */
    public function __construct ()
    {

    }

    /**
     * Update data by received from client
     * @param array $data
     * @return void
     */
    public function updateByData (array $data): void
    {
        // update fields info
        if ($data['fields']) {
            $this->fields = $data['fields'];
        }
    }

    public function createResponseData (): array
    {
        return [
            'fields' => $this->fields
        ];
    }
}
