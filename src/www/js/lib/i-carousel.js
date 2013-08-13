Util.Objects["carousel"] = new function() {
	this.init = function(carousel) {
//		u.bug("carousel:" + u.nodeId(carousel));

		u.e.drag(carousel.list, [carousel.offsetWidth - carousel.list.offsetWidth, 0, carousel.list.offsetWidth, carousel.list.offsetHeight], {"strict":false, "elastica":250});

		// insert arrows for mouse users
		if(u.e.event_pref == "mouse") {

			carousel.list.carousel = carousel;

//			carousel.list.mouse_acceleration = 0;
//			carousel.list.mouse_direction = 0;

			//this.list.moved = 
			carousel.list.dropped = carousel.list.projected = function() {
				this.update();
			}

			// update position
			carousel.list.update = function(next_x) {
//				u.bug("update:" + next_x);

				var new_pos = !isNaN(next_x) ? next_x : this._x;

				if(new_pos >= 0) {
					new_pos = 0;

					u.a.transition(this.controls.bn_left, "all 0.2s ease-in");
					u.a.setOpacity(this.controls.bn_left, 0);

					// u.t.resetInterval(this.t_arrow_down);
					// u.t.resetTimer(this.t_arrow_up);
				}
				else {
					u.a.transition(this.controls.bn_left, "all 0.2s ease-in");
					u.a.setOpacity(this.controls.bn_left, 1);
				}


				if(new_pos <= this.start_drag_x) {
					new_pos = this.start_drag_x;

					u.a.transition(this.controls.bn_right, "all 0.2s ease-in");
					u.a.setOpacity(this.controls.bn_right, 0);

					// u.t.resetInterval(this.t_arrow_down);
					// u.t.resetTimer(this.t_arrow_up);
				}
				else {
					u.a.transition(this.controls.bn_right, "all 0.2s ease-in");
					u.a.setOpacity(this.controls.bn_right, 1);
				}


				if(new_pos != this._x) {
					u.a.transition(this, "all 0.4s linear");
					u.a.translate(this, new_pos, 0);
				}

			}
// 
// 			// accelerate - while mouse is pressed
// 			carousel.list.accelerate = function() {
// //				u.bug("acceleration:" + this.mouse_direction * this.mouse_acceleration);
// 
// 				this.mouse_acceleration += 1;
// 				this.update();
// 			}
// 
// 			// deccelerate - when mouse is released
// 			carousel.list.deccelerate = function() {
// 				u.t.resetTimer(this.t_arrow_up);
// 
// 				// as long as there is still acceleration
// 				if(this.mouse_acceleration > 1) {
// //					u.bug("deccelerate");
// 
// 					this.mouse_acceleration = this.mouse_acceleration/1.3;
// 					this.update();
// 
// 					this.t_arrow_up = u.t.setTimer(this, this.deccelerate, 50);
// 				}
// 
// 				else {
// //					u.bug("decceleration done");
// 
// 					this.mouse_direction = 0;
// 					this.mouse_acceleration = 0;
// 
// 					u.t.resetTimer(this.t_arrow_up);
// 					u.t.resetInterval(this.t_arrow_down);
// 				}
// 			}
// 
// 			carousel.list.t_arrow_up = false;
// 			carousel.list.t_arrow_down = false;

			carousel.list.controls = u.ae(carousel, "div", {"class":"controls"});
			carousel.list.controls.bn_right = u.ae(carousel.list.controls, "div", {"class":"right"});
			carousel.list.controls.bn_right.list = carousel.list;
			carousel.list.controls.bn_left = u.ae(carousel.list.controls, "div", {"class":"left"});
			carousel.list.controls.bn_left.list = carousel.list;

			carousel.list.update();

			u.e.click(carousel.list.controls.bn_right);
			
			u.e.click(carousel.list.controls.bn_left);

			// deccelerate on release or mouseout
			carousel.list.controls.bn_right.clicked = function(event) {
//				u.bug("bn_right.clicked");

//				u.bug("offsetWidth:" + this.list.offsetWidth + ", _x:" + this.list._x + ", carousel.offsetWidth:" + this.list.carousel.offsetWidth);

				view_start = -(this.list._x);
				view_end = view_start + this.list.carousel.offsetWidth;

				var i, node;
				var first_in_view = false;
				var last_in_view = false;
				var next, prev;

				var nodes = u.qsa("li", this.list);
				for(i = 0; node = nodes[i]; i++) {

					if(node.offsetLeft >= view_start && !first_in_view) {
						first_in_view = node;
					}
					if(first_in_view && (node.offsetLeft + node.offsetWidth) < view_end) {
						last_in_view = node;
					}

//					u.bug("node "+i+":" + node.offsetLeft + "," + node.image.width);
				}

//				u.bug(u.nodeId(last_in_view));
				if(last_in_view) {
					next = u.ns(last_in_view);
					if(next) {
						next_x = -(next.offsetLeft);
					}
					else {
						next_x = -(last_in_view.offsetLeft + last_in_view.offsetWidth - this.list.carousel.offsetWidth);
					}
				}
				else if(first_in_view) {
					next_x = -(first_in_view.offsetLeft);
				}
				else {
					next_x = (this.list.offsetWidth - this.list.carousel.offsetWidth);
				}
//				u.bug("result:" + u.nodeId(first_in_view) + "," + u.nodeId(last_in_view))


				this.list.update(next_x);

			}

			// = carousel.list.controls.bn_right.onmouseout = 
			// = carousel.list.controls.bn_left.onmouseout
			carousel.list.controls.bn_left.clicked = function(event) {
//				u.bug("bn_left.clicked");

				view_start = -(this.list._x);
				view_end = view_start + this.list.carousel.offsetWidth;

				var i, node;
				var first_in_view = false;
				var last_in_view = false;
				var next_x, prev;

				var nodes = u.qsa("li", this.list);
				for(i = 0; node = nodes[i]; i++) {

					if(node.offsetLeft >= view_start && !first_in_view) {
						first_in_view = node;
					}
					if(first_in_view && (node.offsetLeft + node.offsetWidth) < view_end) {
						last_in_view = node;
					}

//					u.bug("node "+i+":" + node.offsetLeft + "," + node.image.width);
				}
//				u.bug("first_in_view:" + u.nodeId(first_in_view) + ", last_in_view:" + u.nodeId(last_in_view))

				prev = first_in_view;
				prev_width = 0;
//				u.bug("prev:" + u.nodeId(prev) + ", prev_width:" + prev_width);

				while(prev && prev_width + prev.offsetWidth <= this.list.carousel.offsetWidth) {
					prev_width = prev_width + prev.offsetWidth;
					prev = u.ps(prev);
//					u.bug("prev:" + u.nodeId(prev) + ", prev_width:" + prev_width);
				}

				if(prev) {
					next_x = -(prev.offsetLeft);
				}
				else {
					next_x = 0;
				}

				this.list.update(next_x);


				// u.t.resetTimer(this.list.t_arrow_up);
				// u.t.resetInterval(this.list.t_arrow_down);
				// 
				// this.list.deccelerate();
			}



			// set keyboard shortcuts
			carousel.keycuts = function(event) {
//				u.bug("event.keyCode:" + event.keyCode);

				// ESC
				if(event.keyCode == 27) {
					u.e.kill(event);
					if(u.qs("#fullscreen")) {
						u.qs("#fullscreen .close").clicked(event);
					}
				}
				// prev
				if(event.keyCode == 37) {
					u.e.kill(event);
					if(u.qs("#fullscreen")) {
						u.qs("#fullscreen .left").clicked(event);
					}
					else {
						u.qs("#content .left").clicked(event);
					}
				}
				// next
				if(event.keyCode == 39) {
					u.e.kill(event);
					if(u.qs("#fullscreen")) {
						u.qs("#fullscreen .right").clicked(event);
					}
					else {
						u.qs("#content .right").clicked(event);
					}
				}
			}
			u.e.addEvent(document.body, "keyup", carousel.keycuts);

		}
		
	}
}
