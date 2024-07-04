<?php

namespace App\Common\ResponseMessages;

use app\Common\ChatMessage;
// use App\Common\Party;

class Message
{
    /**
     * @var array
     */
    protected array $data = [];

    /*
     * this is chat
     * @var array
     *
    // protected array $chat = [];

//    public function setPartyData(Party $party): static
//    {
//        $this->setData();
//        return $this;
//    }*/

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
     * @param UpdateChatMessage[] $chatItems
     * @return Message
     *
    public function setChat(array $chatItems): static {
        return $this->setData('chat', array_map( fn (ChatMessage $c) => $c->asArray(), $chatItems));
    }*/

    /*
     * @return void
     */
//    public function setData ()
//    {
//
//    }

    /**
     * @return string
     */
    public function getDataAsString(): string {
        return json_encode($this->data);
    }

}
