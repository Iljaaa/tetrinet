<?php

namespace App\Common;

/**
 * This is one class
 */
class Cup
{

    private CupState $state = CupState::online;

    /**
     * Field state data
     * @var array['fields' => array<int>]
     */
    private array $fields = [];

    /**
     *
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

        if ($data['state']){
            $this->state = CupState::from($data['state']);
        }

    }

    public function createResponseData (): array
    {
        return [
            'state' => $this->state->value,
            'fields' => $this->fields,
            'bonuses' => [], // todo: make it
        ];
    }
}
