console.log("from background")

/* chrome.tabs.onActivated.addListener(tab=>{
    chrome.tabs.get(tab.tabId,current_tab_info=>{
        if(/^https:\/\/www\.google/.test(current_tab_info.url)){
            chrome.tabs.insertCSS(null,{file:'./mystyle.css'});
            chrome.tabs.executeScript(null,{file:'./foreground.js'},()=>console.log('i injected foreground'))
        }

        console.log(current_tab_info.url)
    });
});
 */
//chrome.tabs.executeScript(null,{file:'..foreground.js'},()=>console.log("i injected foreground"))
 //"content-security-policy": "default-src https://kit.fontawesome.com/78c3ab1305.js; child-src 'none'; object-src 'none'"


 chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    //console.log("atleast here", request)
    if(request.message === "insert"){
        let request_insert = insert_records(request.payload);

        request_insert.then(res =>{
            chrome.runtime.sendMessage({
                message:"insert_success",
                payload:res
            })
        }).catch(err=>{console.log("err=",err)}

        )
    }

    else if(request.message === "get"){
        let request = get_records(request.payload);

        request.then(res =>{
            chrome.runtime.sendMessage({
                message:"get_success",
                payload:res
            })
        })
        
    }

    else if(request.message === "update"){
        let request = update_records(request.payload);

        request.then(res =>{
            chrome.runtime.sendMessage({
                message:"update_success",
                payload:res
            })
        })
    }

    else if(request.message === "delete"){
        let request = delete_records(request.payload);

        request.then(res =>{
            chrome.runtime.sendMessage({
                message:"delete_success",
                payload:res
            })
        })
    }

    else if(request.message==="get_all"){
        //console.log("in get_all_data")
        let request = get_all_records();

        request.then(res=>{
            console.log("got response=",res)
            /* sendResponse({
                message:"get_all_success",
                payload:res
            }) */
            chrome.runtime.sendMessage({
                message:"get_all_success",
                payload:res
            })
        }).catch(err=>{console.log("err=",err)}

        )
    }

 });

 let tab_collections=[{
    "name":"project",
    "tab_list":["https://www.youtube.com/watch?v=bUSDQLEjW_M&t=1s","https://github.com/mahimasindal/tab-collection"]
 },
{
    "name":"coding",
    "tab_list":["https://leetcode.com/problemset/all/","https://www.interviewbit.com/search/?q=Amazon"]
}]

 let db=null;

 function create_database(){
    const request = window.indexedDB.open("TabCollectionDB");

    request.onerror=function(event){
        console.log("problem opening db");
    }

    request.onupgradeneeded = function(event){
        db = event.target.result;

        let objectStore = db.createObjectStore("tab_collections",{
            keyPath:"name"
        });

        objectStore.transaction.oncomplete = function(event){
            console.log("ObjectStore Created");
        }
    }

    request.onsuccess = function(event){
        db = event.target.result;
        console.log("DB Opened = ",db);
        //insert_records(tab_collections);
        db.onerror=function(event){
            console.log("Failed to Open DB")
        }
    }

 }

 function delete_database(){
    const request = window.indexedDB.deleteDatabase("TabCollectionDB");

    request.onerror=function(event){
        console.log("problem deleting db");
    }

    request.onsuccess = function(event){
            console.log("DB Deleted");
    }
 }

 function insert_records(records){

    if(db){
        const insert_transaction=db.transaction("tab_collections","readwrite");
        const objectStore = insert_transaction.objectStore("tab_collections");

        return new Promise((resolve,reject)=>{
            insert_transaction.oncomplete=function(){
                console.log("All Insert Transactions complete")
                resolve(true)
            }
            insert_transaction.onerror=function(){
                console.log("Problem inserting records")
                resolve(false)
            }
    
            records.forEach(collection =>{
                let request = objectStore.add(collection);
                request.onsuccess=function(){
                    console.log("Added: ",collection)
                }
            });

        })
       
    }
 }

function get_all_records(){
       if(db){
        const get_all_transaction=db.transaction("tab_collections","readonly");
        const objectStore = get_all_transaction.objectStore("tab_collections");

        return new Promise((resolve,reject)=>{
            get_all_transaction.oncomplete=function(){
                console.log("All Get Transactions complete")
            }
            get_all_transaction.onerror=function(event){
                console.log("Problem getting records")
                reject(event.target.result)
            }
    
           let request = objectStore.getAll();
            request.onsuccess=function(event){
                    //console.log(event.target.result);
                    resolve(event.target.result)
                }
               
        })


    }
}

 function get_records(name){

    if(db){
        const get_transaction=db.transaction("tab_collections","readonly");
        const objectStore = get_transaction.objectStore("tab_collections");

        return new Promise((resolve,reject)=>{
            get_transaction.oncomplete=function(){
                console.log("All Get Transactiobs complete")
            }
            get_transaction.onerror=function(){
                console.log("Problem getting records")
            }
    
           let request = objectStore.get(name);
            request.onsuccess=function(event){
                    console.log(event.target.result);
                }
        })

        
    }
 }

 function update_record(record){

    if(db){
        const put_transaction=db.transaction("tab_collections","readwrite");
        const objectStore = put_transaction.objectStore("tab_collections");

        return new Promise((resolve,reject)=>{
            put_transaction.oncomplete=function(){
                console.log("All PUT Transactiobs complete")
            }
            put_transaction.onerror=function(){
                console.log("Problem updating records")
            }
    
           let request = objectStore.put(record);
        })
        
    }
 }

 function delete_record(name){
    if(db){
        const delete_transaction=db.transaction("tab_collections","readwrite");
        const objectStore = delete_transaction.objectStore("tab_collections");

        return new Promise((resolve,reject)=>{
            delete_transaction.oncomplete=function(){
                console.log("All Delete Transactiobs complete")
            }
            delete_transaction.onerror=function(){
                console.log("Problem deleting records")
            }
    
           let request = objectStore.delete(name);
        })
    }

 }

create_database()
//get_all_records()

