<?php

namespace Domain\Game\Entities;

use Domain\Game\Enums\CupState;

/**
 * This is cup class
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

        // update cup state
        if ($data['state']){
            $this->state = CupState::from($data['state']);
        }
    }

    /**
     * @return void
     */
    public function setCupAsOver (): void
    {
        $this->state = CupState::over;
    }

    /**
     * @return void
     */
    public function setCupAsWinner (): void
    {
        $this->state = CupState::winner;
    }

    /**
     * Makes array to export to client
     * @return array
     */
    public function createResponseData (): array
    {
        return [
            'state' => $this->state->value,
            'fields' => $this->fields,
            'bonuses' => [], // todo: this is not used
        ];
    }

    /**
     * @return CupState
     */
    public function getState(): CupState
    {
        return $this->state;
    }

}
