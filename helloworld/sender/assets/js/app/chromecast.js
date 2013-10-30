define(
    ["jquery"],
    function ($) {
        
        "use strict";

        var chromecast = {

            cache: {
                castApi: null
            },

            config: {
                appId: "c48ae0aa-486a-4266-b4ee-323fd739c0b8",
                appNamespace: "helloworld"
            },

            els: {
                killSwitch: $("#killSwitch")
            },

            init: function () {
                chromecast.setupEvents();
            },

            setupEvents: function () {
                var api = chromecast.cache.castApi,
                    $killSwitch = chromecast.els.killSwitch;
    		    window.addEventListener("message", function (event) {
			        if (event.source === window 
                        && event.data 
                        && event.data.source === "CastApi" 
                        && event.data.event === "Hello") {
                        chromecast.setupAPI();
			        }
		        });
	        	$killSwitch.on('click', function() {
			        api.stopActivity(
                        chromecast.cache.activity.activityId, 
                        function(){
				            chromecast.cache.activity = null;
                        }
                    );
				    $killSwitch.prop('disabled', true);
			    });
            },

            setupAPI: function () {
                if (!chromecast.cache.castAPI) {
				    chromecast.cache.castApi = new cast.Api();
                    chromecast.cache.castApi.addReceiverListener(
                        chromecast.config.appId,
                        chromecast.events.onReceiverList
                    );
			    }
            },

            events: {
		
                onReceiverList: function (list) {
			        if (list.length > 0) {
				        $(".receiver-list").empty();
		        		list.forEach(function (receiver) {
				        	$listItem = $('<li><a href="#" data-id="' + receiver.id + '">' + receiver.name + '</a></li>');
					        $listItem.on('click', chromecast.events.receiverClicked);
					        $('.receiver-list').append($listItem);
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
                        $killSwitch = chromecast.els.killSwitch;
			        if (!chromecast.cache.activity) {
				        request = new cast.LaunchRequest(
                            chromecast.config.appId, 
                            receiver
                        );
                        $killSwitch.prop("disabled", false);
                        chromecast.castApi.launch(
                            request, 
                            chromecast.events.onLaunch
                        );
			        }
		        },

		        onLaunch: function (activity) {
                    var api = chromecast.cache.castApi,
                        appNamespace = chromecase.config.appNamespace;
			        if (activity.status === "running") {
				        api.sendMessage(
                            activity.activityId, 
                            apiNamespace, 
                            {
                                type: 'HelloWorld'
                            }
                        );
	                }
                    chromecast.cache.activity = activity;
                },

            }

        };

        return chromecast;

    }

);


