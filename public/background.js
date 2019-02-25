// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request && request.action === 'createWindow' && request.url) {
//         chrome.windows.create(
//             {
//                 url: request.url,
//                 type: 'panel',
//                 width: 375,
//                 height: 800,
//                 top: 0,
//                 alwaysOnTop: true,
//                 setSelfAsOpener: true
//             }, function (win) {
//             sendResponse(win);
//         });
//     }

// });
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log('Page uses History API and we heard a pushSate/replaceState.');
    // do your thing

    chrome.tabs.query({active: true, currentWindow: false}, function(tab){
        console.log(tab);
        if (tab.length > 0) {
            chrome.tabs.sendMessage(tab[0].id, {content: details, type: "changeHistory"}, function(response) {
                console.log(response);
            });
        }

    })
    // chrome.tabs.query({active: true, currentWindow: false}, function(tabs){
    //     chrome.tabs.sendMessage(tabs[0].id, {content: details, type: "changeHistory"}, function(response) {
    //         console.log(response);
    //     });
    // });

});
