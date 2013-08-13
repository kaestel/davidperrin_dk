Util.Objects["navigation"] = new function() {
	this.init = function(nav) {

		// page reference
		var page = u.qs("#page");
		// let page know which scene is active
		nav.page = page;
		nav.start_width = nav.offsetWidth;

		u.e.click(nav);
		nav.clicked = function(event) {
			u.e.kill(event);

			if(u.hc(this, "open")) {
				u.rc(this, "open");

				this.transitioned = function(event) {
					this.transitioned = null;

					u.a.transition(this, "none");
					u.a.setWidth(this, this.start_width);
				}
				u.a.transition(this, "all 0.2s ease-out");
				u.a.setHeight(this, 0);
			}
			else {
				u.ac(this, "open");

				this.transitioned = function(event) {
					this.transitioned = null;
					u.a.transition(this, "none");
				}
				u.a.transition(this, "none");
				u.a.setWidth(this, this.page.offsetWidth);

				u.a.transition(this, "all 0.2s ease-out");
				u.a.setHeight(this, this.page.sN.offsetHeight + this.page.nN.offsetHeight);
			}
		}
		nav.moved = function(event) {
			u.e.resetEvents(this);
		}


		// set navigation links
		var nav_nodes = u.qsa("li", nav);
		for(i = 0; node = nav_nodes[i]; i++) {
			node.nav = nav;
			u.ce(node);
			node.clicked = function(event) {
				location.hash = u.h.cleanHash(this.url);
				this.nav.clicked(event);
			}
			node.moved = function(event) {
				u.e.resetEvents(this);
			}
		}


		// // set contact link
		// page.contact = u.qs(".servicenavigation .contact", page);
		// u.ce(page.contact);
		// page.contact.clicked = function(event) {
		// 	location.hash = u.h.cleanHash(this.url);
		// }
		// // set contact link
		// page.home = u.qs(".servicenavigation .front", page);
		// u.ce(page.home);
		// page.home.clicked = function(event) {
		// 	location.hash = u.h.cleanHash(this.url);
		// }

	}
}
