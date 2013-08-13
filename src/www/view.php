<?php
$access_item = false;
$access_default = "page,view";

if(isset($read_access) && $read_access) {
	return;
}


include_once($_SERVER["PAGE_PATH"]."/page.class.php");
$item_sindex = $page->expectRestParams(0);

Session::setValue("item_sindex", $item_sindex);


$object = $page->addObject("www/item.class.php");


// default view
if(!$page->getStatus()) {$page->setStatus($access_default);}


// header
if($page->getStatus("page")) {
	$page->header();
}

// excluding each other
if($page->getStatus("view")) {
	$page->getTemplate("view.php", $object);
}

// footer
if($page->getStatus("page")) {
	$page->footer();
	exit();
}

?>
