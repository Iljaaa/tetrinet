<?php
// Создание сокета для прослушивания подключений
$server = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_bind($server, '0', 889);
socket_set_option($server, SOL_SOCKET, SO_REUSEADDR, 1);//разрешаем использовать один порт для нескольких соединений
socket_listen($server);



while(true)
{ //Бесконечный цикл ожидания подключений
    // Ожидание подключения клиента
    $client = socket_accept($server);
    echo "Client connected\n";

    // Чтение данных от клиента
    $input = socket_read($client, 2048);
    echo "Received message: " . $input . "\n";

    sleep(1);

    // headers
    preg_match("/Sec-WebSocket-Key: (.*)/", $input, $matches);
    var_dump($matches);

    $uuid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"; // This is a constant
    $result = sha1($matches[1] . $uuid, true); // true to output raw
    $result = base64_encode($result);

    echo $matches[1]. "\n";

        $header = "HTTP/1.1\r\n" .
            // "Host: 127.0.0.1:889\r\n".
        // "Origin: 127.0.0.1:8080\r\n".
        "Upgrade: websocket\r\n" .
        "Connection: Upgrade\r\n" .
        "Sec-WebSocket-Key: ".$result."\r\n" .
        "\r\n";
    echo $header;
    socket_write($client, $header, strlen($header));

    echo $result. "\n";
    sleep(5);

    // Отправка данных клиенту
    $output = "Hello, client!";
    socket_write($client, $output, strlen($output));

    sleep(2);

}



echo "we end here";

// Закрытие соединения
socket_close($client);
socket_close($server);
