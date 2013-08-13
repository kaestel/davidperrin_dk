Util.Objects["page"] = new function() {
	this.init = function(e) {

		// alert about help
		var cookie = u.getCookie("segments");
		if(!cookie) {
			var segments_info = u.ie(document.body, "div", ({"class":"segments"}));
			u.ae(segments_info, "h2").innerHTML = "You are using a very old browser.";
			u.ae(segments_info, "p").innerHTML = "Click here to see the cool version of the website";
			segments_info.onclick = function() {
				location.href = "/help";
			}
			u.saveCookie("segments", true);
		}
	}
}

Util.Objects["front"] = new function() {
	this.init = function(e) {
		var i, item;

		// get navigation ul
		var list = u.qs("ul", u.qs("navigation"));

		// get navigation items
		var items = u.qsa("li", list);
		for(i = 0; item = items[i]; i++) {
			// get image, get url from link
			
			item.url = u.qs("a", item).href;
			item.response = function(response) {
				// get all list items and choose random image
				var items = u.qsa("li", response);
				if(items.length) {
					var random = Math.floor(Math.random()*items.length);
					var id = u.cv(items[random], "id");
					this.style.backgroundImage = "url("+"/images/"+id+"/x250.jpg"+")";
				}
			}
			u.request(item.url, item, "ps=view");
		}
		u.ac(list, "ready");
	}
 }



Util.Objects["list"] = new function() {
	this.init = function(e) {
		var i, item;

		// get content list
		var list = u.qs("ul", e);

		// get content items
		var items = u.qsa("li", list);
		for(i = 0; item = items[i]; i++) {
			// get item id
			var id = u.cv(item, "id");
			item.style.backgroundImage = "url(/images/"+id+"/x250.jpg)";
		}
		u.ac(list, "ready");
	}
}

Util.Objects["view"] = new function() {
	this.init = function(e) {

		// get content list
		var image = u.qs("img", e);
		var id = u.cv(image, "id");
		
		image.src = "/images/"+id+"/x550.jpg";

		u.ac(e, "ready");
	}
}
