# targetprocess-api

## Sample usage

    const factory = require("targetprocess-api");
    const tp = factory(config);

    tp.create("Projects", {Name: "My Project"})
        .then(function (entity) {
            // ...
        });

    tp.retrieve("UserStories").take(10).get()
        .then(function (items) {
            // ...
        });

    tp.update("Bugs", {Id: 3, Name: "My bug"});

    tp.remove("Releases", 12);
    
