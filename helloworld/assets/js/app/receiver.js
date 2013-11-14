define(

    ["./config", "jquery"],

    function (config, $) {
        
        "use strict";

        var receiver = {

            init: function () {
                console.log("Receiver Startup");
            }

        };

        return receiver;

    }

);


