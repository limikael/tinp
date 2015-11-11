/**
 * A subset of Promises/A+.
 * @class Thenable
 */
function Thenable() {
	if (!(this instanceof Thenable))
		return new Thenable();

	this.decided = false;
	this.handlersUsed = false;
}

/**
 * Then.
 * @method resolve
 */
Thenable.prototype.then = function(resolutionHandler, rejectionHandler) {
	if (this.handlersUsed)
		throw new Error("Handlers already registered or called.");

	this.handlersUsed = true;

	if ((typeof resolutionHandler) == "object" &&
		resolutionHandler && !rejectionHandler &&
		resolutionHandler.then) {
		var chained = resolutionHandler;

		this.resolutionHandler = chained.resolve.bind(chained);
		this.rejectionHandler = chained.reject.bind(chained);
		return;
	}

	/*	if (typeof resolutionHandler == "object" &&
		}*/

	this.resolutionHandler = resolutionHandler;
	this.rejectionHandler = rejectionHandler;
}

/**
 * Resolve.
 * @method resolve
 */
Thenable.prototype.resolve = function(result) {
	if (this.decided)
		throw new Error("Already decided.");

	this.decided = true;
	process.nextTick(this.callHandler.bind(this, true, result));
}

/**
 * Reject.
 * @method resolve
 */
Thenable.prototype.reject = function(reason) {
	if (this.decided)
		throw new Error("Already decided.");

	this.decided = true;
	process.nextTick(this.callHandler.bind(this, false, reason));
}

/**
 * Call handler.
 * @method callHandler
 * @private
 */
Thenable.prototype.callHandler = function(resolved, parameter) {
	this.handlersUsed = true;

	var handler;

	if (resolved)
		handler = this.resolutionHandler;

	else
		handler = this.rejectionHandler;

	//console.log("in callHandler, handler=" + handler);

	if (handler) {
		try {
			handler(parameter);
		} catch (e) {
			console.error("Unhandled: " + e);
			console.log(e.stack);
			throw e;
		}
	}
}

/**
 * Return a resolved thenable.
 * @method resolved
 */
Thenable.resolved = function(parameter) {
	var t = new Thenable();
	t.resolve(parameter);
	return t;
}

/**
 * Return a rejected thenable.
 * @method rejected
 */
Thenable.rejected = function(parameter) {
	var t = new Thenable();
	t.reject(parameter);
	return t;
}

/**
 * Wait for all to resolve or any to reject.
 * @method all
 */
Thenable.all = function( /* ... */ ) {
	var thenable = new Thenable();
	var i;
	var thenables = [];
	var decided = false;
	var resolvedCount = 0;

	for (i = 0; i < arguments.length; i++)
		thenables = thenables.concat(arguments[i]);

	if (!thenables.length)
		return Thenable.resolved();

	function onResolved() {
		resolvedCount++;

		if (!decided && resolvedCount >= thenables.length) {
			decided = true;
			thenable.resolve();
		}
	}

	function onRejected(e) {
		if (!decided) {
			decided = true;
			thenable.reject(e);
		}
	}

	for (i = 0; i < thenables.length; i++) {
		if (!thenables[i])
			onResolved();

		else
			thenables[i].then(onResolved, onRejected);
	}

	return thenable;
}

/**
 * Wait for any to resolve or all to reject.
 * @method all
 */
Thenable.race = function( /* ... */ ) {
	var thenable = new Thenable();
	var i;
	var thenables = [];
	var decided = false;
	var resolvedCount = 0;

	for (i = 0; i < arguments.length; i++)
		thenables = thenables.concat(arguments[i]);

	function onRejected() {
		resolvedCount++;

		if (!decided && resolvedCount >= thenables.length) {
			decided = true;
			thenable.reject();
		}
	}

	function onResolved(r) {
		if (!decided) {
			decided = true;
			thenable.resolve(r);
		}
	}

	for (i = 0; i < thenables.length; i++) {
		thenables[i].then(onResolved, onRejected);
	}

	return thenable;
}

/**
 * Create a resolved Thenable.
 * @method resolved
 */
Thenable.resolved = function(result) {
	var t = new Thenable;
	t.resolve(result);

	return t;
}

/**
 * Create a rejected Thenable.
 * @method rejected
 */
Thenable.rejected = function(reason) {
	var t = new Thenable;
	t.reject(reason);

	return t;
}

module.exports = Thenable;