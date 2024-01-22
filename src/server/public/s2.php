<?php
error_reporting(E_ALL);

/* Allow the script to hang around waiting for connections. */
set_time_limit(0);

/* Turn on implicit output flushing so we see what we're getting
 * as it comes in. */
ob_implicit_flush();

// the adress should be or working or zeroes
// $address = '127.0.0.1';
$address = '0.0.0.0';

// port realy important, other ports not working
$port = 10000;

print "preparing".PHP_EOL;

if (($sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) === false) {
    echo "socket_create() failed: reason: " . socket_strerror(socket_last_error()) . "\n";
}

if (socket_bind($sock, $address, $port) === false) {
    echo "socket_bind() failed: reason: " . socket_strerror(socket_last_error($sock)) . "\n";
}

if (socket_listen($sock, 5) === false) {
    echo "socket_listen() failed: reason: " . socket_strerror(socket_last_error($sock)) . "\n";
}


// start listening circle
do {

    print "do.circle".PHP_EOL;
    if (($msgsock = socket_accept($sock))) {
        print "new conection accepted".PHP_EOL;
        var_dump($msgsock);
    }
    else {
        print "socket_accept() failed: reason: " . socket_strerror(socket_last_error($sock)) .PHP_EOL;
        break;
    }

    // do handshake
    $request = socket_read($msgsock, 5000);

    preg_match('#Sec-WebSocket-Key: (.*)\r\n#', $request, $matches);
    $key = base64_encode(pack(
        'H*',
        sha1($matches[1] . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    ));
    $headers = "HTTP/1.1 101 Switching Protocols\r\n";
    $headers .= "Upgrade: websocket\r\n";
    $headers .= "Connection: Upgrade\r\n";
    $headers .= "Sec-WebSocket-Version: 13\r\n";
    $headers .= "Sec-WebSocket-Accept: $key\r\n\r\n";
    socket_write($msgsock, $headers, strlen($headers));

    // write in socket connection
    // $msg = "\nWelcome to the PHP Test Server. \n" . "To quit, type 'quit'. To shut down the server type 'shutdown'.\n";
    // socket_write($msgsock, $msg, strlen($msg));

    while (true) {
        sleep(1);
        $content = 'Now: ' . time();
        $response = chr(129) . chr(strlen($content)) . $content;
        try {
            socket_write($msgsock, $response);
            // var_dump($msgsock);

            // if we have error it means that connection lost
            if (socket_last_error($msgsock)) {
                break;
            }
            // var_dump(socket_last_error($msgsock));
        }
        catch (\Error $er){
            print "Connection lost".PHP_EOL;
        }

    }

} while (true);

socket_close($sock);
