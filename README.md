tinp
====

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

Nothing more, nothing less. And as such, I find i useful.
