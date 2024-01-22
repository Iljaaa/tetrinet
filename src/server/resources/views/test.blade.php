<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Socket test</title>

    <script>

        document.addEventListener("DOMContentLoaded", function() {
            console.log('dom ready');

            try {
                // const socket = new WebSocket('/s.php')
                const socket = new WebSocket('ws://127.0.0.1:889/')
                console.log(socket, 'socked')

                socket.onopen = () => {
                    console.log ('Socket.onOpen');
                };

                socket.onmessage = (IT, ev) => {
                    console.log (ev, 'Socket.onMessage');
                }

                socket.onerror = (it, ev) => {
                    console.log (it, ev, 'Socket.onError22222222');
                };

                socket.onclose = () => {
                    console.log ('Socket.onClose');
                }
            }
            catch (e) {
                console.log(e, 'ERROR ON CONNECT')
            }
        })

    </script>

</head>
<body>
    <div>
        123
    </div>
</body>
</html>
