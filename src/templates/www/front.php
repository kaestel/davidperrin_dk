<?php
	$itemObject = $this->getTemplateObject();
	$itemObject->getSearchItems();

	if($itemObject->item()) {
		$item = $itemObject->item;
		print '<div class="c scene front i:front pageintro:'.$item["id"][0].'"></div>';
	}
	else {
		print '<div class="c scene front i:front"></div>';
	}
?>
