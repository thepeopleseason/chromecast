require(
    ["app/chromecast"],
    function (chromecast) {
        console.log("Startup");
        chromecast.init();
    }
);
