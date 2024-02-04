@php

/**
 * @var string[] $jsFiles
 * @var string[] $cssFiles
 */

@endphp

@extends('layouts.default')

@section('headerScripts')
    @foreach($cssFiles as $f)
        <link rel="stylesheet" type="text/css" href="/static/css/{{ $f }}" />
    @endforeach
@stop

@section('footerScripts')
    @foreach($jsFiles as $f)
        <script src="/static/js/{{ $f }}"></script>
    @endforeach
@stop

@section('content')
<script>
    window.tetrinetConfig = {
        socketUrl: "ws://127.0.0.1:10000/websocket"
    }
</script>
<div id="root"></div>
@stop
