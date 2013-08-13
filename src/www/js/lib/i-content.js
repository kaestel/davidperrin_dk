Util.Objects["list"] = new function() {
	this.init = function(scene) {

		// page reference
		var page = u.qs("#page");

		// let page know which scene is active
		page.scene = scene;
		scene.page = page;


		// scene enter sequence
		scene.enter = function() {
//			u.bug("list enter")

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
			else {
//				u.bug("content is ready")

				if(this.offsetWidth < this.list.offsetWidth) {

					u.o.carousel.init(this);

//					u.e.drag(this.list, [this.offsetWidth - this.list.offsetWidth, 0, this.list.offsetWidth, this.list.offsetHeight], {"strict":false, "elastica":250});
				}

				this.initiated = true;

				// show when ready
				this.page.cN.ready();

			}
		}


		// get content list
		var list = u.qs("ul", scene);
		list.scene = scene;
		list.page = page;
		scene.list = list;

		// list has no size - will be adjusted after images have loaded
		u.a.setWidth(list, 0);


		// get content items
		var i, node;
		var nodes = u.qsa("li", list);
		for(i = 0; node = nodes[i]; i++) {
			node.list = list;
			// remember node index for fullscreen
			node.i = i;

			u.a.setWidth(node, 0);

			// set new eventhandler
			u.ce(node);
			node.clicked = function() {
				// goto fullscreen mode
				this.list.fullScreen(this.i);
			}

			// get item id
			var id = u.cv(node, "id");
	
			// get item image (image_height comes from predefined value)
			node.loaded = function(event) {
				this.image = event.target;

				u.as(this, "backgroundImage", "url("+this.image.src+")");
				u.a.setWidth(this.list, this.list.offsetWidth + this.image.width);

				// node ready
				u.ac(this, "ready");

				this.list.scene.ready();
			}
			u.i.load(node, "/images/"+id+"/x"+node.offsetHeight+".jpg");
		}




		// fullscreen mode- extensive and fully selfcontained
		list.fullScreen = function(index) {
			var i, item, nodes;

			// fix crash on iPad by hiding unused nodes when opening fullscreen
			var boundary = 0;
			nodes = u.qsa("li", this);
			for(i = 0; node = nodes[i]; i++) {

				if(boundary > Math.abs(this._x) + this.scene.offsetWidth) {
//					u.bug("node after b_a: " + i);
					u.as(node, "visibility", "hidden");
				}
				boundary = boundary + node.offsetWidth;
				if(boundary < Math.abs(this._x)) {
//					u.bug("node before b_a: " + i);
					u.as(node, "visibility", "hidden");
				}

			}

			// check for fullscreen basics
			var fullscreen = u.qs("#fullscreen");
			if(!fullscreen) {
				// create fullscreen 
				fullscreen = u.ae(document.body, "div", ({"id":"fullscreen"}));


				// clone image list from content
				fullscreen.list = fullscreen.appendChild(this.cloneNode(true));
				// remove transition inherited from cloned node
				u.a.transition(fullscreen.list, "none");

				nodes = u.qsa("li", fullscreen.list);
				var screen_height = fullscreen.offsetHeight;
				var screen_width = fullscreen.offsetWidth;
				var list_width = screen_width * nodes.length;


				// set fullscreen to fullscreen height - empty list height
				u.as(fullscreen.list, "width", list_width+"px");
				u.as(fullscreen.list, "height", screen_height+"px");

				// enable list content
				for(i = 0; item = nodes[i]; i++) {
					// reset individual sizes - inherited from base
					u.as(item, "width", screen_width+"px");
					u.as(item, "height", screen_height+"px");
					u.as(item, "display", "inline-block");
					u.as(item, "visibility", "visible");

//					item.style.width = screen_width+"px";
//					item.style.height = screen_height+"px";


					// enable dbl click close
					u.e.dblclick(item);
					item.dblclicked = function(event) {
						u.qs("#fullscreen").closeFullscreen();
					}


					// click navigation
					u.e.click(item);
					item.clicked = function(event) {
						var x = event.targetTouches ? event.targetTouches[0].pageX : event.pageX;
						var fullscreen = u.qs("#fullscreen");
						if(x < this.offsetWidth/2) {
							fullscreen.navigation(fullscreen.current_index-1);
						}
						else {
							fullscreen.navigation(fullscreen.current_index+1);
						}
					}
				}

				// enable swiping
				if(list_width > screen_width) {
					u.e.swipe(fullscreen.list, new Array(screen_width - list_width, 0, list_width, screen_height), {"strict":false, "elastica":250});
				}
				fullscreen.list.swipedRight = function() {
					this.parentNode.navigation(this.parentNode.current_index-1);
				}
				fullscreen.list.swipedLeft = function() {
					this.parentNode.navigation(this.parentNode.current_index+1);
				}

				// show fullscreen node
				u.a.transition(fullscreen, "all 1s ease-in");
				u.a.setOpacity(fullscreen, 1);

				// image preloader
				fullscreen.loadImages = function(nodes) {

//					u.bug("load images:" + nodes + ":length:" + nodes.length);

					if(nodes.length) {
						var node = nodes.shift();

						if(node && !node.initiated) {
							node.fullscreen = this;
//							u.bug("load image:" + u.cv(node, "id"));

							node.initiated = true;

							// remember nodes on image load event
							node.nodes = nodes;
							// load image
							node.loaded = function(event) {
//								u.bug("loaded:" + event.target.src);

								// set image
								this.style.backgroundImage = "url("+event.target.src+")";
								// new state
								// callback
								this.fullscreen.loadImages(this.nodes);
							}
//							u.bug("/images/"+u.cv(node, "id")+"/x"+node.offsetHeight+".jpg" + ":" + u.nodeId(node));
							u.i.load(node, "/images/"+u.cv(node, "id")+"/x"+node.offsetHeight+".jpg");

						}
						else {
//							u.bug("image already loaded:" + u.cv(node, "id"));

							// callback
							this.loadImages(nodes);
						}
					}

				}

				// create fullscreen navigation controller
				fullscreen.navigation = function(index) {
					var id;

					// get selected item
					var items = u.qsa("li", this);
					index = index < 0 ? 0 : (index >= items.length ? items.length-1 : index);
					var item = items[index];
					
					var i1 = u.ns(item);
					var i2 = u.ps(item);
					var i3 = i1 ? u.ns(i1) : false;
					var i4 = i2 ? u.ps(i2) : false;

					this.loadImages(new Array(item, i1, i2, i3, i4));

					// move list to focus on node
					u.a.transition(this.list, "all 0.5s ease-out");
					u.a.translate(this.list, -index*this.offsetWidth, 0);

					// remeber index
					this.current_index = index;
					
					if(typeof(this.update) == "function") {
						this.update();
					}
				}

			}


			fullscreen.closeFullscreen = function() {
				this.transitioned = function(event) {
					this.parentNode.removeChild(this);

					// show all nodes in org list again (hidden to protect iPad from crashing)
					var i, node;
					var page = u.qs("#page");
					var nodes = u.qsa("li", page.scene.list);
					for(i = 0; node = nodes[i]; i++) {
						u.as(node, "visibility", "visible");
					}

				}
				u.a.setOpacity(this, 0);
			}

			// add fullscreen controls
			fullscreen.controls = u.ae(fullscreen, "div", {"class":"controls"});

			// fullscreen close
			fullscreen.controls.bn_close = u.ae(fullscreen, "div", {"class":"close"});
			fullscreen.controls.bn_close.fullscreen = fullscreen;
			u.e.click(fullscreen.controls.bn_close);
			fullscreen.controls.bn_close.clicked = function(event) {
//				u.bug("bn_close.clicked");
				this.fullscreen.closeFullscreen();

			}

			// add arrows for mouse users
			if(u.e.event_pref == "mouse") {

				// update position
				fullscreen.update = function() {
//					u.bug("update");

					var new_pos = this.list._x;

					if(new_pos >= 0) {
						new_pos = 0;

						u.a.transition(this.controls.bn_left, "all 0.2s ease-in");
						u.a.setOpacity(this.controls.bn_left, 0);
					}
					else {
						u.a.transition(this.controls.bn_left, "all 0.2s ease-in");
						u.a.setOpacity(this.controls.bn_left, 1);
					}

					if(new_pos <= this.list.start_drag_x) {
						new_pos = this.list.start_drag_x;

						u.a.transition(this.controls.bn_right, "all 0.2s ease-in");
						u.a.setOpacity(this.controls.bn_right, 0);
					}
					else {
						u.a.transition(this.controls.bn_right, "all 0.2s ease-in");
						u.a.setOpacity(this.controls.bn_right, 1);
					}

				}


				fullscreen.controls.bn_right = u.ae(fullscreen.controls, "div", {"class":"right"});
				fullscreen.controls.bn_right.fullscreen = fullscreen;
				fullscreen.controls.bn_left = u.ae(fullscreen.controls, "div", {"class":"left"});
				fullscreen.controls.bn_left.fullscreen = fullscreen;

				fullscreen.update();

				u.e.click(fullscreen.controls.bn_right);
				fullscreen.controls.bn_right.clicked = function(event) {
	//				u.bug("bn_right.clicked");
					this.fullscreen.list.swipedLeft();
				}
				u.e.click(fullscreen.controls.bn_left);
				fullscreen.controls.bn_left.clicked = function(event) {
	//				u.bug("bn_left.clicked");
					this.fullscreen.list.swipedRight();
				}

			}


			// go to selected node
			fullscreen.navigation(index);
		}

	}
}
