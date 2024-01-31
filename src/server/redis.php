<?php
$redis = new Redis();
//Connecting to Redis
$r = $redis->connect('redis', '6379');
var_dump($r);
$redis->auth('123');

$data = $redis->get('123');
var_dump($data);
