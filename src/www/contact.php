<?php
$access_item = false;
$access_default = "page,view";

if(isset($read_access) && $read_access) {
	return;
}


include_once($_SERVER["PAGE_PATH"]."/page.class.php");

Session::setValue("nav_sindex", "");
Session::setValue("item_sindex", "");
Session::setValue("tags", "");
Session::setValue("order", "");
Session::setValue("itemtype_id", "");


// default view
if(!$page->getStatus()) {$page->setStatus($access_default);}


// header
if($page->getStatus("page")) {
	$page->header("Contact", "contact");
}

// excluding each other
if($page->getStatus("view")) {
	$page->getTemplate("contact.php");
}

// footer
if($page->getStatus("page")) {
	$page->footer();
	exit();
}

?>
