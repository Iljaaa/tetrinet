<?php

namespace App\Sockets;

use App\Actions\OnConnectionClose;
use App\Actions\OnMessage;
use App\Common\Connection;
use App\Common\SocketLogTrait;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Exceptions\DomainException;
use Ratchet\ConnectionInterface as RatchetConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

/**
 * Object witch ratchet connection
 */
class GameSocket implements MessageComponentInterface
{
    use SocketLogTrait;

    /**
     *
     */
    public function __construct(private readonly PoolOfPlayers $playersPool, private readonly PoolOfParties $partiesPool)
    {
    }

    /**
     * @param RatchetConnectionInterface $conn
     * @return void
     * @throws \Random\RandomException
     */
    public function onOpen(RatchetConnectionInterface $conn): void
    {
        $this->info(__METHOD__);

        // init nex connection
        $connection = Connection::init($conn);

        $this->info(sprintf('Connection open with %s', $connection->getSocketId()));
    }

    /**
     * @param RatchetConnectionInterface $conn
     * @return void
     */
    public function onClose(RatchetConnectionInterface $conn): void
    {
        $this->info(__METHOD__, ['socketId' =>  $conn->socketId]);

        (new OnConnectionClose($this->playersPool, $this->partiesPool))
            ->handle(Connection::factory($conn));
    }

    /**
     * @param RatchetConnectionInterface $conn
     * @param \Exception $e
     * @return void
     */
    public function onError(RatchetConnectionInterface $conn, \Exception $e): void
    {
        $this->info(__METHOD__);
        $this->error($e->getMessage());
        $this->error($e->getTraceAsString());
    }

    /**
     * @param RatchetConnectionInterface $conn
     * @param MessageInterface $msg
     * @return void
     * @throws DomainException
     */
    public function onMessage(RatchetConnectionInterface $conn, MessageInterface $msg):void
    {
        $this->info(__METHOD__);

        (new OnMessage($this->playersPool, $this->partiesPool))
            ->handle(Connection::factory($conn), $msg);
    }



}
