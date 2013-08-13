<div class="c scene">
	<div class="c50 prev"></div>
	<div class="c400 view i:view">
		<?php
		$itemObject = $this->getTemplateObject();
		$itemObject->getSearchItem();

		 if($itemObject->item()) {
			$itemObject->getTypeName();
			$item = $itemObject->item;
			print '<img src="/images/'.$item["id"][0].'/x200.jpg" alt="'.$item["name"][0].'" class="id:'.$item["id"][0].'" />';
		}
		else {
			print '<p>Sorry, you have reached the wrong end of a one-way street.</p>';
		} ?>
	</div>
	<div class="c50 next"></div>
</div>