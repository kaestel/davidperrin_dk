<?php
$access_item = false;
$access_default = "page,view";

if(isset($read_access) && $read_access) {
	return;
}


include_once($_SERVER["PAGE_PATH"]."/page.class.php");
$nav_sindex = $page->expectRestParams(0);

Session::setValue("nav_sindex", $nav_sindex);
Session::setValue("item_sindex", "");
Session::setValue("tags", "");
Session::setValue("order", "");
Session::setValue("itemtype_id", "");


$object = $page->addObject("www/item.class.php");


// default view
if(!$page->getStatus()) {$page->setStatus($access_default);}


// header
if($page->getStatus("page")) {
	$page->header();
}

// excluding each other
if($page->getStatus("view")) {
	$page->getTemplate("list.php", $object);
}

// footer
if($page->getStatus("page")) {
	$page->footer();
	exit();
}

?>
