tinp
====

Tinp is not Promises.

About
-----

What is tinp? It's not a promise as in [Promises/A+](https://github.com/promises-aplus) because all the complicated
programming theory hurts my brain. It could stand for Thenables is not Promises, but that wouldn't be gramatically
correct. So what is it? It is something that can be used for turning this code:

````
var someTask=new SomeTask();

someTask.on("complete", function(result) {
    // handle completion.
});

someTask.on("error", function(reason) {
    // handle error.
});

someTask.do();
````

Into this:

````
var someTask=new SomeTask();

someTask.do().then(
    function(result) {
        // handle completion.
    },

    function(reason) {
        // handle error.
    }
);
````

Nothing more, nothing less. And as such, I find it useful.

It may or may not be passed into something else that accepts a thenable.

How to use
----------

Use it like so:

````
var Thenable=require("tinp");

function MyOperation() {
}

MyOperation.prototype.do=function() {
    this.thenable=new Thenable();

    // Initiate the operation, whatever it may be...

    return this.thenable;
}

MyOperation.prototype.someListener=function() {
    // Some time at a later stage we want to signal completion.
    this.thenable.resolve(result);
}
````

What's the difference?
----------------------

What is the difference between Tinp and real Promises?

* The function `then` can only be called once.
* The `then` function does not return anything useful.

Reference
---------

In short, if we have:

````
var Thenable=require("tinp");

var t=new Thenable();
````

Then:

* `t.then(function() {}, function() {})` - Register resolution handlers.
* `t.resolve(result)` - Resolve the Thenable with `result`.
* `t.reject(reason)` - Reject the Thenable because of `reason`.
* `Thenable.all(a,b,c,...).then()` - Wait for all parameters to resolve.
* `Thenable.race(a,b,c,...).then()` - Wait for any of the parameters to resolve.
