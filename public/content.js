// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
(function(f){
    var r = function() {
        if(document.readyState !== 'complete')
            setTimeout(r, 10);
        else
            f();
    };
    r();
})(function()
{
    if (document.getElementsByClassName('iw')[0]) {
        var sender = document.getElementsByClassName('iw')[0].getElementsByClassName('gD')[0];
        var email = sender.getAttribute('email');
        var name = sender.getAttribute('name');
        chrome.storage.sync.set({'email': email}, function() {
            console.log('Settings saved '+email);

        });
        chrome.storage.sync.set({'name': name}, function() {
            console.log('Settings saved '+name);
        });

        // Avoid recursive frame insertion...



        var iframe = document.createElement('iframe');
        // Must be declared at web_accessible_resources in manifest.json
        iframe.src = extensionOrigin+"/index.html";

        // Some styles for a fancy sidebar
        iframe.style.cssText = 'position:fixed;bottom:0;right:0;display:block;' +
            'width:500px;height:100%;z-index:1000;';
        document.body.appendChild(iframe);

        var divToggle = document.createElement('div');
        divToggle.setAttribute("id", "bx24main-toogle");
        // Some styles for a fancy sidebar
        divToggle.style.cssText = 'position:fixed;top:50%;right:503px;display:block;' +
            'height:40px;z-index:1000;';
        divToggle.className = "alert alert-success";
        divToggle.innerHTML = '<a id="bx24gmail-button" style="background: #00bcd4!important; padding: 10px;display: flex; font-size: 21px; color: #FFFFFF; align-items: center;">✖</a>';
        document.body.appendChild(divToggle);


        var link = document.getElementById('bx24gmail-button');

        // onClick's logic below:
        link.addEventListener('click', function() {

            if (link.classList.contains('inactive')) {
                link.innerText = '✖';
                iframe.style.display = 'block';
                divToggle.style.cssText = 'position:fixed;top:50%;right:503px;display:block;' +
                    'height:40px;z-index:1000;';
            }else {
                link.innerText = '⇐';
                iframe.style.display = 'none';
                divToggle.style.cssText = 'position:fixed;top:50%;right:3px;display:block;' +
                    'height:40px;z-index:1000;';
            }
            link.classList.toggle("inactive");
        });


    }
});
window.addEventListener('popstate', function(e){


    setTimeout(function () {
        var sender = document.getElementsByClassName('iw')[0].getElementsByClassName('gD')[0];
        var email = sender.getAttribute('email');
        var name = sender.getAttribute('name');
        chrome.storage.sync.set({'email': email}, function() {
            console.log('Settings saved '+email);

        });
        chrome.storage.sync.set({'name': name}, function() {
            console.log('Settings saved '+name);
        });
        chrome.runtime.sendMessage({action: "update"}, function(response) {
            console.log(response);
        });
       
    }, 1000)

}, false);