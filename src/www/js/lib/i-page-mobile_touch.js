u.bug_force = true;


Util.Objects["page"] = new function() {
	this.init = function(page) {
//		u.bug("init page:" + window.orientation)
		var node, i;

		page._gentrans_ = "all 0.4s ease-in";

		// manual base initialization, remove i:page
		u.rc(page, "i:page");

		page._orientationchange = function(event) {
//			u.xInObject(event);

//			u.bug("this:" + this.orientation);
//			alert((this.orientation == 90 || this.orientation == 270) ? "landscape" : "portrait");

//			page.transitioned = function() {
//				this.transitioned = null;
// 				u.a.transition(this, "none");
// 
// 				u.a.setHeight(this, 2000);
// 				window.scrollTo(0, 0);
// 				var h = (this.orientation == 90 || this.orientation == 270) ? window.innerWidth : window.innerHeight;
// 				if(u.hc(document.body, "front")) {
// 					h = h < this.cN.offsetHeight ? this.cN.offsetHeight : h;
// 				}
// //				u.bug("set height:" + h)
// 				u.a.setHeight(this, h);
//			}

			// hide content to minimize flickering
			u.a.transition(page.cN, "none");
			u.a.setOpacity(page.cN, 0);


			page.scrollToTop();

			if(typeof(page.scene.resetScene) == "function") {
				page.scene.resetScene();
			}

			page.cN.navigate();
			// if(u.hc(document.body, "front")) {
			// 	page.cN.navigate();
			// }

//			page.transitioned();

			// // show content
			// if(u.gcs(this, "opacity") == 0) {
			// 	this.transitioned();
			// }
			// else {
			// 	u.a.transition(this, this.page._gentrans_);
			// 	u.a.setOpacity(this, 0);
			// }
		}
		// redraw page if orientation changes
		u.e.addEvent(page, "orientationchange", page._orientationchange);

		// disable drag on page level
//		u.e.drag(page, page);

		// set timer with escape route, if user accidentially reached wrong segment
		page.t_escape = u.t.setTimer(this, this.escape, 10000);


		// index page
		// header
		page.hN = u.qs("#header", page);
		page.hN.page = page;

		page.nav = u.ae(page.hN, "div", {"class":"navigation i:navigation"});
		u.ae(page.nav, "div", {"class":"gx"});

		page.sN = u.ae(page.nav, u.qs(".servicenavigation", page.hN));

		// content
		page.cN = u.qs("#content", page);
		page.cN.page = page;

		// footer
		page.fN = u.qs("#footer", page);
		page.fN.page = page;

		// navigation
		page.nN = u.qs("#navigation", page);
		page.nN = u.ae(page.nav, page.nN);
		page.nN.page = page;


		// // set home link
		page._h1 = u.qs("h1", page.hN);
		page._h1.url = u.qs(".servicenavigation .front a", page).href;
		u.e.click(page._h1);
		page._h1.clicked = function(event) {
			location.hash = u.h.cleanHash(this.url);
		}

		// TODO: What crashes iphone
		// TODO: Content limit?

		// TODO: Make endless loop in gallery optional
		// TODO: use background-size to show entire image - set class "landscape" or "portrait" on node, when image is loaded

		page.scrollToTop = function(source) {
//			u.bug("scroll to top:" + source);

//			u.t.resetTimer(this.t_scroll);
			u.a.setHeight(this, 2000);

//			u.bug(u.gcs(this, "height"));
			window.scrollTo(0, 0);
//			var h = (window.orientation == 90 || window.orientation == 270) ? window.innerWidth : window.innerHeight;

			this.resetHeight = function() {
				window.scrollTo(0, 0);

				var h = window.innerHeight;

				// if(u.hc(document.body, "front")) {
				// 	h = h < this.cN.offsetHeight ? this.cN.offsetHeight : h;
				// }
				if(this.offsetHeight != h) {
//					u.bug("reset height:" + u.nodeId(this) + ", " + u.gcs(this, "height") + " =>" + h);

					u.a.setHeight(this, h);
					if(this.scene && typeof(this.scene.setHeight) == "function") {
						this.scene.setHeight();
					}
				}

			}
			this.t_scroll = u.t.setTimer(this, this.resetHeight, 200);
		}
		//page.t_scroll = u.t.setTimer(page, page.scrollToTop, 1000);


		// // set header link
		page._h1 = u.qs("h1", page.hN);
		page._h1.url = u.qs(".servicenavigation .front a", page).href;
		u.e.click(page._h1);
		page._h1.clicked = function(event) {
			location.hash = u.h.cleanHash(this.url);
		}
		page._h1.moved = function(event) {
			u.e.resetEvents(this);
		}

		// set contact link
		page.contact = u.qs(".servicenavigation .contact", page);
		u.ce(page.contact);
		page.contact.clicked = function(event) {
			location.hash = u.h.cleanHash(this.url);
			u.e.kill(event);
		}
		page.contact.moved = function(event) {
			u.e.resetEvents(this);
		}
		// set home link
		page.home = u.qs(".servicenavigation .front", page);
		u.ce(page.home);
		page.home.clicked = function(event) {
			location.hash = u.h.cleanHash(this.url);
			u.e.kill(event);
		}
		page.home.moved = function(event) {
			u.e.resetEvents(this);
		}


		// page is ready, fade in
		page.ready = function() {
//			u.bug("page is ready")

//			this.scrollToTop("page.ready");

			// if(u.segment && u.segment == "mobile_touch") {
			// 	window.scrollTo(0, 0);
			// }

			// enable hash change navigation detection
			u.h.catchEvent(this.cN.navigate, this.cN);

			this.transitioned = function() {
				this.transitioned = null;
				u.a.transition(this, "none");

				u.ac(this, "ready");

				// in case content loads faster than intro exits, call content ready controller
				this.cN.ready();
			}


			if(u.gcs(this, "opacity") == 1) {
				this.transitioned();
			}
			else {
				// fade page up
				u.a.transition(this, this._gentrans_); // creates a blink
				u.a.setOpacity(this, 1);
			}

		}


		// content state controller
		page.cN.ready = function() {
//			u.bug("cN is ready")

			this.page.scrollToTop("cN.ready");

			// if all is good and ready to go
			if(u.hc(this.page, "ready")) {

				// if content is not ready
				if(!u.hc(this, "ready") && this.page.scene && this.page.scene.initiated) {

					this.transitioned = function() {
						this.transitioned = null;
						u.a.transition(this, "none");

						u.ac(this, "ready");

						// callback to scene enter after content is shown
						if(this.page.scene && typeof(this.page.scene.enter) == "function") {
							this.page.scene.enter();
						}
					}

					// show content
					if(u.gcs(this, "opacity") == 1) {
						this.transitioned();
					}
					else {
						u.a.transition(this, this.page._gentrans_);
						u.a.setOpacity(this, 1);
					}
				}

				// set selected navigation manually
				var nodes = u.qsa("li", this.page.hN);
				for(i = 0; node = nodes[i]; i++) {
//					u.bug("sel:" + location.hash.replace("#", "") + ":" + node.url.replace(location.protocol + "//" + document.domain, ""))
					if(node.url && node.url.replace(location.protocol + "//" + document.domain, "") == location.hash.replace("#", "")) {
						u.ac(node, "selected");
					}
					else {
						u.rc(node, "selected");
					}
				}


			}
		}


		// navigation - uses HASH to identify selected node
		page.cN.navigate = function() {

			if(this.page.scene && typeof(this.page.scene.keycuts) == "function") {
//				u.bug("remove keycuts" + u.nodeId(this.page.scene));
				u.e.removeEvent(document.body, "keyup", this.page.scene.keycuts);
			}

			u.as(this.page.hN, "display", "block");
			u.rc(this.page.hN, "hidden");
			u.a.transition(this.page.hN, "none");
			u.a.setOpacity(this.page.hN, 1);

			// if(this.page.hN.t_hide) {
			// 	u.t.resetTimer(this.page.hN.t_hide);
			// }
			// this.page.hN.onmouseout = null;
			// this.page.hN.onmouseout = null;

			// handle oad-response when returned after load and fade back in
			this.response = function(response) {
//				u.bug("navigate response")

				// set body class
				u.setClass(document.body, response.body_class);

				// replace content
				this.innerHTML = u.qs("#content", response).innerHTML;

				// set title
				document.title = response.head_title;

				this.page.scrollToTop("cN.response");


				// init content - will callback to ready, when done
				u.init(this);


// 				if(u.segment && u.segment == "mobile_touch") {
// 					// does not work with height set here - so it is set in CSS
// 					// u.as(page, "height", 2000 + "px");
// //					u.bug("scroll:" + u.nodeId(this.page))
// 
// 					window.scrollTo(0, 0);
// 					var h = window.innerHeight < this.page.cN.offsetHeight ? this.page.cN.offsetHeight : window.innerHeight;
// 					u.as(this.page, "height", h + "px");
// 
// 				}
			}

			// capture transition event and load new content, when fadeout is done
			this.transitioned = function(event) {
				u.a.transition(this, "none");
				this.transitioned = null;

//				u.bug("navigate request")
				u.request(this, location.hash.replace("#", ""));

			}

			// if fullscreen exists remove it
			if(u.qs("#fullscreen")) {
				u.qs("#fullscreen").back();
			}

			// reset hint timer on navigation change
//			this.cancelHint();

// 			if(u.segment && u.segment == "mobile_touch") {
// //				u.bug("set height:" + u.nodeId(this.page))
// 				// does not work with height set here - so it is set in CSS
// 				u.as(this.page, "height", 2000 + "px");
// 			}


			// if element is already faded out
			if(u.gcs(this, "opacity") == 0) {
				this.transitioned();
			}
			// start fade out transition
			else {
				u.a.transition(this, this.page._gentrans_);
				u.a.setOpacity(this, 0);
			}

			// content is not ready
			u.rc(this, "ready");
		}


		// remove addressbar on iphone - set too high page height, 
		// scroll to 0x0 and set page height to content height or actual page height depending of what is greater
//		page.scrollToTop("init");
		// does not work with height set here - so it is set in CSS
		// u.a.setHeight(page, 2000);
		// 
		// window.scrollTo(0, 0);
		// var h = window.innerHeight < page.cN.offsetHeight ? page.cN.offsetHeight : window.innerHeight;
		// u.a.setHeight(page, h);



		// intro splash
		// create splash node
		var pageintro = u.ae(document.body, "div", {"class":"pageintro"});
		pageintro.page = page;

		u.a.transition(pageintro, page._gentrans_);


		// look for splash info
		var pageintro_info = u.ge("pageintro:[0-9]+");
		if(pageintro_info) {
			// load splash image
			u.i.load(pageintro, "/images/"+u.cv(pageintro_info, "pageintro")+"/x"+page.offsetHeight+".jpg");
			pageintro.loaded = function(event) {

				// scroll to top - again (in case used has scrolled away)
//				this.page.scrollToTop("pageintro loaded");
//				window.scrollTo(0, 0);

				this.style.backgroundImage = "url("+event.target.src+")";
				// fade up
				u.a.setOpacity(this, 1);
			}
		}
		// no splash info, just show name
		else {
			pageintro.innerHTML = "<h1>Photographer David Perrin</h1>";
			u.a.setOpacity(pageintro, 1);

//			u.bug("opacity:" + u.gcs(pageintro, "opacity"));

//			window.scrollTo(0, 0);
		}
//		page.scrollToTop("pageintro before show");

		// enable exit
		u.e.click(pageintro);
		pageintro.clicked = function(event) {
			u.t.resetTimer(this.t_hide);

			// remove element when transitioned
			this.transitioned = function(event) {
				this.parentNode.removeChild(this);
				u.qs("#page").ready();
			}

			if(u.gcs(this, "opacity") == 0) {
				this.transitioned();
			}
			else {
				// fade page intro out
				u.a.transition(this, this.page._gentrans_);
				u.a.setOpacity(this, 0);
			}

		}
		// fade out splash after 5 seconds
		pageintro.t_hide = u.t.setTimer(pageintro, pageintro.clicked, 3000);



		// start initialization process - all required setup must be complete  before this step
		// set default hash
		if(location.hash.length < 2) {
			location.hash = u.h.cleanHash(location.href);
			u.init(page.cN);
		}
		// if different hash and url, load content
		else if(location.hash != "#"+u.h.cleanHash(location.href.split("#")[0])) {
			page.cN.navigate();
		}
		// init content
		else {
			u.init(page.cN);
		}


		// reset escape timer
		u.t.resetTimer(page.t_escape);
	}

	// escape route
	this.escape = function() {
		document.body.innerHTML = '<div id="error"><div class="wrap"><a href="/">An error ocurred - Please reload page</a><br /><br /><a href="/help" class="smaller">I already tried reloading. Help me!</a></div></div>';
	}
}

function static_init() {
	u.o.page.init(u.qs("#page"));
}
//u.e.addDOMReadyEvent(u.init);
u.e.addDOMReadyEvent(static_init);



