	</div>

	<div id="navigation">
		<ul>
			<?php
				$items = Session::getNavigation();
				if($items["id"]) {
					foreach($items["id"] as $key => $value) {

						$trail = $items["trail"][$key] ? "trail" : "";
						$selected = $items["selected"][$key] ? "sel" : "";

						$hidden = $items["hidden"][$key];

						$name = $items["name"][$key];
						$url = $items["url"][$key];
						$children = $items["children"][$key];

						if(($children || $url) && !$hidden) {
							print '<li'.HTML::makeAttribute("class", $selected, $trail).'>';
							print '<h2>' . ($url ? '<a href="'.$url.'">'.$name.'</a>' : $name).'</h2>';
							print '</li>';
						}
						else if($name == "----") {
							print '<li'.HTML::makeAttribute("class", "separator").'></li>';
						}
					}
				}
			?>
		</ul>
	</div>

	<div id="footer">

		<div class="servicenavigation">
			<ul>
				<li class="keynav top nofollow"><a href="#header" rel="nofollow">To top</a></li>
			</ul>
		</div>

		<div class="copyright"><span>Copyright David Perrin</span>&nbsp;&copy;</div>
	</div>

</div>

</body>
</html>