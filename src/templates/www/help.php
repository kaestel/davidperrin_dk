<div class="c scene help i:help">
	<h2>Help</h2>
	<p>This site comes in different flavors.<br />Depending on device and browser, we serve what we think will provide you with the best experience in your current browser.</p>
	<p>You are currently placed in the <em><?= Session::getDevice("segment") ?></em> segment. You can find the <a href="#segments">segment-overview</a> below.</p>

	<p>If you experience problems with the website, you can try a different segment (or updating your browser).</p>
	<ul id="segments">
		<li>
			<h3><a href="/?ps=segment&segment=desktop">desktop</a></h3>
			<p>Interactive HTML5 version</p>
			<p>Browsers: <a href="http://www.google.com/chrome/">Chrome 5+</a>, <a href="http://firefox.com">Firefox 4+</a>, <a href="http://www.apple.com/safari/">Safari 5+</a></p>
			<p>Recommended downloads for PC browsing.</p>
		</li>
		<li>
			<h3><a href="/?ps=segment&segment=desktop_ie">desktop_ie</a></h3>
			<p>Fallback to desktop_light</p>
			<p>Browsers: Internet Explorer 9 + 8</p>
		</li>
		<li>
			<h3><a href="/?ps=segment&segment=desktop_light">desktop_light</a></h3>
			<p>Plain, pure and simple. As little as possible, to help the meek.</p>
			<p>Browsers: Any other desktop browser, no matter how old</p>
		</li>
		<li>
			<h3><a href="/?ps=segment&segment=tablet">tablet</a></h3>
			<p>Touch-Interactive HTML5 version</p>
			<p>Browsers: Webkit browsers (iPad + Android)</p>
		</li>
		<li>
			<h3><a href="/?ps=segment&segment=mobile_touch">mobile_touch</a></h3>
			<p>Touch-Interactive HTML5 version</p>
			<p>Browsers: Webkit browsers (iPhone, iPod, Android 2.2+)</p>
		</li>
		<li>
			<h3><a href="/?ps=segment&segment=mobile">mobile</a></h3>
			<p>Just a hand above mobile_light</p>
			<p>Browsers: Hi-end mobilephones</li>
		<li>
			<h3><a href="/?ps=segment&segment=mobile_light">mobile_light</a></h3>
			<p>A few colors away from basic</p>
			<p>Browsers: Low-end mobilephones</p>
		</li>
		<li>
			<h3><a href="/?ps=segment&segment=basic">basic</a></h3>
			<p>Semantic markup</p>
			<p>Browsers: Screenreaders, Text browsers, Search engines.</p>
		</li>
	</ul>
</div>