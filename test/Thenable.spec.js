Thenable = require("../src/Thenable");

describe("Thenable", function() {
	it("can be used for asynchronous operations", function(done) {
		var successSpy = jasmine.createSpy("success");

		var t = new Thenable();
		t.then(successSpy);
		t.resolve();

		expect(successSpy).not.toHaveBeenCalled();

		setTimeout(function() {
			expect(successSpy).toHaveBeenCalled();
			done();
		}, 0);
	});

	it("then can be called after resolve", function(done) {
		var successSpy = jasmine.createSpy("success");

		var t = new Thenable();
		t.resolve();
		t.then(successSpy);

		expect(successSpy).not.toHaveBeenCalled();

		setTimeout(function() {
			expect(successSpy).toHaveBeenCalled();
			done();
		}, 0);
	});

	it("can be notified with a parameter", function(done) {
		var successSpy = jasmine.createSpy("success");

		var t = new Thenable();
		t.then(successSpy);
		t.resolve("hello");

		expect(successSpy).not.toHaveBeenCalled();

		setTimeout(function() {
			expect(successSpy).toHaveBeenCalledWith("hello");
			done();
		}, 0);
	});

	it("can be notified of an error", function(done) {
		var errorSpy = jasmine.createSpy("error");

		var t = new Thenable();
		t.then(null, errorSpy);
		t.reject("hello");

		expect(errorSpy).not.toHaveBeenCalled();

		setTimeout(function() {
			expect(errorSpy).toHaveBeenCalledWith("hello");
			done();
		}, 0);
	});

	it("can't be chained", function() {
		var spy1 = jasmine.createSpy("spy one");
		var spy2 = jasmine.createSpy("spy two");

		var t = new Thenable();

		expect(function() {
			t.then(spy1).then(spy2);
		}).toThrow();
	});

	it("can only have one set of resolution handlers", function() {
		var spy1 = jasmine.createSpy("spy one");
		var spy2 = jasmine.createSpy("spy two");

		var t = new Thenable();

		t.then(spy1);

		expect(function() {
			t.then(spy2);
		}).toThrow();
	});

	it("can wait for the resolution of a set of thenables", function(done) {
		var spy = jasmine.createSpy("spy one");

		var t1 = new Thenable();
		var t2 = new Thenable();

		Thenable.all(t1, t2).then(spy);

		t1.resolve("hello");

		setTimeout(function() {
			expect(spy).not.toHaveBeenCalledWith(undefined);

			t2.resolve("world");
			setTimeout(function() {
				expect(spy).toHaveBeenCalledWith(undefined);
				done();
			}, 0);
		}, 0);
	});

	it("all resolves on an empty array", function(done) {
		var spy = jasmine.createSpy();

		Thenable.all([]).then(spy);

		setTimeout(function() {
			expect(spy).toHaveBeenCalled();
			done();
		}, 10);
	});

	it("all rejects if one rejects", function(done) {
		var spy = jasmine.createSpy("spy one");

		var t1 = new Thenable();
		var t2 = new Thenable();

		Thenable.all(t1, t2).then(null, spy);

		t1.reject("hello");

		setTimeout(function() {
			expect(spy).toHaveBeenCalledWith("hello");
			done();
		}, 0);
	});

	it("can wait for the resolution of any of a set of thenables", function(done) {
		var spy = jasmine.createSpy("spy one");

		var t1 = new Thenable();
		var t2 = new Thenable();

		Thenable.race(t1, t2).then(spy);

		t1.resolve("hello");

		setTimeout(function() {
			expect(spy).toHaveBeenCalledWith("hello");
			done();
		}, 0);
	});

	it("can be used without new", function(done) {
		var successSpy = jasmine.createSpy("success");

		var t = Thenable();
		t.then(successSpy);
		t.resolve();

		expect(successSpy).not.toHaveBeenCalled();

		setTimeout(function() {
			expect(successSpy).toHaveBeenCalled();
			done();
		}, 0);
	});

	it("can create a resolved thenable", function(done) {
		var successSpy = jasmine.createSpy("success");

		Thenable.resolved("hello").then(successSpy);

		expect(successSpy).not.toHaveBeenCalled();

		setTimeout(function() {
			expect(successSpy).toHaveBeenCalledWith("hello");
			done();
		}, 0);
	});

	it("can create a rejected thenable", function(done) {
		var spy = jasmine.createSpy();

		Thenable.rejected("hello").then(null, spy);

		expect(spy).not.toHaveBeenCalled();

		setTimeout(function() {
			expect(spy).toHaveBeenCalledWith("hello");
			done();
		}, 0);
	});

	it("all treats undefined as resolved thenables", function(done) {
		var spy = jasmine.createSpy();

		var t = new Thenable();

		Thenable.all(undefined, undefined, t).then(spy);

		setTimeout(function() {
			expect(spy).not.toHaveBeenCalled();
			t.resolve();

			setTimeout(function() {
				expect(spy).toHaveBeenCalled();
				done();
			}, 0);
		}, 0);
	});

	it("can chain another thenable", function(done) {
		var spy = jasmine.createSpy();

		var t = new Thenable();
		var u = new Thenable();

		u.then(spy);
		t.then(u);

		t.resolve();
		setTimeout(function() {
			expect(spy).toHaveBeenCalled();
			done();
		}, 0);
	});
});