u.bug_force = true;


Util.Objects["page"] = new function() {
	this.init = function(page) {
//		u.bug("init page")
		var node, i;

		page._gentrans_ = "all 0.4s ease-in";

		// manual base initialization, remove i:page
		u.rc(page, "i:page");

		// redraw page if orientation changes
		u.e.addEvent(page, "orientationchange", function(event){u.qs("#content").navigate()});

		// disable drag on page level
		u.e.drag(page, page);

		// set timer with escape route, if user accidentially reached wrong segment
		page.t_escape = u.t.setTimer(this, this.escape, 10000);


		// index page
		// header
		page.hN = u.qs("#header", page);
		page.hN.page = page;

		// page.nav = u.ae(page.hN, "div", {"class":"navigation i:navigation"});
		// page.sN = u.ae(page.nav, u.qs(".servicenavigation", page.hN));

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


		// page is ready, fade in
		page.ready = function() {
//			u.bug("page is ready")


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

			// handle oad-response when returned after load and fade back in
			this.response = function(response) {
//				u.bug("navigate response")

				// set body class
				u.setClass(document.body, response.body_class);

				// replace content
				this.innerHTML = u.qs("#content", response).innerHTML;

				// set title
				document.title = response.head_title;



				// init content - will callback to ready, when done
				u.init(this);

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
				this.style.backgroundImage = "url("+event.target.src+")";
				// fade up
				u.a.setOpacity(this, 1);
			}
		}
		// no splash info, just show name
		else {
			pageintro.innerHTML = "<h1>Photographer David Perrin</h1>";
			u.a.setOpacity(pageintro, 1);
		}

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






// // show interaction hints when appropriate
// page.cN.hint = function() {
// 	// set start hint timer
// 	if(!this.page.t_hint) {
// 		this.page.t_hint = u.t.setTimer(this, this.hint, 5000);
// 	}
// 	// show hint a
// 	else if(!this.hint_a) {
// 		// inject hint a
// 		this.hint_a = u.ae(u.qs("#content"), "div", {"class":"hint_a"});
// 		this.hint_a.innerHTML = ">";
// 		// fade in
// 		u.a.transition(this.hint_a, "all 0.5s ease-in");
// 		u.a.setOpacity(this.hint_a, 0.6);
// 
// 		// set timer for hint b
// 		this.page.t_hint = u.t.setTimer(this, this.hint, 2000);
// 	}
// 	// show hint b
// 	else if(!this.hint_b) {
// 		var ul = u.qs("ul", this);
// 		u.a.transition(ul, "all 0.2s ease-in");
// 		u.a.translate(ul, -50, 0);
// 		ul.transitioned = function(event) {
// 			this.transitioned = null;
// 			u.a.transition(this, "all 0.2s ease-out");
// 			u.a.translate(this, 0, 0);
// 		}
// 	}
// }
// 
// // cancel hint sequence
// page.cN.cancelHint = function() {
// 
// 	// reset any existing hint timers
// 	this.page.t_hint = u.t.resetTimer(this.page.t_hint);
// 
// 	// remove hint a if injected
// 	if(this.hint_a) {
// 		this.hint_a.transitioned = function(event) {
// 			this.parentNode.removeChild(this);
// 		}
// 		u.as(this.hint_a, "opacity", 0);
// 		this.page.hinted = true;
// 	}
// }
// page.hinted = false;

