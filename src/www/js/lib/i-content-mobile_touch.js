Util.Objects["list"] = new function() {
	this.init = function(scene) {

		// page reference
		var page = u.qs("#page");

		// let page know which scene is active
		page.scene = scene;
		scene.page = page;

		// called from orientationchange to save local settings before refreshing
		scene.resetScene = function() {

			// remember anything for reload?
			
			// which image is shown
//			u.bug("selected_node:" + u.nodeId(this.selected_node))
			if(this.selected_node) {
				this.page._content_start_at = this.selected_node.i;
				this.page._content_navigation_hidden = u.hc(this.page.hN, "hidden");
			}
		}

		scene.setHeight = function() {
			u.a.setHeight(this, this.page.offsetHeight);
		}
		scene.setHeight();

//		scene.t_hide = false;

		// scene enter sequence
		scene.enter = function() {
//			u.bug("list enter")

			u.e.click(this);
			this.clicked = function(event) {

				if(u.hc(this.page.hN, "hidden")) {
					u.rc(this.page.hN, "hidden");

					u.as(this.page.hN, "display", "block");
					u.a.transition(this.page.hN, "all 0.5s ease-out");
					u.a.setOpacity(this.page.hN, 1);

					u.as(this.controls, "display", "block");
					u.a.transition(this.controls, "all 0.5s ease-out");
					u.a.setOpacity(this.controls, 1);
				}
				else {
					u.ac(this.page.hN, "hidden");

					this.page.hN.transitioned = function() {
						u.a.transition(this, "none");
						this.transitioned = null;
						u.as(this, "display", "none");
					}
					if(u.gcs(this.page.hN, "opacity") != 0) {
						u.a.transition(this.page.hN, "all 0.4s ease-out");
						u.a.setOpacity(this.page.hN, 0);
					}
					else {
						this.page.hN.transitioned();
					}

					this.controls.transitioned = function() {
						u.a.transition(this, "none");
						this.transitioned = null;
						u.as(this, "display", "none");
					}
					if(u.gcs(this.controls, "opacity") != 0) {
						u.a.transition(this.controls, "all 0.4s ease-out");
						u.a.setOpacity(this.controls, 0);
					}
					else {
						this.controls.transitioned();
					}
				}

				// hide controls
//				this.clicked();

//				this.t_hide = u.t.setTimer(this, this.hide, 2000);
			}

			// hidden from orientationchange or autohide
//			 && !u.hc(this, "hidden")
			if(this.page._content_navigation_hidden || this.page._content_navigation_hidden === undefined) {
				this.page._content_navigation_hidden = undefined;
				this.clicked();
			}
			
			// this.page.hN.onmouseover = function(){
			// 	u.t.resetTimer(this.page.scene.t_hide);
			// }
			// this.page.hN.onmouseout = function(){
			// 	this.page.scene.t_hide = u.t.setTimer(this.page.scene, this.page.scene.hide, 2000);
			// }

			// var i, node;
			// var nodes = u.qsa("li", this.list);
		}

		// scene.hide = function() {
		// 	u.a.transition(this.page.hN, "all 1s ease-out");
		// 	u.a.setOpacity(this.page.hN, 0);
		// }



		// list items ready - enable drag
		scene.ready = function() {

			// not ready or already initiated
			if(!this.initiated) {
//				u.bug("content is ready")


				this.initiated = true;

				// show when ready
				this.page.cN.ready();

			}
		}

		// check for position from onorentationchange refreshes
		if(scene.page._content_start_at) {
			scene.start_at = scene.page._content_start_at;
			scene.page._content_start_at = false;
		}

		// gallery is not endless
		scene.endless = false;

		u.o.gallery.init(scene);

	}
}
