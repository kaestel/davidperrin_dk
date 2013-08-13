<!DOCTYPE html>
<html>
<head>
	<!-- (c) & (p) think.dk 2010-2011 //-->
	<!-- All material protected by copyrightlaws //-->
	<title>David Perrin - <?= $this->getTitle() ?></title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="HandheldFriendly" content="true" />
	<meta name="keywords" content="photograph" />
	<meta name="language" content="<?= strtolower(Session::getLanguageIso()) ?>" />
	<meta name="description" content="<?= $this->getDescription() ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<link type="text/css" rel="stylesheet" media="all" href="/css/lib/seg_<?= Session::getDevice("segment") ?>_include.css" />
	<script type="text/javascript" src="/js/lib/seg_<?= Session::getDevice("segment") ?>_include.js"></script>
</head>

<body<?= HTML::makeAttribute("class", $this->getClass()) ?>>

<div id="page" class="i:page">

	<div id="header">
		<h1>Photographer David Perrin</h1>

		<div class="servicenavigation">
			<ul>
				<li class="keynav front"><a href="/">Home</a></li>
				<li class="keynav contact"><a href="/contact">Contact</a></li>
				<li class="keynav navigation nofollow"><a href="#navigation" rel="nofollow">To navigation</a></li>
				<li class="keynav segments nofollow"><a href="/help" rel="nofollow">Help</a></li>
			</ul>
		</div>

	</div>

	<div id="content">
