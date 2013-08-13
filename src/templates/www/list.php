<div class="c scene list i:list">
	<ul>
		<?php
		$itemObject = $this->getTemplateObject();
		$itemObject->getSearchItems();

		 if($itemObject->item()) {
			$itemObject->getTypeName();
			$item = $itemObject->item;

			foreach($item["id"] as $key => $id) {
				print '<li'.HTML::makeAttribute("class", "id:". $id).'><h2><a href="/view/'.$item["sindex"][$key].'">'.$item["name"][$key].'</a></h2></li>';
			}
		} ?>
	</ul>
</div>
