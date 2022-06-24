console.log("from background")

chrome.tabs.onActivated.addListener(tab=>{
    chrome.tabs.get(tab.tabId,current_tab_info=>{
        if(/^https:\/\/www\.google/.test(current_tab_info.url)){
            chrome.tabs.insertCSS(null,{file:'./mystyle.css'});
            chrome.tabs.executeScript(null,{file:'./foreground.js'},()=>console.log('i injected foreground'))
        }

        console.log(current_tab_info.url)
    });
});



//chrome.tabs.executeScript(null,{file:'..foreground.js'},()=>console.log("i injected foreground"))

//     //"content-security-policy": "default-src https://kit.fontawesome.com/78c3ab1305.js; child-src 'none'; object-src 'none'"
