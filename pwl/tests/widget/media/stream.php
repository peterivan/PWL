<?php

$file = null;
$ct = null;

if ( $_GET['m'] == 'audio' )
{
	$file = 'audio.ogg';
	$ct = 'audio/ogg';
}
elseif ( $_GET['m'] == 'video' )
{
	$file = 'video.ogv';
	$ct = 'video/ogg';
}

if ( is_readable($file) )
{
	//header('HTTP 1.1 301');
	header('Location: ' . $file);
}

?>