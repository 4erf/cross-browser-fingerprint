var resolve = new Event('resolve');

(function () {
    const ip_address = "138.68.98.220:5000"

    const elements = {
        'new': document.getElementById('new'),
        'login': document.getElementById('login'),
        'vote': document.getElementById('vote')
    }

    const functions = {
        'new': () => {
            let user = prompt("Username for new account");
            if (user == null) {
                alert('Enter a valid username');
                return;
            }

            $("#fingerprint-iframe").attr("src", "fingerprint/cross.html");

            $('body').unbind().on('resolveCross', function (e, res) {        
                let data = {
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
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError);
                    }
                });
            });
        },
        'login': () => {
            let user = prompt("Enter your username");
            if (user == null) {
                alert('Enter a valid username');
                return;
            }

            $("#fingerprint-iframe").attr("src", "fingerprint/single.html");

            $('body').unbind().on('resolveSingle', function (e, res) {
                let postData = {
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
                        if (data.result == 'not on account') {
                            $("#fingerprint-iframe").attr("src", "fingerprint/cross.html");

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
                                    },
                                    error: function (xhr, ajaxOptions, thrownError) {
                                        alert(thrownError);
                                    }
                                });
                            });
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError);
                    }
                });
            });
        },
        'vote': () => {
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

    for (let el in elements) {
        elements[el].addEventListener("click", function () {
            functions[el]();
        });
    }

})();