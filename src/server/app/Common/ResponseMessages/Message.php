<?php

namespace App\Common\ResponseMessages;

class Message
{
    /**
     * @var array
     */
    protected array $data = [];


    /**
     * @param string $key
     * @param mixed $value
     * @return $this
     */
    protected function setData (string $key, mixed $value): static {
        $this->data[$key] = $value;
        return $this;
    }

    /**
     * @param string $party
     * @return $this
     */
    protected function setPartyId (string $party):static
    {
        $this->data['partyId'] = $party;
        return $this;
    }

    /**
     * @return string
     */
    public function getDataAsString(): string {
        return json_encode($this->data);
    }

}
