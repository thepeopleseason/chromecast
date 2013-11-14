define(

    ["./config", "jquery"],

    function (config, $) {
        
        "use strict";

        var sender = {

            cache: {
                castApi: null
            },

            els: {
                killSwitch: $(".kill-switch")
            },

            init: function () {
                console.log("Sender Startup");
                sender.setupEvents();
            },

            setupEvents: function () {
                var api = sender.cache.castApi,
                    $killSwitch = sender.els.killSwitch;
    		    window.addEventListener("message", function (event) {
			        if (event.source === window 
                        && event.data 
                        && event.data.source === "CastApi" 
                        && event.data.event === "Hello") {
                        sender.setupAPI();
			        }
		        });
	        	$killSwitch.on("click", function() {
			        api.stopActivity(
                        sender.cache.activity.activityId, 
                        function(){
				            sender.cache.activity = null;
                        }
                    );
				    $killSwitch.prop("disabled", true);
			    });
            },

            setupAPI: function () {
                if (!sender.cache.castAPI) {
				    sender.cache.castApi = new cast.Api();
                    sender.cache.castApi.addReceiverListener(
                        config.appId,
                        sender.events.onReceiverList
                    );
			    }
            },

            events: {
		
                onReceiverList: function (list) {
			        if (list.length > 0) {
				        $(".receiver-list").empty();
		        		list.forEach(function (receiver) {
				        	$listItem = $("<li><a href='#' data-id='" + receiver.id + "'>" + receiver.name + "</a></li>");
					        $listItem.on("click", sender.events.receiverClicked);
					        $(".receiver-list").append($listItem);
				        });
			        }
		        },

                receiverClicked: function (e) {
			        e.preventDefault();
                    var $target = $(e.target),
				    receiver = _.find(receiverList, function(receiver) {
					    return receiver.id === $target.data("id");
				    });
                    doLaunch(receiver);
	        	},

		        doLaunch: function (receiver) {
                    var request,
                        $killSwitch = sender.els.killSwitch;
			        if (!sender.cache.activity) {
				        request = new cast.LaunchRequest(
                            config.appId, 
                            receiver
                        );
                        $killSwitch.prop("disabled", false);
                        sender.castApi.launch(
                            request, 
                            sender.events.onLaunch
                        );
			        }
		        },

		        onLaunch: function (activity) {
                    var api = sender.cache.castApi,
                        appNamespace = config.appNamespace;
			        if (activity.status === "running") {
				        api.sendMessage(
                            activity.activityId, 
                            apiNamespace, 
                            {
                                type: "HelloWorld"
                            }
                        );
	                }
                    sender.cache.activity = activity;
                }

            }

        };

        return sender;

    }

);


