var collection_data={}
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    if(request.message==="get_all_success"){
        //console.log('message received user data', request);
        //collection_data=request.payload
        for(i=0;i<request.payload.length;i++){
            let name=request.payload[i]["name"]
            let tabs=request.payload[i]["tab_list"]
            collection_data[name]=tabs
        }
        add_data(request.payload)
    }
    else if(request.message==="insert_success"){
        console.log('inserted user data', request);
    }
    else if(request.message==="update_success"){
        console.log('updated user data', request);
    }
    else if(request.message==="delete_success"){
        console.log('deleted user data', request);
    }

    });

chrome.runtime.sendMessage({message:"get_all"}, (response) => {
    // 3. Got an asynchronous response with the data from the background
    //console.log('received user data', response);
    //add_data(response.payload)
  });

/*event listener for opening form*/
let x=document.getElementById('add-collection');
x.addEventListener('click',change_css);

function change_css(){
    let newForm=document.getElementById('new-collection-form')
    newForm.style.cssText = 'display:block; opacity:1;';
    
    }


/*event listener for creating new collection*/
document.getElementById('create-collection').addEventListener("click",(e)=>{add_collection_db(e)});

function add_collection_db(e){
    e.preventDefault();
    let collection_name=document.getElementById('c-name').value
    let cur_tab=document.getElementById('cur-tab').checked 
    let all_tabs=document.getElementById('all-tabs').checked
    var tab_list=[]
    let query_obj={active:false, currentWindow:false}
    if( cur_tab==true){
        query_obj={active:true}
    }
    else if(all_tabs==true){
        query_obj={currentWindow:true}
    }
    
    chrome.tabs.query(query_obj, function(tabs){
        console.log("tabs=",tabs)
        for(i=0;i<tabs.length;i++)
        {   
            tab_list.push(tabs[i].url)
        }
        payload=[{"name":collection_name,"tab_list":tab_list}]
        console.log("payload=",payload)
        chrome.runtime.sendMessage({message:"insert",payload:payload})
    });
            
}

/*adding event listener for click on any where in the collection list*/
document.getElementById("collection-list").addEventListener("click",collectionClick)
function collectionClick(event){
    //console.log("in collection click",event.target.id)
    //console.log("parentElement=",event.target.parentElement.parentElement.id)
    console.log("collection_data",collection_data)
    let cur_collection=event.target.parentElement.parentElement.id
    let cur_operation=event.target.id

    if(cur_operation==="open-all-tabs"){
        console.log("open-all-tabs")
        let tabs=collection_data[cur_collection]
        for (let i = 0; i < tabs.length; i++) {
            window.open(tabs[i])
        }
    }
    else if(cur_operation==="delete-collection"){
        console.log("delete-collection")
        delete collection_data[cur_collection]
        chrome.runtime.sendMessage({message:"delete",payload:cur_collection})
    }
    else if(cur_operation==="edit-collection"){
        console.log("edit-collection")
        const modal=document.querySelector('#modal')
        const input_collection_name=document.querySelector('#modal #up-col-name')
        input_collection_name.value=cur_collection;
        
        var docFrag = document.createDocumentFragment();
        let url_collections=collection_data[cur_collection]
        for(t=0;t<url_collections.length;t++){
            //deep cloning a temp-node which already exists in html doc with display:none
            let temp_node=document.getElementById("temp-node-url").cloneNode(true);
            //adding the name of the collection from the backend data dynamically
            x=temp_node.getElementsByClassName("collection-name")[0]
            let link=url_collections[t];
            x.innerHTML="Link"+(t+1)
            x.href=link
            //console.log("x.innerHTML=",x.innerHTML)
            

            //making display:flex in order for node to show in doc and append it in docFrag created
            temp_node.style.display="flex";
            docFrag.appendChild(temp_node);
        }

        //adding the doc fragment under the html node with id="collection-list"
        let list=document.getElementById("up-tab-list")
        list.appendChild(docFrag)

        delete docFrag

        modal.showModal();
    }
    else if(cur_operation==="add-current-tab"){
        console.log("add-current-tab")

        chrome.tabs.query({active:true}, function(tabs){
            let cur_tab=tabs[0].url
            console.log("cur_tab=",cur_tab)
            cur_tabs_list=collection_data[cur_collection]
            cur_tabs_list.push(cur_tab)
            payload={"name":cur_collection,"tab_list":cur_tabs_list}
            console.log("payload=",payload)
            chrome.runtime.sendMessage({message:"update",payload:payload})
            
        });
        
    }
}

const closeBtn=document.querySelector('.modal .fa-xmark');
const modal=document.querySelector('#modal')

closeBtn.addEventListener("click",()=>{
    modal.close()
});

/*Adding all the collections into frontend*/
function add_data(data){
        tab_collections=data
        //creating a new docFrag to add in the document
        var docFrag = document.createDocumentFragment();

        for(t=0;t<tab_collections.length;t++){
            //deep cloning a temp-node which already exists in html doc with display:none
            var temp_node=document.getElementById("temp-node").cloneNode(true);
            temp_node.setAttribute("id",tab_collections[t]["name"])

            //adding the name of the collection from the backend data dynamically
            x=temp_node.getElementsByClassName("collection-name")[0]
            text=tab_collections[t]["name"];
            //console.log("x.innerHTML=",x.innerHTML)
            x.innerHTML=text+x.innerHTML

            //making display:flex in order for node to show in doc and append it in docFrag created
            temp_node.style.display="flex";
            docFrag.appendChild(temp_node);
        }

        //adding the doc fragment under the html node with id="collection-list"
        let list=document.getElementById("collection-list")
        list.appendChild(docFrag)

        delete docFrag
}


