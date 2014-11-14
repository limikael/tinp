/**
 * A subset of Promises/A+.
 * @class Thenable
 */
function Thenable() {
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
	process.nextTick(this.callHandler.bind(this, this.resolutionHandler, result));
}

/**
 * Reject.
 * @method resolve
 */
Thenable.prototype.reject = function(reason) {
	if (this.decided)
		throw new Error("Already decided.");

	this.decided = true;
	process.nextTick(this.callHandler.bind(this, this.rejectionHandler, reason));
}

/**
 * Call handler.
 * @method callHandler
 * @private
 */
Thenable.prototype.callHandler = function(handler, parameter) {
	this.handlersUsed = true;

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
	var thenables = [].concat(arguments);
	var count = thenables.length;
	var thenable = new Thenable();
	var i;
	var decided = false;

	function resolved() {
		resolvedCount++;

		if (!decided && resolvedCount >= thenables.length) {
			decided = true;
			thenable.resolve();
		}
	}

	function rejected(e) {
		decided = true;
		thenable.reject(e);
	}

	for (i = 0; i < thenables.length; i++) {
		thenables[i].then(resolved, rejected);
	}

	return thenable;
}