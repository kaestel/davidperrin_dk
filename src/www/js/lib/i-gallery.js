Util.Objects["gallery"] = new function() {
	this.init = function(gallery) {
		var i, node;

//		var gallery = u.wrapElement(list, "div", {"class":"gallery"});

		gallery.list = u.qs("ul", gallery);
		gallery.nodes = u.qsa("li", gallery.list);

		gallery.t_loading = false;

		gallery.transition_type = "ease-out";
		gallery.transition_time = 0.6; // in seconds

		if(gallery.endless == undefined || gallery.endless) {
			gallery.endless = true;
		}
//		gallery.endless = gallery.endless ? gallery.endless : true; // start slide

		if(gallery.start_at == undefined || !gallery.nodes[gallery.start_at]) {
			gallery.start_at = 0;
		}
//		gallery.start_at = gallery.start_at ? gallery.start_at : 0; // start slide
//		u.bug("gallery_start_at:" + gallery.start_at);

		gallery.gallery_width = gallery.offsetWidth;
		gallery.slide_width = gallery.list.offsetWidth;


		gallery.controls = u.ae(gallery, "div", {"class":"controls"});

		// add next/prev links
		gallery.bn_next = u.ae(gallery.controls, "div", {"class":"next"});
		gallery.bn_next.gallery = gallery;
		u.e.click(gallery.bn_next);
		gallery.bn_next.clicked = function(event) {
			this.gallery.swipedLeft();
		}

		gallery.bn_prev = u.ae(gallery.controls, "div", {"class":"prev"});
		gallery.bn_prev.gallery = gallery;
		u.e.click(gallery.bn_prev);
		gallery.bn_prev.clicked = function(event) {
			this.gallery.swipedRight();
		}

		// update controls state - only show prev/next if they can be used
		gallery.updateControls = function() {
			if(!this.endless) {
				if(this.selected_node.i == 0) {
					u.a.setOpacity(this.bn_prev, 0);
				}
				else {
					u.a.setOpacity(this.bn_prev, 1);
				}

				if(this.selected_node.i == this.nodes.length-1) {
					u.a.setOpacity(this.bn_next, 0);
				}
				else {
					u.a.setOpacity(this.bn_next, 1);
				}
			}

//			u.bug("update controls");
		}


		gallery.minimizeLoad = function() {
//			u.bug("minimizeLoad");
			var i, node;
			for(i = 0; node = this.nodes[i]; i++) {
				if(node != this.selected_node) {
					u.as(node, "display", "none");
				}
			}
		}

		// load all nodes on init

		// swipe
		// place next node correctly
		// drag selected_node and next node at the same time - next node is decided based on drag position
		// on drop - move selected_node and next node at the same time to end state
		// callback to scene update

		// click
		// place next node correctly
		// move selected_node and next node at the same time to end state
		// callback to scene update (to set )

		gallery._showLoading = function() {
			u.ac(this, "loading");

			if(typeof(this.loading) == "function") {
				this.loading();
			}
		}

		gallery._loading = function() {
			this.t_loading = u.t.setTimer(this, this._showLoading, 1000);
		}

		gallery._loaded = function() {
			u.t.resetTimer(this.t_loading);
			u.rc(this, "loading");

			if(typeof(this.loaded) == "function") {
				this.loaded();
			}
		}

		// set up carousel

		gallery._ready = function() {
//			u.bug("gallery._ready");

			if(!u.qsa("li.waiting,li.loading", this).length) {
				this._loaded();
			}

			if(!this.gallery_initialized) {
				this.gallery_initialized = true;

				u.e.swipe(this, this, {"show_bounds":false});

				this.picked = function(event) {
					// get prev and next node

					this.prev_node = this.prevNode(this.selected_node);
					this.next_node = this.nextNode(this.selected_node);

					// no transitions on drag
					u.a.transition(this.selected_node, "none");

					// position nodes for drag



// experiment with hidding unused nodes !!!



					if(this.prev_node) {
						u.a.transition(this.prev_node, "none");
						u.a.translate(this.prev_node, -(this.gallery_width), 0);

						u.as(this.prev_node, "display", "block");
					}

					if(this.next_node) {
						u.a.transition(this.next_node, "none");
						u.a.translate(this.next_node, (this.gallery_width), 0);

						u.as(this.next_node, "display", "block");
					}

//					u.bug(this.prev_node.i + "," + this.selected_node.i + "," + this.next_node.i)

				}

				this.moved = function(event) {
//					u.bug("moved:" + this.current_x);

					// only drag the required nodes to maintain full visual effect with least resources
					// prev node in view
					if(this.prev_node && this.current_x > 0) {
//						u.bug("move prev:")
						u.a.translate(this.prev_node, (this.current_x-this.gallery_width), 0);
					}

					u.a.translate(this.selected_node, this.current_x, 0);

					// next node in view
					if(this.next_node && this.current_x < 0) {
//						u.bug("move next:")
						u.a.translate(this.next_node, (this.current_x+this.gallery_width), 0);
					}
				}

				this.dropped = function(event) {
//					u.bug("dropped");
					// no direction on exit (but movement - to be sure it is not just a click) - go back
					// the rest will be handled by the swipeHandlers and selectNode
					if(!this.swiped && this.selected_node._x != 0) {
//						u.bug("dropped without swipe");

						var duration = Math.abs(this.transition_time / (this.gallery_width / this.current_x));
//						u.bug("duration:" + duration)

						if(this.prev_node && this.current_x > 0) {
							u.a.transition(this.prev_node, "all " + duration + "s " + this.transition_type);
							u.a.translate(this.prev_node, -(this.gallery_width), 0);
						}

						if(this.next_node && this.current_x < 0) {
							u.a.transition(this.next_node, "all " + duration + "s " + this.transition_type);
							u.a.translate(this.next_node, (this.gallery_width), 0);
						}


						this.selected_node.transitioned = function() {
							this.transitioned = null;
							u.a.transition(this, "none");

							// transition is done - set display=none on all unused slides
							this.gallery.minimizeLoad();
						}
						u.a.transition(this.selected_node, "all " + duration + "s " + this.transition_type);
						u.a.translate(this.selected_node, 0, 0);
					}

					this.updateControls();
				}

				this.swipedDown = this.swipedUp = function(event) {
					this.swiped = false;
				}

				this.swipedLeft = function(event) {
//					u.bug("swipedLeft:" + this.selected_node._x);
					// only swipe to next if position and swipe-direction says the same
					if(this.selected_node._x <= 0) {
						if(this.endless || this.nextNode(this.selected_node)) {
							this.selectNode(this.selected_node.i+1);
							return;
						}
					}

					this.swiped = false;

					this.updateControls();
				}
				this.swipedRight = function(event) {
//					u.bug("swipedRight:" + this.selected_node._x);
					// only swipe to next if position and swipe-direction says the same
					if(this.selected_node._x >= 0) {
						if(this.endless || this.prevNode(this.selected_node)) {
							this.selectNode(this.selected_node.i-1);
							return;
						}
					}

					this.swiped = false;

					this.updateControls();
				}


				this.selectNode(this.start_at);

				if(typeof(this.ready) == "function") {
					this.ready();
				}
			}

		}

		// load node bg - all nodes are loaded on init
		gallery.nodeLoad = function(node) {
//			u.bug("nodeLoad:" + u.nodeId(node));


			// load node background
			if(!node.initialized) {
				node.initialized = true;


				// change to block before loading image
				u.as(node, "display", "block");


				// load bg
				node.loaded = function(queue) {
//					u.bug("loaded:" + u.nodeId(this) + ", " + queue[0]._image.src)

					if(queue[0]._image.width / queue[0]._image.height < window.innerWidth / window.innerHeight) {
//						u.bug("defined by height")
						u.ac(this, "portrait");
					}
					else {
//						u.bug("defined by width")
						u.ac(this, "landscape");
					}

					u.as(this, "backgroundImage", "url("+queue[0]._image.src+")");
					u.ac(this, "ready");

					// callback to _ready controller (will monitor if all nodes are ready)
					this.gallery._ready();
				}
//				u.i.load(node, "/images/"+u.getIJ(node, "id")+"/x"+node.offsetHeight+".jpg");

				u.preloader(node, ["/images/"+u.cv(node, "id")+"/x"+window.innerHeight+".jpg"])
//				u.preloader(node, ["/images/"+u.cv(node, "id")+"/x"+node.offsetHeight+".jpg"])
			}
			else {
				this._ready();
			}

		}

		// set selected image
		gallery.selectNode = function(index, static_update) {
//			u.bug("gallery.selectNode:" + u.nodeId(this,1) + ":" + index + ":" + static_update)

			// if no selected_node - fresh start, prepare page for initial viewing
			if(!this.selected_node) {
//				u.bug("initial setup")

				// set selected node
				this.selected_node = this.nodes[index];
//				this.selected_index = this.selected_node.i;

				u.as(this.selected_node, "display", "block");

				// position node correctly, ready to fade up
				u.a.transition(this.selected_node, "none");
//				u.a.setOpacity(this.selected_node, 0);
				u.a.translate(this.selected_node, 0, 0);

//				u.bug("this.selected_node:" + u.nodeId(this.selected_node) + ":" + this.selected_node._x);

				// fade up
//				u.a.transition(this.selected_node, "all 1s ease-in");
				u.a.setOpacity(this.selected_node, 1);
				if(typeof(this.nodeEntered) == "function") {
					this.nodeEntered();
				}

			}
			// we already have a node shown
			// needs to handle both swipe and click selects, so needs to be able to move correctly from current position
			else {

				// already shown node
				var org_node = this.selected_node;

				// what is exit direction - always 1 (left) or -1 (right)
				this.direction = (index - org_node.i) > 0 ? 1 : -1;

				// correct index
				if(index < 0) {
					index = this.nodes.length-1;
				}
				else if(index >= this.nodes.length) {
					index = 0;
				}



				// set new selected node
				this.selected_node = this.nodes[index];

				
				u.as(org_node, "display", "block");
				u.as(this.selected_node, "display", "block");

// 				// org node exited
// 				this.selected_node.transitioned = function(event) {
//					u.bug("node exited")
// 
// 					this.transitioned = null;
// 					u.a.transition(this, "none");
// 				}

				// hard update - no transitions 
				// (when doing updates while hidden, IE when gallery is in fullscreen mode and index in page below needs updating)
				if(static_update) {
					u.a.transition(org_node, "none");
					u.a.transition(this.selected_node, "none");

				}
				else if(this.swiped) {
					// calculate time based on remaining distance

					var duration;
					// adjust for speed, best visual correction
					if(this.current_xps) {
				 		duration = ((this.slide_width / Math.abs(this.current_xps)) * this.transition_time);
						duration = duration > this.transition_time ? this.transition_time : duration;
					}
					// adjust for time
					else {
						duration = this.transition_time / (1 - Math.abs(this.current_x / this.slide_width));
					}

					u.a.transition(org_node, "all " + duration + "s " + this.transition_type);
					u.a.transition(this.selected_node, "all " + duration + "s " + this.transition_type);


					this.selected_node.transitioned = function() {
						this.transitioned = null;
						u.a.transition(this, "none");

						if(typeof(this.nodeEntered) == "function") {
							this.nodeEntered();
						}

						// transition is done - set display=none on all unused slides
						this.gallery.minimizeLoad();
					}

				}
				else {
//					u.bug("clicked controls")

					// get selected node ready for entering
					u.a.transition(this.selected_node, "none");
					u.a.translate(this.selected_node, this.slide_width*this.direction, 0);

					// selected_node and org_node move transition
					u.a.transition(org_node, "all " + this.transition_time + "s " + this.transition_type);
					u.a.transition(this.selected_node, "all " + this.transition_time + "s " + this.transition_type);

					this.selected_node.transitioned = function() {
						this.transitioned = null;
						u.a.transition(this, "none");

						if(typeof(this.nodeEntered) == "function") {
							this.nodeEntered();
						}

						// transition is done - set display=none on all unused slides
						this.gallery.minimizeLoad();
					}

				}

				u.a.translate(org_node, -(this.slide_width*this.direction), 0);
				u.a.translate(this.selected_node, 0, 0);

			}

			// load selected node
			this.nodeLoad(this.selected_node);

			// load next and prev node
			if(this.nextNode(this.selected_node)) {
				this.nodeLoad(this.nextNode(this.selected_node));
			}
			if(this.prevNode(this.selected_node)) {
				this.nodeLoad(this.prevNode(this.selected_node));
			}

			// update controls state
			this.updateControls();

			// callback 
			if(typeof(this.nodeSelected) == "function") {
				this.nodeSelected(this.selected_node);
			}

		}

		gallery.nextNode = function(node) {
//			u.bug(this.nodes.length + ":" + node.i + ":" + (node.i+1))
			if(this.endless) {
				if(this.nodes.length > node.i+1) {
					return this.nodes[node.i+1];
				}
				else {
					return this.nodes[0];
				}
			}
			else {
				if(this.nodes.length > node.i+1) {
					return this.nodes[node.i+1];
				}
				else {
					return false;
				}
			}

		}
		gallery.prevNode = function(node) {
//			u.bug(this.nodes.length + ":" + node.i + ":" + (node.i-1))
			if(this.endless) {
				if(0 <= node.i-1) {
					return this.nodes[node.i-1];
				}
				else {
					return this.nodes[this.nodes.length-1];
				}
			}
			else {
				if(0 <= node.i-1) {
					return this.nodes[node.i-1];
				}
				else {
					return false;
				}
			}
		}

		if(gallery.nodes.length) {

			gallery._loading();

			// // loop through nodes for initial setup
			for(i = 0; node = gallery.nodes[i]; i++) {
				node.gallery = gallery;
				node.i = i;

				// default hide all stories, by placing them out of sight
				// make sure they are displayed block, so calculations onwards are correct
				u.a.transition(node, "none");
				u.a.translate(node, node.gallery.slide_width, 0);
				u.as(node, "display", "none");
			}

			// load first node to trigger init flow
			gallery.nodeLoad(gallery.nodes[gallery.start_at]);
		}



//		return gallery;
	}
}