define(function (require) {
	// Message type constants
	var msgInit = 0;
	var msgListUsers = 1;
	var msgCreateSharedActivity = 2;
	var msgListSharedActivities = 3;
	var msgJoinSharedActivity = 4;
	var msgLeaveSharedActivity = 5;
	var msgOnConnectionClosed = 6;
	var msgOnSharedActivityUserChanged = 7;
	var msgSendMessage = 8;
	
	// Array for callbacks on each type
    var callbackArray = [];

	// Connection object
	function SugarPresence() {
		// Init callbacks
		var emptyCallback = function() {};
		var listUsersCallback = emptyCallback;
		var createSharedActivityCallback = emptyCallback;
		var listSharedActivityCallback = emptyCallback;
		var joinSharedActivity = emptyCallback;
		var leaveSharedActivity = emptyCallback;
		var onConnectionClosed = emptyCallback;
		var onSharedActivityUserChanged = emptyCallback;
		var receivedDataCallback = emptyCallback;
		callbackArray = [emptyCallback, listUsersCallback, createSharedActivityCallback, 
			listSharedActivityCallback, joinSharedActivity, leaveSharedActivity,
			onConnectionClosed, onSharedActivityUserChanged, receivedDataCallback
		];
		
		// Handle message received from server
		this.registerMessageHandler = function() {
			// Get message content
			this.socket.onmessage = function(event) {
				// Convert message to JSON
				var edata = event.data;
				try {
					var json = JSON.parse(edata);
				} catch (e) {
					console.log('Presence API error, this doesn\'t look like a valid JSON: ', edata);
					return;
				}

				// Call the matching callback
				if (json.type < callbackArray.length)
					callbackArray[json.type](json.data);
				else
					console.log('Presence API error, unknown callback type:'+json.type);

			};
		}

		// Register user to the server
		this.registerUser = function(userInfo) {
			this.socket.send(JSON.stringify(userInfo));
		}    

	}

	// Create presence object
	var presence = new SugarPresence();
	
	// Join network function
    SugarPresence.prototype.joinNetwork = function(callback) {
		// Check WebSocket support
		if (!window.WebSocket){
			console.log('WebSocket not supported');
			callback({code: -1}, null);
			this.socket = null;			
		}
		
		// Get server name
		var server = location.hostname;
		if (localStorage.sugar_settings) {
			var sugarSettings = JSON.parse(localStorage.sugar_settings);
			if (sugarSettings.server) {
				server = sugarSettings.server;
				var endName = server.indexOf(':')
				if (endName == -1) endName = server.indexOf('/');
				if (endName == -1) endName = server.length;
				server = server.substring(0, endName);
			}
		}
		
		// Connect to server
        this.socket = new WebSocket('ws://'+server+':8039');
        this.socket.onerror = function(error) {
            console.log('WebSocket Error: ' + error);
			callback(error, null);
			this.socket = null;
        };
		
		// When connection open, send user info
        var that = this;
        this.socket.onopen = function(event) {
			var sugarSettings = JSON.parse(localStorage.sugar_settings);
			var userInfo = {
				name: sugarSettings.name,
				networkId: sugarSettings.networkId,
				colorvalue: sugarSettings.colorvalue
			};
			that.registerMessageHandler();
            that.registerUser(userInfo);
			callback(null, userInfo);
        };
		
		// When connection closed, call closed callback
        this.socket.onclose = function(event) {
            callbackArray[msgOnConnectionClosed](event);
        };		
    }

	// Leave network
    SugarPresence.prototype.leaveNetwork = function() {
		if (this.socket == null)
			return;
        this.socket.close();
    }

	// List all users. Will receive an array of users.
    SugarPresence.prototype.listUsers = function(callback) {
		if (this.socket == null)
			return;

		// Register call back
        callbackArray[msgListUsers] = callback;
		
		// Send list user message
        var sjson = JSON.stringify({
            type: msgListUsers
        });
        this.socket.send(sjson);
    }
	
	// Create a shared activity. Will receive a unique group id.
    SugarPresence.prototype.createSharedActivity = function(activityId, callback) {
		if (this.socket == null)
			return;

		// Register call back
        callbackArray[msgCreateSharedActivity] = callback;
		
		// Send create shared activity message
        var sjson = JSON.stringify({
            type: msgCreateSharedActivity,
			activityId: activityId
        });
        this.socket.send(sjson);
    }

	// List all shared activities. Will receive an array of each shared activities and users connected
    SugarPresence.prototype.listSharedActivities = function(callback) {
		if (this.socket == null)
			return;

		// Register call back
        callbackArray[msgListSharedActivities] = callback;
		
		// Send list shared activities message
        var sjson = JSON.stringify({
            type: msgListSharedActivities
        });
        this.socket.send(sjson);
    }
	
	// Join a shared activity. Will receive group properties or null
    SugarPresence.prototype.joinSharedActivity = function(group, callback) {
		if (this.socket == null)
			return;

		// Register call back
        callbackArray[msgJoinSharedActivity] = callback;
		
		// Send join shared activity message
        var sjson = JSON.stringify({
            type: msgJoinSharedActivity,
			group: group
        });
        this.socket.send(sjson);
    }

	// Leave shared activities
    SugarPresence.prototype.leaveSharedActivity = function(group, callback) {
		if (this.socket == null)
			return;

		// Register call back
        callbackArray[msgLeaveSharedActivity] = callback;
		
		// Send leave shared activity message
        var sjson = JSON.stringify({
            type: msgLeaveSharedActivity,
			group: group
        });
        this.socket.send(sjson);
    }

	// Register connection closed event
    SugarPresence.prototype.onConnectionClosed = function(callback) {
        callbackArray[msgOnConnectionClosed] = callback;
    }
	
	// Register shared activity user changed event
	SugarPresence.prototype.onSharedActivityUserChanged = function(callback) {
		callbackArray[msgOnSharedActivityUserChanged] = callback;
	}

	// Send message to a group
    SugarPresence.prototype.sendMessage = function(group, data) {;
		if (this.socket == null)
			return;
		var sjson = JSON.stringify({
            type: msgSendMessage,
			group: group,
            data: data
        });
        this.socket.send(sjson);
    }
	
	// Register data received message
    SugarPresence.prototype.onDataReceived = function(callback) {
        callbackArray[msgSendMessage] = callback;
    }
	
	return presence;
});