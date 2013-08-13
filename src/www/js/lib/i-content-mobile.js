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
			item.style.backgroundImage = "url(/images/"+id+"/75x.jpg)";
		}
	}
}
u.e.addOnloadEvent(u.init);
