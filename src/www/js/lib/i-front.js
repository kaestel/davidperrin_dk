Util.Objects["front"] = new function() {
	this.init = function(scene) {
//		u.bug("init front");

		// page reference
		var page = u.qs("#page");

		// let page know which scene is active
		page.scene = scene;
		scene.page = page;

		scene.initiated = false;

		// scene enter sequence
		scene.enter = function() {
//			u.bug("front enter")

			var i, node;
			var nodes = u.qsa("li", this.list);

			for(i = 0; node = nodes[i]; i++) {
				u.a.transition(node, this.page._gentrans_)
				u.a.setWidth(node, node.image.width);
			}


		}


		// list items ready - enable drag
		scene.ready = function() {
			// not ready or already initiated
			if(u.qsa("li.ready", this.list).length != u.qsa("li", this.list).length || this.initiated) {
				return;
			}
			// ready
			else {
//				u.bug("content is ready")

				// set drag if list is wider than content
				if(this.offsetWidth < this.list.offsetWidth) {

					u.o.carousel.init(this);
				}

				this.initiated = true;

				// show when ready
				this.page.cN.ready();

			}
		}


		// create ul in content
		var list = u.ae(scene, "ul");
		list.scene = scene;
		list.page = page;
		scene.list = list;

		// list has no size - will be adjusted after images have loaded
		u.as(list, "width", 0);


		// get images for frontpage list
		var i, node, nav_node;
		var nav_nodes = u.qsa("li", page.nN);
		for(i = 0; nav_node = nav_nodes[i]; i++) {
			// clone nodes individually to be able to transfer stored values
			node = list.appendChild(nav_node.cloneNode(true));
			node.url = nav_node.url;
			node.list = list;

			// enable links
			u.e.click(node);
			node.clicked = function(event) {
				location.hash = u.h.cleanHash(this.url);
			}

			// handle request response
			node.response = function(response) {
				// get first item
				var item = u.qs("#content li", response);
				if(item) {
					var id = u.cv(item, "id");

					u.a.setWidth(this, 0);

					// set background
					this.loaded = function(event) {
						this.image = event.target;
						u.as(this, "backgroundImage", "url("+this.image.src+")");
						u.a.setWidth(this.list, this.list.offsetWidth + this.image.width);

						// node ready
						u.ac(this, "ready");

						// callback to scene ready
						this.list.scene.ready();
					}
					// load image
					u.i.load(this, "/images/"+id+"/x"+this.offsetHeight+".jpg");
				}
				// no items
				else {

					u.ac(this, "ready");

					// callback to scene ready
					this.list.scene.ready();
				}
			}

			// request navigation element to get image ids
			u.request(node, node.url);
		}

	}
 }
