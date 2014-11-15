tinp
====

Tinp Is Not Promises.

* [About](#about)
* [How to use](#how-to-use)
* [Why?](#why)
* [What's the difference](#whats-the-difference)
* [Reference](#reference)

About
-----

What is a tinp? A tinp is not a promise as in [Promises/A+](https://github.com/promises-aplus) because all the complicated
programming theory hurts my brain. It could stand for Thenables Is Not Promises, but that would not be gramatically
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

It can in many cases be used together with other stuff that accepts a thenable.

How to use
----------

First, install it with:

````
npm install tinp
````

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

Why?
----

So why create such a thing? First, I want to say that I do understand that I deliberatly miss the point with Promises, as
explained in [this](https://blog.domenic.me/youre-missing-the-point-of-promises/) article. Promises is a beautiful concept.
But I find it beautiful kind of in the same way as LISP is beautiful. That is to say, it is beautiful, but that beauty
does not neccesarily imply _usefulness_. I do like the syntax with the `then` however, and I found myself frequently use
it for what is referred to in the article as _callback aggregation_. So I decided to create this little thing to only do that.

Why not rely on a full implementation, even if I just use a subset? This is because, if I used for example
[Q](https://github.com/kriskowal/q), it would look like this:

````
var deferred = Q.defer();
FS.readFile("foo.txt", "utf-8", function (error, text) {
    if (error) {
        deferred.reject(new Error(error));
    } else {
        deferred.resolve(text);
    }
});
return deferred.promise;
````

So, the thing that is a Q is not the actualy a Promise, but rather it containse a promise. IMO, this is unnecesary syntax and
complexity. With Tinp, it would look like:

````
var t = Thenable(); // or var t = new Thenable();, either of them works.
FS.readFile("foo.txt", "utf-8", function (error, text) {
    if (error) {
        t.reject(new Error(error));
    } else {
        t.resolve(text);
    }
});
return t;
````

What's the difference?
----------------------

What is the difference between thee pseudo Promises and real Promises?

* The function `then` can only be called once.
* The `then` function does not return anything useful.

Reference
---------

In short, if we have:

````
var Thenable = require("tinp");

var t = new Thenable();
````

Then:

* `t.then(function() {}, function() {})` - Register resolution handlers.
* `t.resolve(result)` - Resolve the Thenable with `result`.
* `t.reject(reason)` - Reject the Thenable because of `reason`.
* `Thenable.resolved(result)` - Create a resolved thenable.
* `Thenable.rejected(reason)` - Create a rejected thenable.
* `Thenable.all(a,b,c,...).then()` - Wait for all to resolve. Reject if any rejects.
* `Thenable.race(a,b,c,...).then()` - Wait for any to resolve. Reject if all rejects.
