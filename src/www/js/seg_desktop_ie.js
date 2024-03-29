
if(!u || !Util) {
	var u, Util = u = new function() {}
	u.version = 7;
	u.bug = function() {}
	u.stats = new function() {this.pageView = function(){};this.event = function(){};this.customVar = function(){}}
}
Util.debugURL = function(url) {
	if(u.bug_force) {
		return true;
	}
	return document.domain.match(/.local$/);
}
Util.nodeId = function(node, include_path) {
	try {
		if(!include_path) {
			return node.id ? node.nodeName+"#"+node.id : (node.className ? node.nodeName+"."+node.className : (node.name ? node.nodeName + "["+node.name+"]" : node.nodeName));
		}
		else {
			if(node.parentNode && node.parentNode.nodeName != "HTML") {
				return u.nodeId(node.parentNode, include_path) + "->" + u.nodeId(node);
			}
			else {
				return u.nodeId(node);
			}
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.nodeId("+node+"), called from: "+arguments.callee.caller);
	}
	return "Unindentifiable node!";
}
Util.bug = function(message, corner, color) {
	if(u.debugURL()) {
		if(!u.bug_console_only) {
			var option, options = new Array([0, "auto", "auto", 0], [0, 0, "auto", "auto"], ["auto", 0, 0, "auto"], ["auto", "auto", 0, 0]);
			if(isNaN(corner)) {
				color = corner;
				corner = 0;
			}
			if(typeof(color) != "string") {
				color = "black";
			}
			option = options[corner];
			if(!u.qs("#debug_id_"+corner)) {
				var d_target = u.ae(document.body, "div", {"class":"debug_"+corner, "id":"debug_id_"+corner});
				d_target.style.position = u.bug_position ? u.bug_position : "absolute";
				d_target.style.zIndex = 16000;
				d_target.style.top = option[0];
				d_target.style.right = option[1];
				d_target.style.bottom = option[2];
				d_target.style.left = option[3];
				d_target.style.backgroundColor = u.bug_bg ? u.bug_bg : "#ffffff";
				d_target.style.color = "#000000";
				d_target.style.textAlign = "left";
				if(d_target.style.maxWidth) {
					d_target.style.maxWidth = u.bug_max_width ? u.bug_max_width+"px" : "auto";
				}
				d_target.style.padding = "3px";
			}
			if(typeof(message) != "string") {
				message = message.toString();
			}
			u.ae(u.qs("#debug_id_"+corner), "div", ({"style":"color: " + color})).innerHTML = message ? message.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/&lt;br&gt;/g, "<br>") : "Util.bug with no message?";
		}
		if(typeof(console) == "object") {
			console.log(message);
		}
	}
}
Util.xInObject = function(object) {
	if(u.debugURL()) {
		var x, s = "--- start object ---<br>";
		for(x in object) {
			if(object[x] && typeof(object[x]) == "object" && typeof(object[x].nodeName) == "string") {
				s += x + "=" + object[x]+" -> " + u.nodeId(object[x], 1) + "<br>";
			}
			else if(object[x] && typeof(object[x]) == "function") {
				s += x + "=function<br>";
			}
			else {
				s += x + "=" + object[x]+"<br>";
			}
		}
		s += "--- end object ---"
		u.bug(s);
	}
}
Util.Animation = u.a = new function() {
	this.support3d = function() {
		if(this._support3d === undefined) {
			var node = document.createElement("div");
			try {
				var test = "translate3d(10px, 10px, 10px)";
				node.style[this.variant() + "Transform"] = test;
				if(node.style[this.variant() + "Transform"] == test) {
					this._support3d = true;
				}
				else {
					this._support3d = false;
				}
			}
			catch(exception) {
				this._support3d = false;
			}
		}
		return this._support3d;
	}
	this.variant = function() {
		if(this._variant === undefined) {
			if(document.body.style.webkitTransform != undefined) {
				this._variant = "webkit";
			}
			else if(document.body.style.MozTransform != undefined) {
				this._variant = "Moz";
			}
			else if(document.body.style.oTransform != undefined) {
				this._variant = "o";
			}
			else if(document.body.style.msTransform != undefined) {
				this._variant = "ms";
			}
			else {
				this._variant = "";
			}
		}
		return this._variant;
	}
	this.transition = function(node, transition) {
		try {
			node.style[this.variant() + "Transition"] = transition;
			if(this.variant() == "Moz") {
				u.e.addEvent(node, "transitionend", this._transitioned);
			}
			else {
				u.e.addEvent(node, this.variant() + "TransitionEnd", this._transitioned);
			}
			var duration = transition.match(/[0-9.]+[ms]+/g);
			if(duration) {
				node.duration = duration[0].match("ms") ? parseFloat(duration[0]) : (parseFloat(duration[0]) * 1000);
			}
			else {
				node.duration = false;
			}
		}
		catch(exception) {
			u.bug("Exception ("+exception+") in u.a.transition(" + u.nodeId(node) + "), called from: "+arguments.callee.caller);
		}
	}
	this._transitioned = function(event) {
		if(event.target == this && typeof(this.transitioned) == "function") {
			this.transitioned(event);
		}
	}
	this.translate = function(node, x, y) {
		if(this.support3d()) {
			node.style[this.variant() + "Transform"] = "translate3d("+x+"px, "+y+"px, 0)";
		}
		else {
			node.style[this.variant() + "Transform"] = "translate("+x+"px, "+y+"px)";
		}
		node._x = x;
		node._y = y;
		node.offsetHeight;
	}
	this.rotate = function(node, deg) {
		node.style[this.variant() + "Transform"] = "rotate("+deg+"deg)";
		node._rotation = deg;
		node.offsetHeight;
	}
	this.scale = function(node, scale) {
		node.style[this.variant() + "Transform"] = "scale("+scale+")";
		node._scale = scale;
		node.offsetHeight;
	}
	this.setOpacity = function(node, opacity) {
		node.style.opacity = opacity;
		node._opacity = opacity;
		node.offsetHeight;
	}
	this.setWidth = function(node, width) {
		width = width.toString().match(/\%|auto|px/) ? width : (width + "px");
		node.style.width = width;
		node._width = width;
		node.offsetHeight;
	}
	this.setHeight = function(node, height) {
		height = height.toString().match(/\%|auto|px/) ? height : (height + "px");
		node.style.height = height;
		node._height = height;
		node.offsetHeight;
	}
	this.setBgPos = function(node, x, y) {
		x = x.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? x : (x + "px");
		y = y.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? y : (y + "px");
		node.style.backgroundPosition = x + " " + y;
		node._bg_x = x;
		node._bg_y = y;
		node.offsetHeight;
	}
	this.setBgColor = function(node, color) {
		node.style.backgroundColor = color;
		node._bg_color = color;
		node.offsetHeight;
	}
}
Util.saveCookie = function(name, value, options) {
	expiry = false;
	path = false;
	if(typeof(options) == "object") {
		var argument;
		for(argument in options) {
			switch(argument) {
				case "expiry"	: expiry	= (typeof(options[argument]) == "string" ? options[argument] : "Mon, 04-Apr-2020 05:00:00 GMT"); break;
				case "path"		: path		= options[argument]; break;
			}
		}
	}
	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +";" + (path ? "path="+path+";" : "") + (expiry ? "expires="+expiry+";" : "")
}
Util.getCookie = function(name) {
	var matches;
	return (matches = document.cookie.match(encodeURIComponent(name) + "=([^;]+)")) ? decodeURIComponent(matches[1]) : false;
}
Util.deleteCookie = function(name, options) {
	path = false;
	if(typeof(options) == "object") {
		var argument;
		for(argument in options) {
			switch(argument) {
				case "path"	: path	= options[argument]; break;
			}
		}
	}
	document.cookie = encodeURIComponent(name) + "=;" + (path ? "path="+path+";" : "") + "expires=Thu, 01-Jan-70 00:00:01 GMT";
}
Util.saveNodeCookie = function(node, name, value) {
	var ref = u.cookieReference(node);
	var mem = JSON.parse(u.getCookie("wtf_mem"));
	if(!mem) {
		mem = {};
	}
	if(!mem[ref]) {
		mem[ref] = {};
	}
	mem[ref][name] = (value !== false && value !== undefined) ? value : "";
	u.saveCookie("wtf_mem", JSON.stringify(mem), {"path":"/"});
}
Util.getNodeCookie = function(node, name) {
	var ref = u.cookieReference(node);
	var mem = JSON.parse(u.getCookie("wtf_mem"));
	if(mem && mem[ref]) {
		if(name) {
			return mem[ref][name] ? mem[ref][name] : "";
		}
		else {
			return mem[ref];
		}
	}
	return false;
}
Util.deleteNodeCookie = function(node, name) {
	var ref = u.cookieReference(node);
	var mem = JSON.parse(u.getCookie("wtf_mem"));
	if(mem && mem[ref]) {
		if(name) {
			delete mem[ref][name];
		}
		else {
			delete mem[ref];
		}
	}
	u.saveCookie("wtf_mem", JSON.stringify(mem), {"path":"/"});
}
Util.cookieReference = function(node) {
	var ref;
	if(node.id) {
		ref = node.nodeName + "#" + node.id;
	}
	else {
		var id_node = node;
		while(!id_node.id) {
			id_node = id_node.parentNode;
		}
		if(id_node.id) {
			ref = id_node.nodeName + "#"+id_node.id + " " + (node.name ? (node.nodeName + "["+node.name+"]") : (node.className ? (node.nodeName+"."+node.className) : node.nodeName));
		}
	}
	return ref;
}
Util.date = function(format, timestamp, months) {
	var date = timestamp ? new Date(timestamp) : new Date();
	if(isNaN(date.getTime())) {
		if(!timestamp.match(/[A-Z]{3}\+[0-9]{4}/)) {
			if(timestamp.match(/ \+[0-9]{4}/)) {
				date = new Date(timestamp.replace(/ (\+[0-9]{4})/, " GMT$1"));
			}
		}
		if(isNaN(date.getTime())) {
			date = new Date();
		}
	}
	var tokens = /d|j|m|n|F|Y|G|H|i|s/g;
	var chars = new Object();
	chars.j = date.getDate();
	chars.d = (chars.j > 9 ? "" : "0") + chars.j;
	chars.n = date.getMonth()+1;
	chars.m = (chars.n > 9 ? "" : "0") + chars.n;
	chars.F = months ? months[date.getMonth()] : "";
	chars.Y = date.getFullYear();
	chars.G = date.getHours();
	chars.H = (chars.G > 9 ? "" : "0") + chars.G;
	var i = date.getMinutes();
	chars.i = (i > 9 ? "" : "0") + i;
	var s = date.getSeconds();
	chars.s = (s > 9 ? "" : "0") + s;
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};
Util.querySelector = u.qs = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelector(query);
}
Util.querySelectorAll = u.qsa = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelectorAll(query);
}
Util.getElement = u.ge = function(identifier, scope) {
	var node, i, regexp;
	if(document.getElementById(identifier)) {
		return document.getElementById(identifier);
	}
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			return node;
		}
	}
	return scope.getElementsByTagName(identifier).length ? scope.getElementsByTagName(identifier)[0] : false;
}
Util.getElements = u.ges = function(identifier, scope) {
	var node, i, regexp;
	var nodes = new Array();
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			nodes.push(node);
		}
	}
	return nodes.length ? nodes : scope.getElementsByTagName(identifier);
}
Util.parentNode = u.pn = function(node, node_type) {
	if(node_type) {
		if(node.parentNode) {
			var parent = node.parentNode;
		}
		while(parent.nodeName.toLowerCase() != node_type.toLowerCase()) {
			if(parent.parentNode) {
				parent = parent.parentNode;
			}
			else {
				return false;
			}
		}
		return parent;
	}
	else {
		return node.parentNode;
	}
}
Util.previousSibling = u.ps = function(node, exclude) {
	node = node.previousSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || exclude && (u.hc(node, exclude) || node.nodeName.toLowerCase().match(exclude)))) {
		node = node.previousSibling;
	}
	return node;
}
Util.nextSibling = u.ns = function(node, exclude) {
	node = node.nextSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || exclude && (u.hc(node, exclude) || node.nodeName.toLowerCase().match(exclude)))) {
		node = node.nextSibling;
	}
	return node;
}
Util.childNodes = u.cn = function(node, exclude) {
	var i, child;
	var children = new Array();
	for(i = 0; child = node.childNodes[i]; i++) {
		if(child && child.nodeType != 3 && child.nodeType != 8 && (!exclude || (!u.hc(child, exclude) && !child.nodeName.toLowerCase().match(exclude) ))) {
			children.push(child);
		}
	}
	return children;
}
Util.appendElement = u.ae = function(parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = parent.appendChild(node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute]
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.ae, called from: "+arguments.callee.caller.name);
		u.bug("node:" + u.nodeId(parent, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.insertElement = u.ie = function(parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = parent.insertBefore(node, parent.firstChild);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute];
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.ie, called from: "+arguments.callee.caller);
		u.bug("node:" + u.nodeId(parent, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.wrapElement = u.we = function(node, node_type, attributes) {
	try {
		var wrapper_node = node.parentNode.insertBefore(document.createElement(node_type), node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				wrapper_node.setAttribute(attribute, attributes[attribute]);
			}
		}	
		wrapper_node.appendChild(node);
		return wrapper_node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.we, called from: "+arguments.callee.caller);
		u.bug("node:" + u.nodeId(node, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.textContent = u.text = function(node) {
	return node.textContent;
}
Util.clickableElement = u.ce = function(node) {
	var a = (node.nodeName.toLowerCase() == "a" ? node : u.qs("a", node));
	if(a) {
		u.ac(node, "link");
		if(a.getAttribute("href") !== null) {
			node.url = a.href;
			a.removeAttribute("href");
		}
	}
	if(typeof(u.e.click) == "function") {
		u.e.click(node);
	}
	return node;
}
u.link = u.ce;
Util.classVar = u.cv = function(node, var_name) {
	try {
		var regexp = new RegExp(var_name + ":[?=\\w/\\#~:.?+=?&%@!\\-]*");
		if(node.className.match(regexp)) {
			return node.className.match(regexp)[0].replace(var_name + ":", "");
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.cv, called from: "+arguments.callee.caller);
	}
	return false;
}
u.getIJ = u.cv;
Util.setClass = u.sc = function(node, classname) {
	try {
		var old_class = node.className;
		node.className = classname;
		node.offsetTop;
		return old_class;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.setClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.hasClass = u.hc = function(node, classname) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)(" + classname + ")(\\s|$)");
			if(regexp.test(node.className)) {
				return true;
			}
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.hasClass("+u.nodeId(node)+"), called from: "+arguments.callee.caller);
	}
	return false;
}
Util.addClass = u.ac = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$)");
			if(!regexp.test(node.className)) {
				node.className += node.className ? " " + classname : classname;
				dom_update === false ? false : node.offsetTop;
			}
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.addClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.removeClass = u.rc = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(\\b)" + classname + "(\\s|$)", "g");
			node.className = node.className.replace(regexp, " ").trim().replace(/[\s]{2}/g, " ");
			dom_update === false ? false : node.offsetTop;
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.removeClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.toggleClass = u.tc = function(node, classname, _classname, dom_update) {
	try {
		var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
		if(regexp.test(node.className)) {
			u.rc(node, classname, false);
			if(_classname) {
				u.ac(node, _classname, false);
			}
		}
		else {
			u.ac(node, classname, false);
			if(_classname) {
				u.rc(node, _classname, false);
			}
		}
		dom_update === false ? false : node.offsetTop;
		return node.className;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.toggleClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.applyStyle = u.as = function(node, property, value, dom_update) {
	try {
		node.style[property] = value;
		dom_update === false ? false : node.offsetTop;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.applyStyle("+u.nodeId(node)+", "+property+", "+value+") called from: "+arguments.callee.caller);
	}
}
Util.getComputedStyle = u.gcs = function(node, property) {
	node.offsetHeight;
	if(document.defaultView && document.defaultView.getComputedStyle) {
		return document.defaultView.getComputedStyle(node, null).getPropertyValue(property);
	}
	return false;
}
Util.hasFixedParent = u.hfp = function(node) {
	while(node.nodeName.toLowerCase() != "body") {
		if(u.gcs(node.parentNode, "position").match("fixed")) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
Util.Events = u.e = new function() {
	this.event_pref = typeof(document.ontouchmove) == "undefined" ? "mouse" : "touch";
	this.kill = function(event) {
		if(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	}
	this.addEvent = function(node, type, action) {
		try {
			node.addEventListener(type, action, false);
		}
		catch(exception) {
			alert("exception in addEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.removeEvent = function(node, type, action) {
		try {
			node.removeEventListener(type, action, false);
		}
		catch(exception) {
			u.bug("exception in removeEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.addStartEvent = this.addDownEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.removeStartEvent = this.removeDownEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.addMoveEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.removeMoveEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.addEndEvent = this.addUpEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(node.snapback && u.e.event_pref == "mouse") {
			u.e.addEvent(node, "mouseout", this._snapback);
		}
	}
	this.removeEndEvent = this.removeUpEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(node.snapback && u.e.event_pref == "mouse") {
			u.e.removeEvent(node, "mouseout", this._snapback);
		}
	}
	this.resetClickEvents = function(node) {
		u.t.resetTimer(node.t_held);
		u.t.resetTimer(node.t_clicked);
		this.removeEvent(node, "mouseup", this._dblclicked);
		this.removeEvent(node, "touchend", this._dblclicked);
		this.removeEvent(node, "mousemove", this._clickCancel);
		this.removeEvent(node, "touchmove", this._clickCancel);
		this.removeEvent(node, "mousemove", this._move);
		this.removeEvent(node, "touchmove", this._move);
	}
	this.resetEvents = function(node) {
		this.resetClickEvents(node);
		if(typeof(this.resetDragEvents) == "function") {
			this.resetDragEvents(node);
		}
	}
	this.resetNestedEvents = function(node) {
		while(node && node.nodeName != "HTML") {
			this.resetEvents(node);
			node = node.parentNode;
		}
	}
	this._inputStart = function(event) {
		this.event_var = event;
		this.input_timestamp = event.timeStamp;
		this.start_event_x = u.eventX(event);
		this.start_event_y = u.eventY(event);
		this.current_xps = 0;
		this.current_yps = 0;
		this.swiped = false;
		if(this.e_click || this.e_dblclick || this.e_hold) {
			var node = this;
			while(node) {
				if(node.e_drag || node.e_swipe) {
					u.e.addMoveEvent(this, u.e._cancelClick);
					break;
				}
				else {
					node = node.parentNode;
				}
			}
			u.e.addMoveEvent(this, u.e._move);
			u.e.addEndEvent(this, u.e._dblclicked);
			if(u.e.event_pref == "mouse") {
				u.e.addEvent(this, "mouseout", u.e._cancelClick);
			}
		}
		if(this.e_hold) {
			this.t_held = u.t.setTimer(this, u.e._held, 750);
		}
		if(this.e_drag || this.e_swipe) {
			u.e.addMoveEvent(this, u.e._pick);
			u.e.addEndEvent(this, u.e._drop);
		}
		if(this.e_scroll) {
			u.e.addMoveEvent(this, u.e._scrollStart);
			u.e.addEndEvent(this, u.e._scrollEnd);
		}
		if(typeof(this.inputStarted) == "function") {
			this.inputStarted(event);
		}
	}
	this._cancelClick = function(event) {
		u.e.resetClickEvents(this);
		if(typeof(this.clickCancelled) == "function") {
			this.clickCancelled(event);
		}
	}
	this._move = function(event) {
		if(typeof(this.moved) == "function") {
			this.moved(event);
		}
	}
	this.hold = function(node) {
		node.e_hold = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._held = function(event) {
		u.stats.event(this, "held");
		u.e.resetNestedEvents(this);
		if(typeof(this.held) == "function") {
			this.held(event);
		}
	}
	this.click = this.tap = function(node) {
		node.e_click = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._clicked = function(event) {
		u.stats.event(this, "clicked");
		u.e.resetNestedEvents(this);
		if(typeof(this.clicked) == "function") {
			this.clicked(event);
		}
	}
	this.dblclick = this.doubletap = function(node) {
		node.e_dblclick = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._dblclicked = function(event) {
		if(u.t.valid(this.t_clicked) && event) {
			u.stats.event(this, "dblclicked");
			u.e.resetNestedEvents(this);
			if(typeof(this.dblclicked) == "function") {
				this.dblclicked(event);
			}
			return;
		}
		else if(!this.e_dblclick) {
			this._clicked = u.e._clicked;
			this._clicked(event);
		}
		else if(!event) {
			this._clicked = u.e._clicked;
			this._clicked(this.event_var);
		}
		else {
			u.e.resetNestedEvents(this);
			this.t_clicked = u.t.setTimer(this, u.e._dblclicked, 400);
		}
	}
}
u.e.addDOMReadyEvent = function(action) {
	if(document.readyState && document.addEventListener) {
		if((document.readyState == "interactive" && !u.browser("ie")) || document.readyState == "complete" || document.readyState == "loaded") {
			action();
		}
		else {
			var id = u.randomString();
			window["DOMReady_" + id] = action;
			eval('window["_DOMReady_' + id + '"] = function() {window["DOMReady_'+id+'"](); u.e.removeEvent(document, "DOMContentLoaded", window["_DOMReady_' + id + '"])}');
			u.e.addEvent(document, "DOMContentLoaded", window["_DOMReady_" + id]);
		}
	}
	else {
		u.e.addOnloadEvent(action);
	}
}
u.e.addOnloadEvent = function(action) {
	if(document.readyState && (document.readyState == "complete" || document.readyState == "loaded")) {
		action();
	}
	else {
		var id = u.randomString();
		window["Onload_" + id] = action;
		eval('window["_Onload_' + id + '"] = function() {window["Onload_'+id+'"](); u.e.removeEvent(window, "load", window["_Onload_' + id + '"])}');
		u.e.addEvent(window, "load", window["_Onload_" + id]);
	}
}
u.e.addResizeEvent = function(node, action) {
}
u.e.removeResizeEvent = function(node, action) {
}
u.e.addScrollEvent = function(node, action) {
}
u.e.removeScrollEvent = function(node, action) {
}
u.e.resetDragEvents = function(node) {
	this.removeEvent(node, "mousemove", this._pick);
	this.removeEvent(node, "touchmove", this._pick);
	this.removeEvent(node, "mousemove", this._drag);
	this.removeEvent(node, "touchmove", this._drag);
	this.removeEvent(node, "mouseup", this._drop);
	this.removeEvent(node, "touchend", this._drop);
	this.removeEvent(node, "mouseout", this._drop);
	this.removeEvent(node, "mousemove", this._scrollStart);
	this.removeEvent(node, "touchmove", this._scrollStart);
	this.removeEvent(node, "mousemove", this._scrolling);
	this.removeEvent(node, "touchmove", this._scrolling);
	this.removeEvent(node, "mouseup", this._scrollEnd);
	this.removeEvent(node, "touchend", this._scrollEnd);
}
u.e.overlap = function(node, boundaries, strict) {
	if(boundaries.constructor.toString().match("Array")) {
		var boundaries_start_x = Number(boundaries[0]);
		var boundaries_start_y = Number(boundaries[1]);
		var boundaries_end_x = Number(boundaries[2]);
		var boundaries_end_y = Number(boundaries[3]);
	}
	else if(boundaries.constructor.toString().match("HTML")) {
		var boundaries_start_x = u.absX(boundaries) - u.absX(node);
		var boundaries_start_y =  u.absY(boundaries) - u.absY(node);
		var boundaries_end_x = Number(boundaries_start_x + boundaries.offsetWidth);
		var boundaries_end_y = Number(boundaries_start_y + boundaries.offsetHeight);
	}
	var node_start_x = Number(node._x);
	var node_start_y = Number(node._y);
	var node_end_x = Number(node_start_x + node.offsetWidth);
	var node_end_y = Number(node_start_y + node.offsetHeight);
	if(strict) {
		if(node_start_x >= boundaries_start_x && node_start_y >= boundaries_start_y && node_end_x <= boundaries_end_x && node_end_y <= boundaries_end_y) {
			return true;
		}
		else {
			return false;
		}
	} 
	else if(node_end_x < boundaries_start_x || node_start_x > boundaries_end_x || node_end_y < boundaries_start_y || node_start_y > boundaries_end_y) {
		return false;
	}
	return true;
}
u.e.drag = function(node, boundaries, settings) {
	node.e_drag = true;
	if(node.childNodes.length < 2 && node.innerHTML.trim() == "") {
		node.innerHTML = "&nbsp;";
	}
	node.drag_strict = true;
	node.drag_elastica = 0;
	node.drag_dropout = true;
	node.show_bounds = false;
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "strict"		: node.drag_strict		= settings[argument]; break;
				case "elastica"		: node.drag_elastica	= Number(settings[argument]); break;
				case "dropout"		: node.drag_dropout		= settings[argument]; break;
				case "show_bounds"	: node.show_bounds		= settings[argument]; break; // NEEDS HELP
			}
		}
	}
	if((boundaries.constructor && boundaries.constructor.toString().match("Array")) || (boundaries.scopeName && boundaries.scopeName != "HTML")) {
		node.start_drag_x = Number(boundaries[0]);
		node.start_drag_y = Number(boundaries[1]);
		node.end_drag_x = Number(boundaries[2]);
		node.end_drag_y = Number(boundaries[3]);
	}
	else if((boundaries.constructor && boundaries.constructor.toString().match("HTML")) || (boundaries.scopeName && boundaries.scopeName == "HTML")) {
		node.start_drag_x = u.absX(boundaries) - u.absX(node);
		node.start_drag_y = u.absY(boundaries) - u.absY(node);
		node.end_drag_x = node.start_drag_x + boundaries.offsetWidth;
		node.end_drag_y = node.start_drag_y + boundaries.offsetHeight;
	}
	if(node.show_bounds) {
		var debug_bounds = u.ae(document.body, "div", {"class":"debug_bounds"})
		debug_bounds.style.position = "absolute";
		debug_bounds.style.background = "red"
		debug_bounds.style.left = (u.absX(node) + node.start_drag_x - 1) + "px";
		debug_bounds.style.top = (u.absY(node) + node.start_drag_y - 1) + "px";
		debug_bounds.style.width = (node.end_drag_x - node.start_drag_x) + "px";
		debug_bounds.style.height = (node.end_drag_y - node.start_drag_y) + "px";
		debug_bounds.style.border = "1px solid white";
		debug_bounds.style.zIndex = 9999;
		debug_bounds.style.opacity = .5;
		if(document.readyState && document.readyState == "interactive") {
			debug_bounds.innerHTML = "WARNING - injected on DOMLoaded"; 
		}
		u.bug("node: "+u.nodeId(node)+" in (" + u.absX(node) + "," + u.absY(node) + "), (" + (u.absX(node)+node.offsetWidth) + "," + (u.absY(node)+node.offsetHeight) +")");
		u.bug("boundaries: (" + node.start_drag_x + "," + node.start_drag_y + "), (" + node.end_drag_x + ", " + node.end_drag_y + ")");
	}
	node._x = node._x ? node._x : 0;
	node._y = node._y ? node._y : 0;
	node.locked = ((node.end_drag_x - node.start_drag_x == node.offsetWidth) && (node.end_drag_y - node.start_drag_y == node.offsetHeight));
	node.only_vertical = (!node.locked && node.end_drag_x - node.start_drag_x == node.offsetWidth);
	node.only_horisontal = (!node.locked && node.end_drag_y - node.start_drag_y == node.offsetHeight);
	u.e.addStartEvent(node, this._inputStart);
}
u.e._pick = function(event) {
	var init_speed_x = Math.abs(this.start_event_x - u.eventX(event));
	var init_speed_y = Math.abs(this.start_event_y - u.eventY(event));
	if(init_speed_x > init_speed_y && this.only_horisontal || 
	   init_speed_x < init_speed_y && this.only_vertical ||
	   !this.only_vertical && !this.only_horisontal) {
		u.e.resetNestedEvents(this);
	    u.e.kill(event);
		this.move_timestamp = event.timeStamp;
		this.move_last_x = this._x;
		this.move_last_y = this._y;
		if(u.hasFixedParent(this)) {
			this.start_input_x = u.eventX(event) - this._x - u.scrollX(); 
			this.start_input_y = u.eventY(event) - this._y - u.scrollY();
		}
		else {
			this.start_input_x = u.eventX(event) - this._x; 
			this.start_input_y = u.eventY(event) - this._y;
		}
		this.current_xps = 0;
		this.current_yps = 0;
		u.a.transition(this, "none");
		if(typeof(this.picked) == "function") {
			this.picked(event);
		}
		u.e.addMoveEvent(this, u.e._drag);
		u.e.addEndEvent(this, u.e._drop);
	}
	if(this.drag_dropout && u.e.event_pref == "mouse") {
		u.e.addEvent(this, "mouseout", u.e._drop);
	}
}
u.e._drag = function(event) {
	if(u.hasFixedParent(this)) {
		this.current_x = u.eventX(event) - this.start_input_x - u.scrollX();
		this.current_y = u.eventY(event) - this.start_input_y - u.scrollY();
	}
	else {
		this.current_x = u.eventX(event) - this.start_input_x;
		this.current_y = u.eventY(event) - this.start_input_y;
	}
	this.current_xps = Math.round(((this.current_x - this.move_last_x) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this.move_last_y) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.move_timestamp = event.timeStamp;
	this.move_last_x = this.current_x;
	this.move_last_y = this.current_y;
	if(this.only_vertical) {
		this._y = this.current_y;
	}
	else if(this.only_horisontal) {
		this._x = this.current_x;
	}
	else if(!this.locked) {
		this._x = this.current_x;
		this._y = this.current_y;
	}
	if(this.e_swipe) {
		if(this.current_xps && (Math.abs(this.current_xps) > Math.abs(this.current_yps) || this.only_horisontal)) {
			if(this.current_xps < 0) {
				this.swiped = "left";
			}
			else {
				this.swiped = "right";
			}
		}
		else if(this.current_yps && (Math.abs(this.current_xps) < Math.abs(this.current_yps) || this.only_vertical)) {
			if(this.current_yps < 0) {
				this.swiped = "up";
			}
			else {
				this.swiped = "down";
			}
		}
	}
	if(!this.locked) {
		if(u.e.overlap(this, [this.start_drag_x, this.start_drag_y, this.end_drag_x, this.end_drag_y], true)) {
			u.a.translate(this, this._x, this._y);
		}
		else if(this.drag_elastica) {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			var offset = false;
			if(!this.only_vertical && this._x < this.start_drag_x) {
				offset = this._x < this.start_drag_x - this.drag_elastica ? - this.drag_elastica : this._x - this.start_drag_x;
				this._x = this.start_drag_x;
				this.current_x = this._x + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.only_vertical && this._x + this.offsetWidth > this.end_drag_x) {
				offset = this._x + this.offsetWidth > this.end_drag_x + this.drag_elastica ? this.drag_elastica : this._x + this.offsetWidth - this.end_drag_x;
				this._x = this.end_drag_x - this.offsetWidth;
				this.current_x = this._x + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_x = this._x;
			}
			if(!this.only_horisontal && this._y < this.start_drag_y) {
				offset = this._y < this.start_drag_y - this.drag_elastica ? - this.drag_elastica : this._y - this.start_drag_y;
				this._y = this.start_drag_y;
				this.current_y = this._y + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.horisontal && this._y + this.offsetHeight > this.end_drag_y) {
				offset = (this._y + this.offsetHeight > this.end_drag_y + this.drag_elastica) ? this.drag_elastica : (this._y + this.offsetHeight - this.end_drag_y);
				this._y = this.end_drag_y - this.offsetHeight;
				this.current_y = this._y + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_y = this._y;
			}
			if(offset) {
				u.a.translate(this, this.current_x, this.current_y);
			}
		}
		else {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			if(this._x < this.start_drag_x) {
				this._x = this.start_drag_x;
			}
			else if(this._x + this.offsetWidth > this.end_drag_x) {
				this._x = this.end_drag_x - this.offsetWidth;
			}
			if(this._y < this.start_drag_y) {
				this._y = this.start_drag_y;
			}
			else if(this._y + this.offsetHeight > this.end_drag_y) { 
				this._y = this.end_drag_y - this.offsetHeight;
			}
			u.a.translate(this, this._x, this._y);
		}
	}
	if(typeof(this.moved) == "function") {
		this.moved(event);
	}
}
u.e._drop = function(event) {
	u.e.resetEvents(this);
	if(this.e_swipe && this.swiped) {
		if(this.swiped == "left" && typeof(this.swipedLeft) == "function") {
			this.swipedLeft(event);
		}
		else if(this.swiped == "right" && typeof(this.swipedRight) == "function") {
			this.swipedRight(event);
		}
		else if(this.swiped == "down" && typeof(this.swipedDown) == "function") {
			this.swipedDown(event);
		}
		else if(this.swiped == "up" && typeof(this.swipedUp) == "function") {
			this.swipedUp(event);
		}
	}
	else if(!this.drag_strict && !this.locked) {
		this.current_x = this._x + (this.current_xps/2);
		this.current_y = this._y + (this.current_yps/2);
		if(this.only_vertical || this.current_x < this.start_drag_x) {
			this.current_x = this.start_drag_x;
		}
		else if(this.current_x + this.offsetWidth > this.end_drag_x) {
			this.current_x = this.end_drag_x - this.offsetWidth;
		}
		if(this.only_horisontal || this.current_y < this.start_drag_y) {
			this.current_y = this.start_drag_y;
		}
		else if(this.current_y + this.offsetHeight > this.end_drag_y) {
			this.current_y = this.end_drag_y - this.offsetHeight;
		}
		this.transitioned = function() {
			this.transitioned = null;
			u.a.transition(this, "none");
			if(typeof(this.projected) == "function") {
				this.projected(event);
			}
		}
		if(this.current_xps || this.current_yps) {
			u.a.transition(this, "all 1s cubic-bezier(0,0,0.25,1)");
		}
		else {
			u.a.transition(this, "none");
		}
		u.a.translate(this, this.current_x, this.current_y);
	}
	if(typeof(this.dropped) == "function") {
		this.dropped(event);
	}
}
u.e.swipe = function(node, boundaries, settings) {
	node.e_swipe = true;
	u.e.drag(node, boundaries, settings);
}
u.e.scroll = function(e) {
	e.e_scroll = true;
	e._x = e._x ? e._x : 0;
	e._y = e._y ? e._y : 0;
	u.e.addStartEvent(e, this._inputStart);
}
u.e._scrollStart = function(event) {
	u.e.resetNestedEvents(this);
	this.move_timestamp = new Date().getTime();
	this.current_xps = 0;
	this.current_yps = 0;
	this.start_input_x = u.eventX(event) - this._x;
	this.start_input_y = u.eventY(event) - this._y;
	u.a.transition(this, "none");
	if(typeof(this.picked) == "function") {
		this.picked(event);
	}
	u.e.addMoveEvent(this, u.e._scrolling);
	u.e.addEndEvent(this, u.e._scrollEnd);
}
u.e._scrolling = function(event) {
	this.new_move_timestamp = new Date().getTime();
	this.current_x = u.eventX(event) - this.start_input_x;
	this.current_y = u.eventY(event) - this.start_input_y;
	this.current_xps = Math.round(((this.current_x - this._x) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this._y) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
	this.move_timestamp = this.new_move_timestamp;
	if(u.scrollY() > 0 && -(this.current_y) + u.scrollY() > 0) {
		u.e.kill(event);
		window.scrollTo(0, -(this.current_y) + u.scrollY());
	}
	if(typeof(this.moved) == "function") {
		this.moved(event);
	}
}
u.e._scrollEnd = function(event) {
	u.e.resetEvents(this);
	if(typeof(this.dropped) == "function") {
		this.dropped(event);
	}
}
u.e.beforeScroll = function(node) {
	node.e_beforescroll = true;
	u.e.addStartEvent(node, this._inputStartDrag);
}
u.e._inputStartDrag = function() {
	u.e.addMoveEvent(this, u.e._beforeScroll);
}
u.e._beforeScroll = function(event) {
	u.e.removeMoveEvent(this, u.e._beforeScroll);
	if(typeof(this.picked) == "function") {
		this.picked(event);
	}
}
Util.flashDetection = function(version) {
	var flash_version = false;
	var flash = false;
	if(navigator.plugins && navigator.plugins["Shockwave Flash"] && navigator.plugins["Shockwave Flash"].description && navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) {
		flash = true;
		var Pversion = navigator.plugins["Shockwave Flash"].description.match(/\b([\d]+)\b/);
		if(Pversion.length > 1 && !isNaN(Pversion[1])) {
			flash_version = Pversion[1];
		}
	}
	else if(window.ActiveXObject) {
		try {
			var AXflash, AXversion;
			AXflash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			if(AXflash) {
				flash = true;
				AXversion = AXflash.GetVariable("$version").match(/\b([\d]+)\b/);
				if(AXversion.length > 1 && !isNaN(AXversion[1])) {
					flash_version = AXversion[1];
				}
			}
		}
		catch(exception) {}
	}
	if(flash_version || (flash && !version)) {
		if(!version) {
			return true;
		}
		else {
			if(!isNaN(version)) {
				return flash_version == version;
			}
			else {
				return eval(flash_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.flash = function(node, url, settings) {
	var width = "100%";
	var height = "100%";
	var background = "transparent";
	var id = "flash_" + new Date().getHours() + "_" + new Date().getMinutes() + "_" + new Date().getMilliseconds();
	var allowScriptAccess = "always";
	var menu = "false";
	var scale = "showall";
	var wmode = "transparent";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "id"					: id				= settings[argument]; break;
				case "width"				: width				= Number(settings[argument]); break;
				case "height"				: height			= Number(settings[argument]); break;
				case "background"			: background		= settings[argument]; break;
				case "allowScriptAccess"	: allowScriptAccess = settings[argument]; break;
				case "menu"					: menu				= settings[argument]; break;
				case "scale"				: scale				= settings[argument]; break;
				case "wmode"				: wmode				= settings[argument]; break;
			}
		}
	}
	html = '<object';
	html += ' id="'+id+'"';
	html += ' width="'+width+'"';
	html += ' height="'+height+'"';
	if(u.browser("explorer")) {
		html += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
	}
	else {
		html += ' type="application/x-shockwave-flash"';
		html += ' data="'+url+'"';
	}
	html += '>';
	html += '<param name="allowScriptAccess" value="'+allowScriptAccess+'" />';
	html += '<param name="movie" value="'+url+'" />';
	html += '<param name="quality" value="high" />';
	html += '<param name="bgcolor" value="'+background+'" />';
	html += '<param name="play" value="true" />';
	html += '<param name="wmode" value="'+wmode+'" />';
	html += '<param name="menu" value="'+menu+'" />';
	html += '<param name="scale" value="'+scale+'" />';
	html += '</object>';
	var temp_node = document.createElement("div");
	temp_node.innerHTML = html;
	node.insertBefore(temp_node.firstChild, node.firstChild);
	var flash_object = u.qs("#"+id, node);
	return flash_object;
}
Util.Form = u.f = new function() {
	this.customInit = {};
	this.customValidate = {};
	this.customSend = {};
	this.init = function(form, settings) {
		var i, j, field, action, input;
		form.form_send = "params";
		form.ignore_inputs = "ignoreinput";
		if(typeof(settings) == "object") {
			var argument;
			for(argument in settings) {
				switch(argument) {
					case "ignore_inputs"	: form.ignore_inputs	= settings[argument]; break;
					case "form_send"		: form.form_send		= settings[argument]; break;
				}
			}
		}
		form.onsubmit = function(event) {return false;}
		form.setAttribute("novalidate", "novalidate");
		form._submit = this._submit;
		form.fields = {};
		form.tab_order = [];
		form.actions = {};
		var fields = u.qsa(".field", form);
		for(i = 0; field = fields[i]; i++) {
			var abbr = u.qs("abbr", field);
			if(abbr) {
				abbr.parentNode.removeChild(abbr);
			}
			var error_message = field.getAttribute("data-error");
			if(error_message) {
				u.ae(field, "div", {"class":"error", "html":error_message})
			}
			field._label = u.qs("label", field);
			field._hint = u.qs(".hint", field);
			field._error = u.qs(".error", field);
			var not_initialized = true;
			var custom_init;
			for(custom_init in this.customInit) {
				if(field.className.match(custom_init)) {
					this.customInit[custom_init](field);
					not_initialized = false;
				}
			}
			if(not_initialized) {
				if(u.hc(field, "string|email|tel|numeric|integer|password")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "text")) {
					field._input = u.qs("textarea", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "select")) {
					field._input = u.qs("select", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "checkbox|boolean")) {
					field._input = u.qs("input[type=checkbox]", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "radio|radio_buttons")) {
					field._input = u.qsa("input", field);
					for(j = 0; input = field._input[j]; j++) {
						input.field = field;
						this.formIndex(form, input);
					}
				}
				else if(u.hc(field, "date")) {
					field._input = u.qsa("select,input", field);
					for(j = 0; input = field._input[j]; j++) {
						input.field = field;
						this.formIndex(form, input);
					}
				}
				else if(u.hc(field, "file")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					this.formIndex(form, field._input);
				}
			}
		}
		var hidden_fields = u.qsa("input[type=hidden]", form);
		for(i = 0; hidden_field = hidden_fields[i]; i++) {
			if(!form.fields[hidden_field.name]) {
				form.fields[hidden_field.name] = hidden_field;
				hidden_field.val = this._value;
			}
		}
		var actions = u.qsa(".actions li", form);
		for(i = 0; action = actions[i]; i++) {
			action._input = u.qs("input,a", action);
			if(action._input.type && action._input.type == "submit") {
				action._input.onclick = function(event) {
					u.e.kill(event ? event : window.event);
				}
			}
			u.ce(action._input);
			action._input.clicked = function(event) {
				u.e.kill(event);
				if(!u.hc(this, "disabled")) {
					if(this.type && this.type.match(/submit/i)) {
						this.form._submit_button = this;
						this.form._submit_input = false;
						this.form._submit(event);
					}
				}
			}
			this.buttonOnEnter(action._input);
			this.activateButton(action._input);
			if(action._input.name && action._input.name) {
				form.actions[action._input.name] = action._input;
			}
			if(typeof(u.e.k) == "object" && u.hc(action._input, "key:[a-z0-9]+")) {
				u.e.k.addShortcut(u.cv(action._input, "key"), action._input);
			}
		}
	}
	this._value = function(value) {
		if(value !== undefined) {
			this.value = value;
			u.f.validate(this);
		}
		else {
			return this.value;
		}
	}
	this._value_radio = function(value) {
		if(value) {
			for(i = 0; option = this.form[this.name][i]; i++) {
				if(option.value == value) {
					option.checked = true;
					u.f.validate(this);
				}
			}
		}
		else {
			var i, option;
			for(i = 0; option = this.form[this.name][i]; i++) {
				if(option.checked) {
					return option.value;
				}
			}
		}
		return false;
	}
	this._value_checkbox = function(value) {
		if(value) {
			this.checked = true
			u.f.validate(this);
		}
		else {
			if(this.checked) {
				return this.value;
			}
		}
		return false;
	}
	this._value_select = function(value) {
		if(value !== undefined) {
			var i, option;
			for(i = 0; option = this.options[i]; i++) {
				if(option.value == value) {
					this.selectedIndex = i;
					u.f.validate(this);
					return i;
				}
			}
			return false;
		}
		else {
			return this.options[this.selectedIndex].value;
		}
	}
	this.inputOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(this.nodeName.match(/input/i) && (event.keyCode == 40 || event.keyCode == 38)) {
				this._submit_disabled = true;
			}
			else if(this.nodeName.match(/input/i) && this._submit_disabled && (
				event.keyCode == 46 || 
				(event.keyCode == 39 && u.browser("firefox")) || 
				(event.keyCode == 37 && u.browser("firefox")) || 
				event.keyCode == 27 || 
				event.keyCode == 13 || 
				event.keyCode == 9 ||
				event.keyCode == 8
			)) {
				this._submit_disabled = false;
			}
			else if(event.keyCode == 13 && !this._submit_disabled) {
				u.e.kill(event);
				this.form.submitInput = this;
				this.form.submitButton = false;
				this.form._submit(event);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this.buttonOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(event.keyCode == 13 && !u.hc(this, "disabled")) {
				u.e.kill(event);
				this.form.submit_input = false;
				this.form.submit_button = this;
				this.form._submit(event);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this.formIndex = function(form, node) {
		node.tab_index = form.tab_order.length;
		form.tab_order[node.tab_index] = node;
		if(node.field && node.name) {
			form.fields[node.name] = node;
			if(node.nodeName.match(/input/i) && node.type && node.type.match(/text|email|number|password/)) {
				node.val = this._value;
				u.e.addEvent(node, "keyup", this._updated);
				u.e.addEvent(node, "change", this._changed);
				this.inputOnEnter(node);
			}
			else if(node.nodeName.match(/textarea/i)) {
				node.val = this._value;
				u.e.addEvent(node, "keyup", this._updated);
				u.e.addEvent(node, "change", this._changed);
				if(u.hc(node.field, "autoexpand")) {
					u.as(node, "overflow", "hidden");
					node.autoexpand_offset = 0;
					if(parseInt(u.gcs(node, "height")) != node.scrollHeight) {
						node.autoexpand_offset = node.scrollHeight - parseInt(u.gcs(node, "height"));
					}
					node.setHeight = function() {
						var textarea_height = parseInt(u.gcs(this, "height"));
						if(this.value) {
							if(u.browser("webkit")) {
								if(this.scrollHeight - this.autoexpand_offset > textarea_height) {
									u.a.setHeight(this, this.scrollHeight);
								}
							}
							else if(u.browser("opera") || u.browser("explorer")) {
								if(this.scrollHeight > textarea_height) {
									u.a.setHeight(this, this.scrollHeight);
								}
							}
							else {
								u.a.setHeight(this, this.scrollHeight);
							}
						}
					}
					u.e.addEvent(node, "keyup", node.setHeight);
				}
			}
			else if(node.nodeName.match(/select/i)) {
				node.val = this._value_select;
				u.e.addEvent(node, "change", this._updated);
				u.e.addEvent(node, "keyup", this._updated);
				u.e.addEvent(node, "change", this._changed);
			}
			else if(node.type && node.type.match(/checkbox/)) {
				node.val = this._value_checkbox;
				if(u.browser("explorer", "<=8")) {
					node.pre_state = node.checked;
					node._changed = u.f._changed;
					node._updated = u.f._updated;
					node._clicked = function(event) {
						if(this.checked != this.pre_state) {
							this._changed(window.event);
							this._updated(window.event);
						}
						this.pre_state = this.checked;
					}
					u.e.addEvent(node, "click", node._clicked);
				}
				else {
					u.e.addEvent(node, "change", this._updated);
					u.e.addEvent(node, "change", this._changed);
				}
				this.inputOnEnter(node);
			}
			else if(node.type && node.type.match(/radio/)) {
				node.val = this._value_radio;
				if(u.browser("explorer", "<=8")) {
					node.pre_state = node.checked;
					node._changed = u.f._changed;
					node._updated = u.f._updated;
					node._clicked = function(event) {
						var i, input;
						if(this.checked != this.pre_state) {
							this._changed(window.event);
							this._updated(window.event);
						}
						for(i = 0; input = this.field._input[i]; i++) {
							input.pre_state = input.checked;
						}
					}
					u.e.addEvent(node, "click", node._clicked);
				}
				else {
					u.e.addEvent(node, "change", this._updated);
					u.e.addEvent(node, "change", this._changed);
				}
				this.inputOnEnter(node);
			}
			this.activateField(node);
			this.validate(node);
		}
	}
	this._changed = function(event) {
		this.used = true;
		if(typeof(this.changed) == "function") {
			this.changed(this);
		}
		if(typeof(this.form.changed) == "function") {
			this.form.changed(this);
		}
	}
	this._updated = function(event) {
		if(event.keyCode != 9 && event.keyCode != 13 && event.keyCode != 16 && event.keyCode != 17 && event.keyCode != 18) {
			if(this.used || u.hc(this.field, "error")) {
				u.f.validate(this);
			}
			if(typeof(this.updated) == "function") {
				this.updated(this);
			}
			if(typeof(this.form.updated) == "function") {
				this.form.updated(this);
			}
		}
	}
	this._validate = function() {
		u.f.validate(this);
	}
	this._submit = function(event, input) {
		for(name in this.fields) {
			if(this.fields[name].field) {
				this.fields[name].used = true;
				u.f.validate(this.fields[name]);
			}
		}
		if(u.qs(".field.error", this)) {
			if(typeof(this.validationFailed) == "function") {
				this.validationFailed();
			}
		}
		else {
			if(typeof(this.submitted) == "function") {
				this.submitted(input);
			}
			else {
				this.submit();
			}
		}
	}
	this.activateField = function(input) {
		this._focus = function(event) {
			this.field.focused = true;
			u.ac(this.field, "focus");
			u.ac(this, "focus");
			if(typeof(this.focused) == "function") {
				this.focused();
			}
			if(typeof(this.form.focused) == "function") {
				this.form.focused(this);
			}
		}
		this._blur = function(event) {
			this.field.focused = false;
			u.rc(this.field, "focus");
			u.rc(this, "focus");
			this.used = true;
			if(typeof(this.blurred) == "function") {
				this.blurred();
			}
			if(typeof(this.form.blurred) == "function") {
				this.form.blurred(this);
			}
		}
		u.e.addEvent(input, "focus", this._focus);
		u.e.addEvent(input, "blur", this._blur);
		u.e.addEvent(input, "blur", this._validate);
	}
	this.activateButton = function(button) {
		this._button_focus = function(event) {
			u.ac(this, "focus");
			if(typeof(this.focused) == "function") {
				this.focused();
			}
			if(typeof(this.form.focused) == "function") {
				this.form.focused(this);
			}
		}
		this._button_blur = function(event) {
			u.rc(this, "focus");
			if(typeof(this.blurred) == "function") {
				this.blurred();
			}
			if(typeof(this.form.blurred) == "function") {
				this.form.blurred(this);
			}
		}
		u.e.addEvent(button, "focus", this._button_focus);
		u.e.addEvent(button, "blur", this._button_blur);
	}
	this.isDefault = function(input) {
		if(input.field.default_value && input.val() == iN.field.default_value) {
			return true;
		}
		return false;
	}
	this.fieldError = function(input) {
		u.rc(input, "correct");
		u.rc(input.field, "correct");
		if(input.used || !this.isDefault(input) && input.val()) {
			u.ac(input, "error");
			u.ac(input.field, "error");
			if(typeof(input.validationFailed) == "function") {
				input.validationFailed();
			}
		}
	}
	this.fieldCorrect = function(input) {
		if(!this.isDefault(input) && input.val()) {
			u.ac(input, "correct");
			u.ac(input.field, "correct");
			u.rc(input, "error");
			u.rc(input.field, "error");
		}
		else {
			u.rc(input, "correct");
			u.rc(input.field, "correct");
			u.rc(input, "error");
			u.rc(input.field, "error");
		}
	}
	this.validate = function(input) {
		var min, max;
		var not_validated = true;
		var custom_validate;
		for(custom_validate in u.f.customValidate) {
			if(u.hc(input.field, custom_validate)) {
				u.f.customValidate[custom_validate](input);
				not_validated = false;
			}
		}
		if(not_validated) {
			if(u.hc(input.field, "password")) {
				min = Number(u.cv(input.field, "min"));
				max = Number(u.cv(input.field, "max"));
				min = min ? min : 8;
				max = max ? max : 20;
				if((input.value.length >= min && input.value.length <= max && !this.isDefault(input)) || (!u.hc(input.field, "required") && !input.value)) {
					this.fieldCorrect(input);
				}
				else {
					this.fieldError(input);
				}
			}
			else if(u.hc(input.field, "numeric")) {
				min = Number(u.cv(input.field, "min"));
				max = Number(u.cv(input.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				if((input.value && !isNaN(input.value) && input.value >= min && input.value <= max && !this.isDefault(input)) || (!u.hc(input.field, "required") && !input.value)) {
					this.fieldCorrect(input);
				}
				else {
					this.fieldError(input);
				}
			}
			else if(u.hc(input.field, "integer")) {
				min = Number(u.cv(input.field, "min"));
				max = Number(u.cv(input.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				if((input.value && !isNaN(input.value) && Math.round(input.value) == input.value && input.value >= min && input.value <= max && !this.isDefault(input)) || (!u.hc(input.field, "required") && !input.value)) {
					this.fieldCorrect(input);
				}
				else {
					this.fieldError(input);
				}
			}
			else if(u.hc(input.field, "tel")) {
				if((input.value.match(/^([\+0-9\-\.\s\(\)]){5,16}$/) && !this.isDefault(input)) || (!u.hc(input.field, "required") && !input.value)) {
					this.fieldCorrect(input);
				}
				else {
					this.fieldError(input);
				}
			}
			else if(u.hc(input.field, "email")) {
				if((input.value.match(/^([^<>\\\/%$])+\@([^<>\\\/%$])+\.([^<>\\\/%$]{2,20})$/) && !this.isDefault(input)) || (!u.hc(input.field, "required") && !input.value)) {
					this.fieldCorrect(input);
				}
				else {
					this.fieldError(input);
				}
			}
			else if(u.hc(input.field, "text")) {
				min = Number(u.cv(input.field, "min"));
				max = Number(u.cv(input.field, "max"));
				min = min ? min : 1;
				max = max ? max : 10000000;
				if((input.value.length >= min && input.value.length <= max && !this.isDefault(input)) || (!u.hc(input.field, "required") && !input.value)) {
					this.fieldCorrect(input);
				}
				else {
					this.fieldError(input);
				}
			}
			else if(u.hc(input.field, "select")) {
				if(input.val() != "" || !u.hc(input.field, "required")) {
					this.fieldCorrect(input);
				}
				else {
					this.fieldError(input);
				}
			}
			else if(u.hc(input.field, "checkbox|boolean|radio|radio_buttons")) {
				if(input.val() != "" || !u.hc(input.field, "required")) {
					this.fieldCorrect(input);
				}
				else {
					this.fieldError(input);
				}
			}
			else if(u.hc(input.field, "string")) {
				min = Number(u.cv(input.field, "min"));
				max = Number(u.cv(input.field, "max"));
				min = min ? min : 1;
				max = max ? max : 10000000;
				if((input.value.length >= min && input.value.length <= max && !this.isDefault(input)) || (!u.hc(input.field, "required") && !input.value)) {
					this.fieldCorrect(input);
				}
				else {
					this.fieldError(input);
				}
			}
		}
		if(u.hc(input.field, "error")) {
			return false;
		}
		else {
			return true;
		}
	}
	this.getParams = function(form, settings) {
		var send_as = "params";
		var ignore_inputs = "ignoreinput";
		if(typeof(settings) == "object") {
			var argument;
			for(argument in settings) {
				switch(argument) {
					case "ignore_inputs"	: ignore_inputs		= settings[argument]; break;
					case "send_as"			: send_as			= settings[argument]; break;
				}
			}
		}
		var i, input, select, textarea, param;
		var params = new Object();
		if(form._submit_button && form._submit_button.name) {
			params[form._submit_button.name] = form._submit_button.value;
		}
		var inputs = u.qsa("input", form);
		var selects = u.qsa("select", form)
		var textareas = u.qsa("textarea", form)
		for(i = 0; input = inputs[i]; i++) {
			if(!u.hc(input, ignore_inputs)) {
				if((input.type == "checkbox" || input.type == "radio") && input.checked) {
					params[input.name] = input.value;
				}
				else if(!input.type.match(/button|submit|reset|checkbox|radio/i)) {
					params[input.name] = input.value;
				}
			}
		}
		for(i = 0; select = selects[i]; i++) {
			if(!u.hc(select, ignore_inputs)) {
				params[select.name] = select.options[select.selectedIndex].value;
			}
		}
		for(i = 0; textarea = textareas[i]; i++) {
			if(!u.hc(textarea, ignore_inputs)) {
				params[textarea.name] = textarea.value;
			}
		}
		if(send_as && typeof(this.customSend[send_as]) == "function") {
			return this.customSend[send_as](params, form);
		}
		else if(send_as == "json") {
			return u.f.convertNamesToJsonObject(params);
		}
		else if(send_as == "object") {
			return params;
		}
		else {
			var string = "";
			for(param in params) {
				string += (string ? "&" : "") + param + "=" + encodeURIComponent(params[param]);
			}
			return string;
		}
	}
}
u.f.convertNamesToJsonObject = function(params) {
 	var indexes, root, indexes_exsists;
	var object = new Object();
	for(param in params) {
	 	indexes_exsists = param.match(/\[/);
		if(indexes_exsists) {
			root = param.split("[")[0];
			indexes = param.replace(root, "");
			if(typeof(object[root]) == "undefined") {
				object[root] = new Object();
			}
			object[root] = this.recurseName(object[root], indexes, params[param]);
		}
		else {
			object[param] = params[param];
		}
	}
	return object;
}
u.f.recurseName = function(object, indexes, value) {
	var index = indexes.match(/\[([a-zA-Z0-9\-\_]+)\]/);
	var current_index = index[1];
	indexes = indexes.replace(index[0], "");
 	if(indexes.match(/\[/)) {
		if(object.length !== undefined) {
			var i;
			var added = false;
			for(i = 0; i < object.length; i++) {
				for(exsiting_index in object[i]) {
					if(exsiting_index == current_index) {
						object[i][exsiting_index] = this.recurseName(object[i][exsiting_index], indexes, value);
						added = true;
					}
				}
			}
			if(!added) {
				temp = new Object();
				temp[current_index] = new Object();
				temp[current_index] = this.recurseName(temp[current_index], indexes, value);
				object.push(temp);
			}
		}
		else if(typeof(object[current_index]) != "undefined") {
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
		else {
			object[current_index] = new Object();
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
	}
	else {
		object[current_index] = value;
	}
	return object;
}
Util.absoluteX = u.absX = function(node) {
	if(node.offsetParent) {
		return node.offsetLeft + u.absX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.absoluteY = u.absY = function(node) {
	if(node.offsetParent) {
		return node.offsetTop + u.absY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.relativeX = u.relX = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetLeft + u.relX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.relativeY = u.relY = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetTop + u.relY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.actualWidth = u.actualW = function(node) {
	return parseInt(u.gcs(node, "width"));
}
Util.actualHeight = u.actualH = function(node) {
	return parseInt(u.gcs(node, "height"));
}
Util.eventX = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageX : event.pageX);
}
Util.eventY = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageY : event.pageY);
}
Util.browserWidth = u.browserW = function() {
	return document.documentElement.clientWidth;
}
Util.browserHeight = u.browserH = function() {
	return document.documentElement.clientHeight;
}
Util.htmlWidth = u.htmlW = function() {
	return document.body.offsetWidth + parseInt(u.gcs(document.body, "margin-left")) +  + parseInt(u.gcs(document.body, "margin-right"));
}
Util.htmlHeight = u.htmlH = function() {
	return document.body.offsetHeight + parseInt(u.gcs(document.body, "margin-top")) +  + parseInt(u.gcs(document.body, "margin-bottom"));
}
Util.pageScrollX = u.scrollX = function() {
	return window.pageXOffset;
}
Util.pageScrollY = u.scrollY = function() {
	return window.pageYOffset;
}
Util.Hash = u.h = new function() {
	this.catchEvent = function(callback, node) {
		this.node = node;
		this.node.callback = callback;
		hashChanged = function(event) {
			u.h.node.callback();
		}
		if("onhashchange" in window && !u.browser("explorer", "<=7")) {
			window.onhashchange = hashChanged;
		}
		else {
			u.current_hash = window.location.hash;
			window.onhashchange = hashChanged;
			setInterval(
				function() {
					if(window.location.hash !== u.current_hash) {
						u.current_hash = window.location.hash;
						window.onhashchange();
					}
				}, 200
			);
		}
	}
	this.cleanHash = function(string, levels) {
		if(!levels) {
			return string.replace(location.protocol+"//"+document.domain, "");
		}
		else {
			var i, return_string = "";
			var hash = string.replace(location.protocol+"//"+document.domain, "").split("/");
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
	this.getCleanUrl = function(string, levels) {
		string = string.split("#")[0].replace(location.protocol+"//"+document.domain, "");
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var hash = string.split("/");
			levels = levels > hash.length-1 ? hash.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
	this.getCleanHash = function(string, levels) {
		string = string.replace("#", "");
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var hash = string.split("/");
			levels = levels > hash.length-1 ? hash.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
}
Util.Image = u.i = new function() {
	this.load = function(node, src) {
		var image = new Image();
		image.node = node;
		u.ac(node, "loading");
	    u.e.addEvent(image, 'load', u.i._loaded);
		u.e.addEvent(image, 'error', u.i._error);
		image.src = src;
	}
	this._loaded = function(event) {
		u.rc(this.node, "loading");
		if(typeof(this.node.loaded) == "function") {
			this.node.loaded(event);
		}
	}
	this._error = function(event) {
		u.rc(this.node, "loading");
		u.ac(this.node, "error");
		if(typeof(this.node.loaded) == "function" && typeof(this.node.failed) != "function") {
			this.node.loaded(event);
		}
		else if(typeof(this.node.failed) == "function") {
			this.node.failed(event);
		}
	}
	this._progress = function(event) {
		u.bug("progress")
		if(typeof(this.node.progress) == "function") {
			this.node.progress(event);
		}
	}
	this._debug = function(event) {
		u.bug("event:" + event.type);
		u.xInObject(event);
	}
}
Util.random = function(min, max) {
	return Math.round((Math.random() * (max - min)) + min);
}
Util.numToHex = function(num) {
	return num.toString(16);
}
Util.hexToNum = function(hex) {
	return parseInt(hex,16);
}
Util.period = function(format, time) {
	var seconds = 0;
	if(typeof(time) == "object") {
		var argument;
		for(argument in time) {
			switch(argument) {
				case "seconds"		: seconds = time[argument]; break;
				case "milliseconds" : seconds = Number(time[argument])/1000; break;
				case "minutes"		: seconds = Number(time[argument])*60; break;
				case "hours"		: seconds = Number(time[argument])*60*60 ; break;
				case "days"			: seconds = Number(time[argument])*60*60*24; break;
				case "months"		: seconds = Number(time[argument])*60*60*24*(365/12); break;
				case "years"		: seconds = Number(time[argument])*60*60*24*365; break;
			}
		}
	}
	var tokens = /y|n|o|O|w|W|c|d|e|D|g|h|H|l|m|M|r|s|S|t|T|u|U/g;
	var chars = new Object();
	chars.y = 0; // TODO
	chars.n = 0; // TODO 
	chars.o = (chars.n > 9 ? "" : "0") + chars.n; // TODO
	chars.O = 0; // TODO
	chars.w = 0; // TODO
	chars.W = 0; // TODO
	chars.c = 0; // TODO
	chars.d = 0; // TODO
	chars.e = 0; // TODO
	chars.D = Math.floor(((seconds/60)/60)/24);
	chars.g = Math.floor((seconds/60)/60)%24;
	chars.h = (chars.g > 9 ? "" : "0") + chars.g;
	chars.H = Math.floor((seconds/60)/60);
	chars.l = Math.floor(seconds/60)%60;
	chars.m = (chars.l > 9 ? "" : "0") + chars.l;
	chars.M = Math.floor(seconds/60);
	chars.r = Math.floor(seconds)%60;
	chars.s = (chars.r > 9 ? "" : "0") + chars.r;
	chars.S = Math.floor(seconds);
	chars.t = Math.round((seconds%1)*10);
	chars.T = Math.round((seconds%1)*100);
	chars.T = (chars.T > 9 ? "": "0") + Math.round(chars.T);
	chars.u = Math.round((seconds%1)*1000);
	chars.u = (chars.u > 9 ? chars.u > 99 ? "" : "0" : "00") + Math.round(chars.u);
	chars.U = Math.round(seconds*1000);
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};
Util.popup = function(url, settings) {
	var width = "330";
	var height = "150";
	var name = "popup" + new Date().getHours() + "_" + new Date().getMinutes() + "_" + new Date().getMilliseconds();
	var extra = "";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "name"		: name		= settings[argument]; break;
				case "width"	: width		= Number(settings[argument]); break;
				case "height"	: height	= Number(settings[argument]); break;
				case "extra"	: extra		= settings[argument]; break;
			}
		}
	}
	var p;
	p = "width=" + width + ",height=" + height;
	p += ",left=" + (screen.width-width)/2;
	p += ",top=" + ((screen.height-height)-20)/2;
	p += extra ? "," + extra : ",scrollbars";
	document[name] = window.open(url, name, p);
	return document[name];
}
Util.createRequestObject = function() {
	return new XMLHttpRequest();
}
Util.Request = u.request = function(node, url, settings) {
	node.request_url = url;
	node.request_method = "GET";
	node.request_async = true;
	node.request_params = "";
	node.request_headers = false;
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "method"	: node.request_method	= settings[argument]; break;
				case "params"	: node.request_params	= settings[argument]; break;
				case "async"	: node.request_async	= settings[argument]; break;
				case "headers"	: node.request_headers	= settings[argument]; break;
			}
		}
	}
	if(node.request_method.match(/GET|POST|PUT|PATCH/i)) {
		node.HTTPRequest = this.createRequestObject();
		node.HTTPRequest.node = node;
		if(node.request_async) {
			node.HTTPRequest.onreadystatechange = function() {
				if(this.readyState == 4) {
					u.validateResponse(this);
				}
			}
		}
		try {
			if(node.request_method.match(/GET/i)) {
				var params = u.JSONtoParams(node.request_params);
				node.request_url += params ? ((!node.request_url.match(/\?/g) ? "?" : "&") + params) : "";
				node.HTTPRequest.open(node.request_method, node.request_url, node.request_async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node.request_headers) == "object") {
					var header;
					for(header in node.request_headers) {
						node.HTTPRequest.setRequestHeader(header, node.request_headers[header]);
					}
				}
				node.HTTPRequest.send("");
			}
			else if(node.request_method.match(/POST|PUT|PATCH/i)) {
				var params = typeof(node.request_params) == "object" ? JSON.stringify(node.request_params) : node.request_params;
				node.HTTPRequest.open(node.request_method, node.request_url, node.request_async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node.request_headers) == "object") {
					var header;
					for(header in node.request_headers) {
						node.HTTPRequest.setRequestHeader(header, node.request_headers[header]);
					}
				}
				node.HTTPRequest.send(params);
			}
		}
		catch(exception) {
			node.HTTPRequest.exception = exception;
			u.validateResponse(node.HTTPRequest);
			return;
		}
		if(!node.request_async) {
			u.validateResponse(node.HTTPRequest);
		}
	}
	else if(node.request_method.match(/SCRIPT/i)) {
		var key = u.randomString();
		document[key] = new Object();
		document[key].node = node;
		document[key].responder = function(response) {
			var response_object = new Object();
			response_object.node = this.node;
			response_object.responseText = response;
			u.validateResponse(response_object);
		}
		var params = u.JSONtoParams(node.request_params);
		node.request_url += params ? ((!node.request_url.match(/\?/g) ? "?" : "&") + params) : "";
		node.request_url += (!node.request_url.match(/\?/g) ? "?" : "&") + "callback=document."+key+".responder";
		u.ae(u.qs("head"), "script", ({"type":"text/javascript", "src":node.request_url}));
	}
}
Util.JSONtoParams = function(json) {
	if(typeof(json) == "object") {
		var params = "", param;
		for(param in json) {
			params += (params ? "&" : "") + param + "=" + json[param];
		}
		return params
	}
	var object = u.isStringJSON(json);
	if(object) {
		return u.JSONtoParams(object);
	}
	return json;
}
Util.isStringJSON = function(string) {
	if(string.trim().substr(0, 1).match(/[\{\[]/i) && string.trim().substr(-1, 1).match(/[\}\]]/i)) {
		try {
			var test = JSON.parse(string);
			if(typeof(test) == "object") {
				test.isJSON = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.isStringHTML = function(string) {
	if(string.trim().substr(0, 1).match(/[\<]/i) && string.trim().substr(-1, 1).match(/[\>]/i)) {
		try {
			var test = document.createElement("div");
			test.innerHTML = string;
			if(test.childNodes.length) {
				var body_class = string.match(/<body class="([a-z0-9A-Z_ ]+)"/);
				test.body_class = body_class ? body_class[1] : "";
				var head_title = string.match(/<title>([^$]+)<\/title>/);
				test.head_title = head_title ? head_title[1] : "";
				test.isHTML = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.evaluateResponseText = function(responseText) {
	var object;
	if(typeof(responseText) == "object") {
		responseText.isJSON = true;
		return responseText;
	}
	else {
		var response_string;
		if(responseText.trim().substr(0, 1).match(/[\"\']/i) && responseText.trim().substr(-1, 1).match(/[\"\']/i)) {
			response_string = responseText.trim().substr(1, responseText.trim().length-2);
		}
		else {
			response_string = responseText;
		}
		var json = u.isStringJSON(response_string);
		if(json) {
			return json;
		}
		var html = u.isStringHTML(response_string);
		if(html) {
			return html;
		}
		return responseText;
	}
}
Util.validateResponse = function(response){
	var object = false;
	if(response) {
		try {
			if(response.status && !response.status.toString().match(/403|404|500/)) {
				object = u.evaluateResponseText(response.responseText);
			}
			else if(response.responseText) {
				object = u.evaluateResponseText(response.responseText);
			}
		}
		catch(exception) {
			response.exception = exception;
		}
	}
	if(object) {
		if(typeof(response.node.Response) == "function") {
			response.node.Response(object);
		}
		if(typeof(response.node.response) == "function") {
			response.node.response(object);
		}
	}
	else {
		if(typeof(response.node.ResponseError) == "function") {
			response.node.ResponseError(response);
		}
		if(typeof(response.node.responseError) == "function") {
			response.node.responseError(response);
		}
	}
}
Util.cutString = function(string, length) {
	var matches, match, i;
	if(string.length <= length) {
		return string;
	}
	else {
		length = length-3;
	}
	matches = string.match(/\&[\w\d]+\;/g);
	if(matches) {
		for(i = 0; match = matches[i]; i++){
			if(string.indexOf(match) < length){
				length += match.length-1;
			}
		}
	}
	return string.substring(0, length) + (string.length > length ? "..." : "");
}
Util.prefix = function(string, length, prefix) {
	string = string.toString();
	prefix = prefix ? prefix : "0";
	while(string.length < length) {
		string = prefix + string;
	}
	return string;
}
Util.randomString = function(length) {
	var key = "", i;
	length = length ? length : 8;
	var pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	for(i = 0; i < length; i++) {
		key += pattern[u.random(0,35)];
	}
	return key;
}
Util.uuid = function() {
	var chars = '0123456789abcdef'.split('');
	var uuid = [], rnd = Math.random, r, i;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	uuid[14] = '4';
	for(i = 0; i < 36; i++) {
		if(!uuid[i]) {
			r = 0 | rnd()*16;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		}
 	}
	return uuid.join('');
}
Util.stringOr = function(value, replacement) {
	if(value !== undefined && value !== null) {
		return value;
	}
	else {
		return replacement ? replacement : "";
	}	
}
Util.browser = function(model, version) {
	var current_version = false;
	if(model.match(/\bexplorer\b|\bie\b/i)) {
		if(window.ActiveXObject) {
			current_version = navigator.userAgent.match(/(MSIE )(\d+.\d)/i)[2];
		}
	}
	else if(model.match(/\bfirefox\b|\bgecko\b/i)) {
		if(window.navigator.mozIsLocallyAvailable) {
			current_version = navigator.userAgent.match(/(Firefox\/)(\d+\.\d+)/i)[2];
		}
	}
	else if(model.match(/\bwebkit\b/i)) {
		if(document.body.style.webkitTransform != undefined) {
			current_version = navigator.userAgent.match(/(AppleWebKit\/)(\d+.\d)/i)[2];
		}
	}
	else if(model.match(/\bchrome\b/i)) {
		if(window.chrome && document.body.style.webkitTransform != undefined) {
			current_version = navigator.userAgent.match(/(Chrome\/)(\d+)(.\d)/i)[2];
		}
	}
	else if(model.match(/\bsafari\b/i)) {
		if(!window.chrome && document.body.style.webkitTransform != undefined) {
			current_version = navigator.userAgent.match(/(Version\/)(\d+)(.\d)/i)[2];
		}
	}
	else if(model.match(/\bopera\b/i)) {
		if(window.opera) {
			if(navigator.userAgent.match(/Version\//)) {
				current_version = navigator.userAgent.match(/(Version\/)(\d+)(.\d)/i)[2];
			}
			else {
				current_version = navigator.userAgent.match(/(Opera\/)(\d+)(.\d)/i)[2];
			}
		}
	}
	if(current_version) {
		if(!version) {
			return current_version;
		}
		else {
			if(!isNaN(version)) {
				return current_version == version;
			}
			else {
				return eval(current_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.system = function(os, version) {
}
Util.support = function(property) {
	if(document.documentElement) {
		property = property.replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()});
		return property in document.documentElement.style;
	}
	return false;
}
Util.windows = function() {
	return (navigator.userAgent.indexOf("Windows") >= 0) ? true : false;
}
Util.osx = function() {
	return (navigator.userAgent.indexOf("OS X") >= 0) ? true : false;
}
Util.Timer = u.t = new function() {
	this._timers = new Array();
	this.setTimer = function(node, action, timeout) {
		var id = this._timers.length;
		this._timers[id] = {"_a":action, "_n":node, "_t":setTimeout("u.t._executeTimer("+id+")", timeout)};
		return id;
	}
	this.resetTimer = function(id) {
		if(this._timers[id]) {
			clearTimeout(this._timers[id]._t);
			this._timers[id] = false;
		}
	}
	this._executeTimer = function(id) {
		var node = this._timers[id]._n;
		node._timer_action = this._timers[id]._a;
		node._timer_action();
		node._timer_action = null;
		this._timers[id] = false;
	}
	this.setInterval = function(node, action, interval) {
		var id = this._timers.length;
		this._timers[id] = {"_a":action, "_n":node, "_i":setInterval("u.t._executeInterval("+id+")", interval)};
		return id;
	}
	this.resetInterval = function(id) {
		if(this._timers[id]) {
			clearInterval(this._timers[id]._i);
			this._timers[id] = false;
		}
	}
	this._executeInterval = function(id) {
		var node = this._timers[id]._n;
		node._interval_action = this._timers[id]._a;
		node._interval_action();
		node._timer_action = null;
	}
	this.valid = function(id) {
		return this._timers[id] ? true : false;
	}
	this.resetAllTimers = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._t) {
				this.resetTimer(i);
			}
		}
	}
	this.resetAllIntervals = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._i) {
				this.resetInterval(i);
			}
		}
	}
}
Util.getVar = function(param, url) {
	var string = url ? url.split("#")[0] : location.search;
	var regexp = new RegExp("[\&\?\b]{1}"+param+"\=([^\&\b]+)");
	var match = string.match(regexp);
	if(match && match.length > 1) {
		return match[1];
	}
	else {
		return "";
	}
}
u.a.transition = function(node, transition) {
	var duration = transition.match(/[0-9.]+[ms]+/g);
	if(duration) {
		node.duration = duration[0].match("ms") ? parseFloat(duration[0]) : (parseFloat(duration[0]) * 1000);
	}
	else {
		node.duration = false;
	}
	if(u.support(this.variant()+"Transition")) {
		node.style[this.variant()+"Transition"] = "none";
	}
}
u.a.translate = function(node, x, y) {
	var update_frequency = 25;
	node._x = node._x ? node._x : 0;
	node._y = node._y ? node._y : 0;
	if(node.duration && (node._x != x || node._y != y)) {
		node.x_start = node._x;
		node.y_start = node._y;
		node.translate_transitions = node.duration/update_frequency;
		node.translate_progress = 0;
		node.x_change = (x - node.x_start) / node.translate_transitions;
		node.y_change = (y - node.y_start) / node.translate_transitions;
		node.translate_transitionTo = function(event) {
			++this.translate_progress;
			var new_x = (Number(this.x_start) + Number(this.translate_progress * this.x_change));
			var new_y = (Number(this.y_start) + Number(this.translate_progress * this.y_change));
			this.style["msTransform"] = "translate("+ new_x + "px, " + new_y +"px)";
			this.offsetHeight;
			if(this.translate_progress < this.translate_transitions) {
				this.t_translate_transition = u.t.setTimer(this, this.translate_transitionTo, update_frequency);
			}
			else {
				this.style["msTransform"] = "translate("+ this._x + "px, " + this._y +"px)";
				if(typeof(this.transitioned) == "function") {
					this.transitioned(event);
				}
			}
		}
		node.translate_transitionTo();
	}
	else {
		node.style["msTransform"] = "translate("+ x + "px, " + y +"px)";
	}
	node._x = x;
	node._y = y;
	node.offsetHeight;
}
u.a.rotate = function(node, deg) {
	var update_frequency = 25;
	node._rotation = node._rotation ? node._rotation : 0;
	if(node.duration && node._rotation != deg) {
		node.rotate_start = node._rotation;
		node.rotate_transitions = node.duration/update_frequency;
		node.rotate_progress = 0;
		node.rotate_change = (deg - node.rotate_start) / node.rotate_transitions;
		node.rotate_transitionTo = function(event) {
			++this.rotate_progress;
			var new_deg = (Number(this.rotate_start) + Number(this.rotate_progress * this.rotate_change));
			this.style["msTransform"] = "rotate("+ new_deg + "deg)";
			this.offsetHeight;
			if(this.rotate_progress < this.rotate_transitions) {
				this.t_rotate_transition = u.t.setTimer(this, this.rotate_transitionTo, update_frequency);
			}
			else {
				this.style["msTransform"] = "rotate("+ this._rotation + "deg)";
				if(typeof(this.transitioned) == "function") {
					this.transitioned(event);
				}
			}
		}
		node.rotate_transitionTo();
	}
	else {
		node.style["msTransform"] = "rotate("+ deg + "deg)";
	}
	node._rotation = deg;
	node.offsetHeight;
}
u.a.scale = function(node, scale) {
	var update_frequency = 25;
	node._scale = node._scale ? node._scale : 0;
	if(node.duration && node._scale != scale) {
		node.scale_start = node._scale;
		node.scale_transitions = node.duration/update_frequency;
		node.scale_progress = 0;
		node.scale_change = (scale - node.scale_start) / node.scale_transitions;
		node.scale_transitionTo = function(event) {
			++this.scale_progress;
			var new_scale = (Number(this.scale_start) + Number(this.scale_progress * this.scale_change));
			this.style["msTransform"] = "scale("+ new_scale +")";
			this.offsetHeight;
			if(this.scale_progress < this.scale_transitions) {
				this.t_scale_transition = u.t.setTimer(this, this.scale_transitionTo, update_frequency);
			}
			else {
				this.style["msTransform"] = "scale("+ this._scale +")";
				if(typeof(this.transitioned) == "function") {
					this.transitioned(event);
				}
			}
		}
		node.scale_transitionTo();
	}
	else {
		node.style["msTransform"] = "scale("+ scale +")";
	}
	node._scale = scale;
	node.offsetHeight;
}
u.a.setOpacity = function(node, opacity) {
	var update_frequency = 25;
	node._opacity = node._opacity ? node._opacity : u.gcs(node, "opacity");
	if(node.duration && node._opacity != opacity) {
		node.opacity_start = node._opacity;
		node.opacity_transitions = node.duration/update_frequency;
		node.opacity_change = (opacity - node.opacity_start) / node.opacity_transitions;
		node.opacity_progress = 0;
		node.opacity_transitionTo = function(event) {
			++this.opacity_progress;
			var new_opacity = (Number(this.opacity_start) + Number(this.opacity_progress * this.opacity_change));
			u.as(this, "opacity", new_opacity);
			this.offsetHeight;
			if(this.opacity_progress < this.opacity_transitions) {
				this.t_opacity_transition = u.t.setTimer(this, this.opacity_transitionTo, update_frequency);
			}
			else {
				this.style.opacity = this._opacity;
				if(typeof(this.transitioned) == "function") {
					this.transitioned(event);
				}
			}
		}
		node.opacity_transitionTo();
	}
	else {
		node.style.opacity = opacity;
	}
	node._opacity = opacity;
	node.offsetHeight;
}
u.a.setWidth = function(node, width) {
	var update_frequency = 25;
	node._width = node._width ? node._width : u.gcs(node, "width").match("px") ? u.gcs(node, "width").replace("px", "") : 0;
	if(node.duration && node._width != width) {
		node.width_start = node._width;
		node.width_transitions = node.duration/update_frequency;
		node.width_change = (width - node.width_start) / node.width_transitions;
		node.width_progress = 0;
		node.width_transitionTo = function(event) {
			++this.width_progress;
			var new_width = (Number(this.width_start) + Number(this.width_progress * this.width_change));
			u.as(this, "width", new_width+"px");
			this.offsetHeight;
			if(this.width_progress < this.width_transitions) {
				this.t_width_transition = u.t.setTimer(this, this.width_transitionTo, update_frequency);
			}
			else {
				u.as(this, "width", this._width);
				if(typeof(this.transitioned) == "function") {
					this.transitioned(event);
				}
			}
		}
		node.width_transitionTo();
	}
	else {
		var new_width = width.toString().match(/\%|auto/) ? width : width + "px";
		u.as(node, "width", new_width);
	}
	node._width = width;
	node.offsetHeight;
}
u.a.setHeight = function(node, height) {
	var update_frequency = 25;
	node._height = node._height ? node._height : u.gcs(node, "height").match("px") ? u.gcs(node, "height").replace("px", "") : 0;
	if(node.duration && node._height != height) {
		node.height_start = node._height;
		node.height_transitions = node.duration/update_frequency;
		node.height_change = (height - node.height_start) / node.height_transitions;
		node.height_progress = 0;
		node.height_transitionTo = function(event) {
			++this.height_progress;
			var new_height = (Number(this.height_start) + Number(this.height_progress * this.height_change));
			u.as(this, "height", new_height+"px");
			this.offsetHeight;
			if(this.height_progress < this.height_transitions) {
				this.t_height_transition = u.t.setTimer(this, this.height_transitionTo, update_frequency);
			}
			else {
				u.as(this, "height", this._height);
				if(typeof(this.transitioned) == "function") {
					this.transitioned(event);
				}
			}
		}
		node.height_transitionTo();
	}
	else {
		var new_height = height.toString().match(/\%|auto/) ? height : height + "px";
		u.as(node, "height", new_height);
	}
	node._height = height;
	node.offsetHeight;
}
u.a.setBgPos = function(node, x, y) {
	var update_frequency = 25;
	var current_bg_x = u.gcs(node, "background-position-x");
	var current_bg_y = u.gcs(node, "background-position-y");
	node._bg_x = node._bg_x ? node._bg_x : current_bg_x.match("px") ? current_bg_x.replace("px", "") : x;
	node._bg_y = node._bg_y ? node._bg_y : current_bg_y.match("px") ? current_bg_y.replace("px", "") : y;
	if(node.duration && (node._bg_x != x || node._bg_y != y)) {
		node._bg_same_x = false;
		node._bg_same_y = false;
		node.bg_transitions = node.duration/update_frequency;
		if(node._bg_x != x) {
			node.bg_start_x = node._bg_x;
			node.bg_change_x = (x - node.bg_start_x) / node.bg_transitions;
		}
		else {
			node._bg_same_x = true;
		}
		if(node._bg_y != y) {
			node.bg_start_y = node._bg_y;
			node.bg_change_y = (y - node.bg_start_y) / node.bg_transitions;
		}
		else {
			node._bg_same_y = true;
		}
		node.bg_progress = 0;
		node.bg_transitionTo = function(event) {
			++this.bg_progress;
			var new_x, new_y;
			if(!this._bg_same_x) {
				new_x = Math.round((Number(this.bg_start_x) + Number(this.bg_progress * this.bg_change_x)));
			}
			else {
				new_x = this._bg_x;
			}
			if(!this._bg_same_y) {
				new_y = Math.round((Number(this.bg_start_y) + Number(this.bg_progress * this.bg_change_y)));
			}
			else {
				new_y = this._bg_y;
			}
			var new_bg_x = new_x.toString().match(/\%|top|left|right|center|bottom/) ? new_x : (new_x + "px");
			var new_bg_y = new_y.toString().match(/\%|top|left|right|center|bottom/) ? new_y : (new_y + "px");
			u.as(this, "backgroundPosition", new_bg_x + " " + new_bg_y);
			this.offsetHeight;
			if(this.bg_progress < this.bg_transitions) {
				this.t_bg_transition = u.t.setTimer(this, this.bg_transitionTo, update_frequency);
			}
			else {
				var new_bg_x = x.toString().match(/\%|top|left|right|center|bottom/) ? this._bg_x : (this._bg_x + "px");
				var new_bg_y = y.toString().match(/\%|top|left|right|center|bottom/) ? this._bg_y : (this._bg_y + "px");
				u.as(this, "backgroundPosition", new_bg_x + " " + new_bg_y);
				if(typeof(this.transitioned) == "function") {
					this.transitioned(event);
				}
			}
		}
		node.bg_transitionTo();
	}
	else {
		var new_bg_x = x.toString().match(/\%|top|left|right|center|bottom/) ? x : (x + "px");
		var new_bg_y = y.toString().match(/\%|top|left|right|center|bottom/) ? y : (y + "px");
		u.as(node, "backgroundPosition", new_bg_x + " " + new_bg_y);
	}
	node._bg_x = x;
	node._bg_y = y;
	node.offsetHeight;
}
u.a.setBgColor = function(node, color) {
	var update_frequency = 100;
	if(isNaN(node._bg_color_r) || isNaN(node._bg_color_g) || isNaN(node._bg_color_b)) {
		var current_bg_color = u.gcs(node, "background-color");
		var matches;
		var current_bg_color_r, current_bg_color_g, current_bg_color_b;
		var new_bg_color_r = false;
		var new_bg_color_g = false;
		var new_bg_color_b = false;
		if(current_bg_color.match(/#[\da-fA-F]{3,6}/)) {
			if(current_bg_color.length == 7) {
				matches = current_bg_color.match(/#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/);
			}
			else {
				matches = current_bg_color.match(/#([\da-fA-F]{1}),[ ]?([\da-fA-F]{1}),[ ]?([\da-fA-F]{1})/);
			}
			current_bg_color_r = u.hexToNum(matches[1]);
			current_bg_color_g = u.hexToNum(matches[2]); 
			current_bg_color_b = u.hexToNum(matches[3]);
		}
		else if(current_bg_color.match(/rgb\([\d]{1,3},[ ]?[\d]{1,3},[ ]?[\d]{1,3}\)/)) {
			matches = current_bg_color.match(/rgb\(([\d]{1,3}),[ ]?([\d]{1,3}),[ ]?([\d]{1,3})\)/);
			current_bg_color_r = matches[1];
			current_bg_color_g = matches[2];
			current_bg_color_b = matches[3];
		}
		else if(current_bg_color.match(/rgba\([\d]{1,3},[ ]?[\d]{1,3},[ ]?[\d]{1,3},[ ]?[\d\.]+\)/)) {
			matches = current_bg_color.match(/rgba\(([\d]{1,3}),[ ]?([\d]{1,3}),[ ]?([\d]{1,3}),[ ]?([\d\.]+)\)/);
			current_bg_color_r = matches[1];
			current_bg_color_g = matches[2];
			current_bg_color_b = matches[3];
		}
	}
	if(color.match(/#[\da-fA-F]{3,6}/)) {
		if(color.length == 7) {
			matches = color.match(/#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/);
		}
		else {
			matches = color.match(/#([\da-fA-F]{1}),[ ]?([\da-fA-F]{1}),[ ]?([\da-fA-F]{1})/);
		}
		new_bg_color_r = u.hexToNum(matches[1]);
		new_bg_color_g = u.hexToNum(matches[2]);
		new_bg_color_b = u.hexToNum(matches[3]);
	}
	node._bg_color_r = !isNaN(node._bg_color_r) ? node._bg_color_r : !isNaN(current_bg_color_r) ? current_bg_color_r : false;
	node._bg_color_g = !isNaN(node._bg_color_g) ? node._bg_color_g : !isNaN(current_bg_color_g) ? current_bg_color_g : false;
	node._bg_color_b = !isNaN(node._bg_color_b) ? node._bg_color_b : !isNaN(current_bg_color_b) ? current_bg_color_b : false;
	if(node.duration && 
	node._bg_color_r !== false && 
	node._bg_color_g !== false && 
	node._bg_color_b !== false && 
	new_bg_color_r !== false && 
	new_bg_color_g !== false && 
	new_bg_color_b !== false &&
	(new_bg_color_r != node._bg_color_r ||
	new_bg_color_g != node._bg_color_g ||
	new_bg_color_b != node._bg_color_b)) {
		node.bg_color_r_start = node._bg_color_r;
		node.bg_color_g_start = node._bg_color_g;
		node.bg_color_b_start = node._bg_color_b;
		node.bg_color_transitions = node.duration/update_frequency;
		node.bg_color_r_change = (new_bg_color_r - node.bg_color_r_start) / node.bg_color_transitions;
		node.bg_color_g_change = (new_bg_color_g - node.bg_color_g_start) / node.bg_color_transitions;
		node.bg_color_b_change = (new_bg_color_b - node.bg_color_b_start) / node.bg_color_transitions;
		node.bg_color_progress = 0;
		node.bg_color_transitionTo = function(event) {
			++this.bg_color_progress;
			var new_bg_color_r = Math.round(Number(this.bg_color_r_start) + Number(this.bg_color_progress * this.bg_color_r_change));
			var new_bg_color_g = Math.round(Number(this.bg_color_g_start) + Number(this.bg_color_progress * this.bg_color_g_change));
			var new_bg_color_b = Math.round(Number(this.bg_color_b_start) + Number(this.bg_color_progress * this.bg_color_b_change));
			var bg_hex_r = u.prefix(u.numToHex(new_bg_color_r), 2);
			var bg_hex_g = u.prefix(u.numToHex(new_bg_color_g), 2);
			var bg_hex_b = u.prefix(u.numToHex(new_bg_color_b), 2);
			u.as(this, "backgroundColor", "#" + bg_hex_r + bg_hex_g + bg_hex_b);
			this.offsetHeight;
			if(this.bg_color_progress < this.bg_color_transitions) {
				this.t_bg_color_transition = u.t.setTimer(this, this.bg_color_transitionTo, update_frequency);
			}
			else {
				u.as(this, "backgroundColor", this._bg_color);
				if(typeof(this.transitioned) == "function") {
					this.transitioned(event);
				}
			}
		}
		node.bg_color_transitionTo();
	}
	else {
		node.style.backgroundColor = color;
	}
	node._bg_color = color;
	node.offsetHeight;
}

Util.Objects = u.o = new Object();
Util.init = function(scope) {
	var i, node, nodes, object;
	scope = scope && scope.nodeName ? scope : document;
	nodes = u.ges("i\:([_a-zA-Z0-9])+");
	for(i = 0; node = nodes[i]; i++) {
		while((object = u.cv(node, "i"))) {
			u.rc(node, "i:"+object);
			if(object && typeof(u.o[object]) == "object") {
				u.o[object].init(node);
			}
		}
	}
}

u.bug_force = true;
Util.Objects["page"] = new function() {
	this.init = function(page) {
		var node, i;
		page._gentrans_ = "all 0.4s ease-in";
		u.rc(page, "i:page");
		u.e.addEvent(page, "orientationchange", function(event){u.qs("#content").navigate()});
		u.e.drag(page, page);
		page.t_escape = u.t.setTimer(this, this.escape, 10000);
		page.hN = u.qs("#header", page);
		page.hN.page = page;
		page.cN = page.contentNode = u.qs("#content", page);
		page.cN.page = page;
		page.fN = page.footerNode = u.qs("#footer", page);
		page.fN.page = page;
		page.nN = page.navigationNode = u.qs("#navigation", page);
		page.nN = u.ae(page.hN, page.nN);
		page.nN.page = page;
		var nav_nodes = u.qsa("li", page.nN);
		for(i = 0; node = nav_nodes[i]; i++) {
			u.ce(node);
			node.clicked = function(event) {
				location.hash = u.h.cleanHash(this.url);
			}
		}
		page._h1 = u.qs("h1", page.hN);
		page._h1.url = u.qs(".servicenavigation .front a", page).href;
		u.e.click(page._h1);
		page._h1.clicked = function(event) {
			location.hash = u.h.cleanHash(this.url);
		}
		page.contact = u.qs(".servicenavigation .contact", page);
		u.ce(page.contact);
		page.contact.clicked = function(event) {
			location.hash = u.h.cleanHash(this.url);
		}
		page.home = u.qs(".servicenavigation .front", page);
		u.ce(page.home);
		page.home.clicked = function(event) {
			location.hash = u.h.cleanHash(this.url);
		}
		page.ready = function() {
			u.h.catchEvent(this.cN.navigate, this.cN);
			this.transitioned = function() {
				this.transitioned = null;
				u.a.transition(this, "none");
				u.ac(this, "ready");
				this.cN.ready();
			}
			if(u.gcs(this, "opacity") == 1) {
				this.transitioned();
			}
			else {
				u.a.transition(this, this._gentrans_); // creates a blink
				u.a.setOpacity(this, 1);
			}
		}
		page.cN.ready = function() {
			if(u.hc(this.page, "ready")) {
				if(!u.hc(this, "ready") && this.page.scene && this.page.scene.initiated) {
					this.transitioned = function() {
						this.transitioned = null;
						u.a.transition(this, "none");
						u.ac(this, "ready");
						if(this.page.scene && typeof(this.page.scene.enter) == "function") {
							this.page.scene.enter();
						}
					}
					if(u.gcs(this, "opacity") == 1) {
						this.transitioned();
					}
					else {
						u.a.transition(this, this.page._gentrans_);
						u.a.setOpacity(this, 1);
					}
				}
				var nodes = u.qsa("li", this.page.hN);
				for(i = 0; node = nodes[i]; i++) {
					if(node.url && node.url.replace(location.protocol + "//" + document.domain, "") == location.hash.replace("#", "")) {
						u.ac(node, "selected");
					}
					else {
						u.rc(node, "selected");
					}
				}
			}
		}
		page.cN.navigate = function() {
			if(this.page.scene && typeof(this.page.scene.keycuts) == "function") {
				u.e.removeEvent(document.body, "keyup", this.page.scene.keycuts);
			}
			this.response = function(response) {
				u.setClass(document.body, response.body_class);
				this.innerHTML = u.qs("#content", response).innerHTML;
				document.title = response.head_title;
				u.init(this);
			}
			this.transitioned = function(event) {
				u.a.transition(this, "none");
				this.transitioned = null;
				u.request(this, location.hash.replace("#", ""));
			}
			if(u.qs("#fullscreen")) {
				u.qs("#fullscreen").back();
			}
			if(u.gcs(this, "opacity") == 0) {
				this.transitioned();
			}
			else {
				u.a.transition(this, this.page._gentrans_);
				u.a.setOpacity(this, 0);
			}
			u.rc(this, "ready");
		}
		var pageintro = u.ae(document.body, "div", {"class":"pageintro"});
		pageintro.page = page;
		u.a.transition(pageintro, page._gentrans_);
		var pageintro_info = u.ge("pageintro:[0-9]+");
		if(pageintro_info) {
			u.i.load(pageintro, "/images/"+u.cv(pageintro_info, "pageintro")+"/x"+page.offsetHeight+".jpg");
			pageintro.loaded = function(event) {
				this.style.backgroundImage = "url("+event.target.src+")";
				u.a.setOpacity(this, 1);
			}
		}
		else {
			pageintro.innerHTML = "<h1>Photographer David Perrin</h1>";
			u.a.setOpacity(pageintro, 1);
		}
		u.e.click(pageintro);
		pageintro.clicked = function(event) {
			u.t.resetTimer(this.t_hide);
			this.transitioned = function(event) {
				this.parentNode.removeChild(this);
				u.qs("#page").ready();
			}
			if(u.gcs(this, "opacity") == 0) {
				this.transitioned();
			}
			else {
				u.a.transition(this, this.page._gentrans_);
				u.a.setOpacity(this, 0);
			}
		}
		pageintro.t_hide = u.t.setTimer(pageintro, pageintro.clicked, 3000);
		if(location.hash.length < 2) {
			location.hash = u.h.cleanHash(location.href);
			u.init(page.cN);
		}
		else if(location.hash != "#"+u.h.cleanHash(location.href.split("#")[0])) {
			page.cN.navigate();
		}
		else {
			u.init(page.cN);
		}
		u.t.resetTimer(page.t_escape);
	}
	this.escape = function() {
		document.body.innerHTML = '<div id="error"><div class="wrap"><a href="/">An error ocurred - Please reload page</a><br /><br /><a href="/help" class="smaller">I already tried reloading. Help me!</a></div></div>';
	}
}
function static_init() {
	u.o.page.init(u.qs("#page"));
}
u.e.addDOMReadyEvent(static_init);

Util.Objects["front"] = new function() {
	this.init = function(scene) {
		var page = u.qs("#page");
		page.scene = scene;
		scene.page = page;
		scene.initiated = false;
		scene.enter = function() {
			var i, node;
			var nodes = u.qsa("li", this.list);
			for(i = 0; node = nodes[i]; i++) {
				u.a.transition(node, this.page._gentrans_)
				u.a.setWidth(node, node.image.width);
			}
		}
		scene.ready = function() {
			if(u.qsa("li.ready", this.list).length != u.qsa("li", this.list).length || this.initiated) {
				return;
			}
			else {
				if(this.offsetWidth < this.list.offsetWidth) {
					u.o.carousel.init(this);
				}
				this.initiated = true;
				this.page.cN.ready();
			}
		}
		var list = u.ae(scene, "ul");
		list.scene = scene;
		list.page = page;
		scene.list = list;
		u.as(list, "width", 0);
		var i, node, nav_node;
		var nav_nodes = u.qsa("li", page.nN);
		for(i = 0; nav_node = nav_nodes[i]; i++) {
			node = list.appendChild(nav_node.cloneNode(true));
			node.url = nav_node.url;
			node.list = list;
			u.e.click(node);
			node.clicked = function(event) {
				location.hash = u.h.cleanHash(this.url);
			}
			node.response = function(response) {
				var item = u.qs("#content li", response);
				if(item) {
					var id = u.cv(item, "id");
					u.a.setWidth(this, 0);
					this.loaded = function(event) {
						this.image = event.target;
						u.as(this, "backgroundImage", "url("+this.image.src+")");
						u.a.setWidth(this.list, this.list.offsetWidth + this.image.width);
						u.ac(this, "ready");
						this.list.scene.ready();
					}
					u.i.load(this, "/images/"+id+"/x"+this.offsetHeight+".jpg");
				}
				else {
					u.ac(this, "ready");
					this.list.scene.ready();
				}
			}
			u.request(node, node.url);
		}
	}
 }

Util.Objects["contact"] = new function() {
	this.init = function(scene) {
		var page = u.qs("#page");
		page.scene = scene;
		scene.page = page;
		scene.enter = function() {
			var vcard = u.qs(".vcard", this);
			u.a.transition(vcard, this.page._gentrans_);
			u.a.setOpacity(vcard, 1);
		}
		scene.ready = function() {
			this.initiated = true;
			this.page.cN.ready();
		}
		scene.ready();
	}
}

Util.Objects["list"] = new function() {
	this.init = function(scene) {
		var page = u.qs("#page");
		page.scene = scene;
		scene.page = page;
		scene.enter = function() {
			var i, node;
			var nodes = u.qsa("li", this.list);
			for(i = 0; node = nodes[i]; i++) {
				u.a.transition(node, this.page._gentrans_)
				u.a.setWidth(node, node.image.width);
			}
		}
		scene.ready = function() {
			if(u.qsa("li.ready", this.list).length != u.qsa("li", this.list).length || this.initiated) {
				return;
			}
			else {
				if(this.offsetWidth < this.list.offsetWidth) {
					u.o.carousel.init(this);
				}
				this.initiated = true;
				this.page.cN.ready();
			}
		}
		var list = u.qs("ul", scene);
		list.scene = scene;
		list.page = page;
		scene.list = list;
		u.a.setWidth(list, 0);
		var i, node;
		var nodes = u.qsa("li", list);
		for(i = 0; node = nodes[i]; i++) {
			node.list = list;
			node.i = i;
			u.a.setWidth(node, 0);
			u.ce(node);
			node.clicked = function() {
				this.list.fullScreen(this.i);
			}
			var id = u.cv(node, "id");
			node.loaded = function(event) {
				this.image = event.target;
				u.as(this, "backgroundImage", "url("+this.image.src+")");
				u.a.setWidth(this.list, this.list.offsetWidth + this.image.width);
				u.ac(this, "ready");
				this.list.scene.ready();
			}
			u.i.load(node, "/images/"+id+"/x"+node.offsetHeight+".jpg");
		}
		list.fullScreen = function(index) {
			var i, item, nodes;
			var boundary = 0;
			nodes = u.qsa("li", this);
			for(i = 0; node = nodes[i]; i++) {
				if(boundary > Math.abs(this._x) + this.scene.offsetWidth) {
					u.as(node, "visibility", "hidden");
				}
				boundary = boundary + node.offsetWidth;
				if(boundary < Math.abs(this._x)) {
					u.as(node, "visibility", "hidden");
				}
			}
			var fullscreen = u.qs("#fullscreen");
			if(!fullscreen) {
				fullscreen = u.ae(document.body, "div", ({"id":"fullscreen"}));
				fullscreen.list = fullscreen.appendChild(this.cloneNode(true));
				u.a.transition(fullscreen.list, "none");
				nodes = u.qsa("li", fullscreen.list);
				var screen_height = fullscreen.offsetHeight;
				var screen_width = fullscreen.offsetWidth;
				var list_width = screen_width * nodes.length;
				u.as(fullscreen.list, "width", list_width+"px");
				u.as(fullscreen.list, "height", screen_height+"px");
				for(i = 0; item = nodes[i]; i++) {
					u.as(item, "width", screen_width+"px");
					u.as(item, "height", screen_height+"px");
					u.as(item, "display", "inline-block");
					u.as(item, "visibility", "visible");
					u.e.dblclick(item);
					item.dblclicked = function(event) {
						u.qs("#fullscreen").closeFullscreen();
					}
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
				if(list_width > screen_width) {
					u.e.swipe(fullscreen.list, new Array(screen_width - list_width, 0, list_width, screen_height), {"strict":false, "elastica":250});
				}
				fullscreen.list.swipedRight = function() {
					this.parentNode.navigation(this.parentNode.current_index-1);
				}
				fullscreen.list.swipedLeft = function() {
					this.parentNode.navigation(this.parentNode.current_index+1);
				}
				u.a.transition(fullscreen, "all 1s ease-in");
				u.a.setOpacity(fullscreen, 1);
				fullscreen.loadImages = function(nodes) {
					if(nodes.length) {
						var node = nodes.shift();
						if(node && !node.initiated) {
							node.fullscreen = this;
							node.initiated = true;
							node.nodes = nodes;
							node.loaded = function(event) {
								this.style.backgroundImage = "url("+event.target.src+")";
								this.fullscreen.loadImages(this.nodes);
							}
							u.i.load(node, "/images/"+u.cv(node, "id")+"/x"+node.offsetHeight+".jpg");
						}
						else {
							this.loadImages(nodes);
						}
					}
				}
				fullscreen.navigation = function(index) {
					var id;
					var items = u.qsa("li", this);
					index = index < 0 ? 0 : (index >= items.length ? items.length-1 : index);
					var item = items[index];
					var i1 = u.ns(item);
					var i2 = u.ps(item);
					var i3 = i1 ? u.ns(i1) : false;
					var i4 = i2 ? u.ps(i2) : false;
					this.loadImages(new Array(item, i1, i2, i3, i4));
					u.a.transition(this.list, "all 0.5s ease-out");
					u.a.translate(this.list, -index*this.offsetWidth, 0);
					this.current_index = index;
					if(typeof(this.update) == "function") {
						this.update();
					}
				}
			}
			fullscreen.closeFullscreen = function() {
				this.transitioned = function(event) {
					this.parentNode.removeChild(this);
					var i, node;
					var page = u.qs("#page");
					var nodes = u.qsa("li", page.scene.list);
					for(i = 0; node = nodes[i]; i++) {
						u.as(node, "visibility", "visible");
					}
				}
				u.a.setOpacity(this, 0);
			}
			fullscreen.controls = u.ae(fullscreen, "div", {"class":"controls"});
			fullscreen.controls.bn_close = u.ae(fullscreen, "div", {"class":"close"});
			fullscreen.controls.bn_close.fullscreen = fullscreen;
			u.e.click(fullscreen.controls.bn_close);
			fullscreen.controls.bn_close.clicked = function(event) {
				this.fullscreen.closeFullscreen();
			}
			if(u.e.event_pref == "mouse") {
				fullscreen.update = function() {
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
					this.fullscreen.list.swipedLeft();
				}
				u.e.click(fullscreen.controls.bn_left);
				fullscreen.controls.bn_left.clicked = function(event) {
					this.fullscreen.list.swipedRight();
				}
			}
			fullscreen.navigation(index);
		}
	}
}

Util.Objects["carousel"] = new function() {
	this.init = function(carousel) {
		u.e.drag(carousel.list, [carousel.offsetWidth - carousel.list.offsetWidth, 0, carousel.list.offsetWidth, carousel.list.offsetHeight], {"strict":false, "elastica":250});
		if(u.e.event_pref == "mouse") {
			carousel.list.carousel = carousel;
			carousel.list.dropped = carousel.list.projected = function() {
				this.update();
			}
			carousel.list.update = function(next_x) {
				var new_pos = !isNaN(next_x) ? next_x : this._x;
				if(new_pos >= 0) {
					new_pos = 0;
					u.a.transition(this.controls.bn_left, "all 0.2s ease-in");
					u.a.setOpacity(this.controls.bn_left, 0);
				}
				else {
					u.a.transition(this.controls.bn_left, "all 0.2s ease-in");
					u.a.setOpacity(this.controls.bn_left, 1);
				}
				if(new_pos <= this.start_drag_x) {
					new_pos = this.start_drag_x;
					u.a.transition(this.controls.bn_right, "all 0.2s ease-in");
					u.a.setOpacity(this.controls.bn_right, 0);
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
			carousel.list.controls = u.ae(carousel, "div", {"class":"controls"});
			carousel.list.controls.bn_right = u.ae(carousel.list.controls, "div", {"class":"right"});
			carousel.list.controls.bn_right.list = carousel.list;
			carousel.list.controls.bn_left = u.ae(carousel.list.controls, "div", {"class":"left"});
			carousel.list.controls.bn_left.list = carousel.list;
			carousel.list.update();
			u.e.click(carousel.list.controls.bn_right);
			u.e.click(carousel.list.controls.bn_left);
			carousel.list.controls.bn_right.clicked = function(event) {
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
				}
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
				this.list.update(next_x);
			}
			carousel.list.controls.bn_left.clicked = function(event) {
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
				}
				prev = first_in_view;
				prev_width = 0;
				while(prev && prev_width + prev.offsetWidth <= this.list.carousel.offsetWidth) {
					prev_width = prev_width + prev.offsetWidth;
					prev = u.ps(prev);
				}
				if(prev) {
					next_x = -(prev.offsetLeft);
				}
				else {
					next_x = 0;
				}
				this.list.update(next_x);
			}
			carousel.keycuts = function(event) {
				if(event.keyCode == 27) {
					u.e.kill(event);
					if(u.qs("#fullscreen")) {
						u.qs("#fullscreen .close").clicked(event);
					}
				}
				if(event.keyCode == 37) {
					u.e.kill(event);
					if(u.qs("#fullscreen")) {
						u.qs("#fullscreen .left").clicked(event);
					}
					else {
						u.qs("#content .left").clicked(event);
					}
				}
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

u.ga_account = 'UA-20543549-1';

if(u.ga_account) {
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', u.ga_account]);
	_gaq.push(['_trackPageview']);
	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	u.stats = new function() {
		this.pageView = function(url) {
			_gaq.push(['_trackPageview', url]);
		}
		this.event = function(node, action, label) {
			_gaq.push(['_trackEvent', location.href.replace(document.location.protocol + "//" + document.domain, ""), action, (label ? label : this.nodeSnippet(node))]);
		}
		this.customVar = function(slot, name, value, scope) {
			_gaq.push(['_setCustomVar',
			      slot,		// This custom var is set to slot #1.  Required parameter.
			      name,		// The name of the custom variable.  Required parameter.
			      value,	// The value of the custom variable.  Required parameter.
			      scope		// Sets the scope to visitor-level.  Optional parameter.
			 ]);
		}
		this.nodeSnippet = function(e) {
			if(e.textContent != undefined) {
				return u.cutString(e.textContent.trim(), 20) + "(<"+e.nodeName+">)";
			}
			else {
				return u.cutString(e.innerText.trim(), 20) + "(<"+e.nodeName+">)";
			}
		}
	}
}
