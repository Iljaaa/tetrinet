<?php

namespace app\Common;

class ChatMessage
{
    /**
     * @var string
     */
    private string $message = '';

    /**
     * @var string
     */
    private string $playerId = '';

    /**
     * @var string
     */
    private string $playerName = '';

    /**
     * @var \DateTime
     */
    private \DateTime $date;

    /**
     * @param string $message
     * @param string $playerId
     * @param string $playerName
     */
    public function __construct(string $message, string $playerName, string $playerId = '')
    {
        $this->message = $message;
        $this->playerId = $playerId;
        $this->playerName = $playerName;
        $this->date = new \DateTime();
    }

    /**
     * @return array
     */
    public function asArray (): array
    {
        return [
            'message' => $this->message,
            'playerId' => $this->playerId,
            'playerName' => $this->playerName,
            'date' => $this->date->format('Y-m-d\TH:i:s')
        ];
    }

}
