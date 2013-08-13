Util.Objects["contact"] = new function() {
	this.init = function(scene) {

		// page reference
		var page = u.qs("#page");
		// let page know which scene is active
		page.scene = scene;
		scene.page = page;

		// called from orientationchange to save local settings before refreshing
		scene.resetScene = function() {

			// remember anything for reload?

		}

		scene.setHeight = function() {
			u.a.setHeight(this, this.page.offsetHeight);
		}
		scene.setHeight();

		// scene enter sequence
		scene.enter = function() {

			var vcard = u.qs(".vcard", this);
			u.a.transition(vcard, this.page._gentrans_);
			u.a.setOpacity(vcard, 1);
		}

		scene.ready = function() {

			this.initiated = true;

			// show when ready
			this.page.cN.ready();
		}

		// content ready
		scene.ready();
	}
}
