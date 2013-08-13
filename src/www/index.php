<?php
$access_item = array();
$access_default = "page,view";

$access_item = false;

if(isset($read_access) && $read_access) {
	return;
}

include_once($_SERVER["PAGE_PATH"]."/page.class.php");
$object = $page->addObject("www/item.class.php");

Session::setValue("nav_sindex", "frontpage");
Session::setValue("item_sindex", "");
Session::setValue("tags", "");
Session::setValue("order", "");
Session::setValue("itemtype_id", "");

// default view
if(!$page->getStatus()) {$page->setStatus($access_default);}

// header
if($page->getStatus("page")) {
	$page->header("Home", "front");

}
// content
if($page->getStatus("view")) {
	$page->getTemplate("front.php", $object);
}

// footer
if($page->getStatus("page")) {
	$page->footer();
}

exit();


?>
