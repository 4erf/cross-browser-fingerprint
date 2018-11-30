(function () {
  if ( typeof window.CustomEvent === "function" ) return false; //If not IE

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.Event = CustomEvent;
})();

var resolve = new Event('resolve');

(function () {
    var ip_address = "138.68.98.220:5000"

    var elements = {
        'new': document.getElementById('new'),
        'login': document.getElementById('login'),
        'vote': document.getElementById('vote')
    }

    var functions = {
        'new': function() {
            var user = prompt("Username for new account");
            if (user == "") {
                alert('Enter a valid username');
                return;
            }

            $("#fingerprint-iframe").attr("src", "fingerprint/cross.html");

            $('body').unbind().on('resolveCross', function (e, res) {        
                var data = {
                    cross: res,
                    mode: 'cross'
                };
                data.user = user;
                console.log(data)
                $.ajax({
                    url: "http://" + ip_address + "/newaccount",
                    dataType: "json",
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(data),
                    success: function (data) {
                        alert(data.result);
	    		document.getElementById('status').innerHTML = data.result;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError);
                    }
                });
            });
        },
        'login': function() {
            var user = prompt("Enter your username");
            if (user == "") {
                alert('Enter a valid username');
                return;
            }

            $("#fingerprint-iframe").attr("src", "fingerprint/single.html");

            $('body').unbind().on('resolveSingle', function (e, res) {
                var postData = {
                    single: res,
                    mode: 'single'
                };
                postData.user = user;
                console.log(postData)
                $.ajax({
                    url: "http://" + ip_address + "/login",
                    dataType: "json",
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(postData),
                    success: function (data) {	
	    		document.getElementById('status').innerHTML = data.result;
                        if (data.result == 'not on account') {
                            $("#fingerprint-iframe").attr("src", "fingerprint/cross.html");
			    document.getElementById('status').innerHTML = "Getting Full fingerprint..."
                            $('body').unbind().on('resolveCross', function (e, res) {
                                postData.cross = res;
                                postData.mode = 'cross';
                                console.log(postData)
                                $.ajax({
                                    url: "http://" + ip_address + "/login",
                                    dataType: "json",
                                    contentType: 'application/json',
                                    type: 'POST',
                                    data: JSON.stringify(postData),
                                    success: function (data) {
                                        alert(data.result);
	    				document.getElementById('status').innerHTML = data.result;
                                    },
                                    error: function (xhr, ajaxOptions, thrownError) {
                                        alert(thrownError);
                                    }
                                });
                            });
                        }
			alert(data.result);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError);
                    }
                });
            });
        },
        'vote': function() {
            console.log('vote :)')
            /*
            let user = prompt("Enter your username");
            if (user == null) {
                alert('Enter a valid username');
                return;
            }

            let vote = prompt("What's the name of the issue");
            if (vote == null) {
                alert('Enter a valid name');
                return;
            }

            $("#fingerprint-iframe").attr("src", "fingerprint/single.html");

            $('body').unbind().on('resolveSingle', function (e, res) {
                let postData = {
                    single: res,
                    mode: 'single'
                };
                postData.user = user;
                postData.vote = vote;
                console.log(postData);
                $.ajax({
                    url: "http://" + ip_address + "/vote",
                    dataType: "json",
                    contentType: 'application/json',
                    type: 'POST',
                    data: JSON.stringify(postData),
                    success: function (data) {
                        alert(data.result);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError);
                    }
                });
            });
        */}
    }

    for(var elm in elements) {
 	(function (){
		var el = elm;
        	elements[el].addEventListener("click", function () {
            		functions[el]();
	    		document.getElementById('status').innerHTML = "Getting Fingerprint...";
        	});
	})();
     }
})();
