chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    if(request.message==="get_all_success"){
        console.log('message received user data', request);
        add_data(request.payload)
    }
    else if(request.message==="insert_success"){
        console.log('inserted user data', request);
    }

    });

chrome.runtime.sendMessage({message:"get_all"}, (response) => {
    // 3. Got an asynchronous response with the data from the background
    console.log('received user data', response);
    //add_data(response.payload)
  });

/*event listener for opening form*/
let x=document.getElementById('add-collection');
x.addEventListener('click',change_css);

function change_css(){
    document.getElementById('new-collection-form').style.cssText = 'display:block;';
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

/*Adding all the collections into frontend*/
function add_data(data){
        /* tab_collections=[{
            "name":"s.acsac",
            "tab_list":["https://www.youtube.com/watch?v=bUSDQLEjW_M&t=1s","https://github.com/mahimasindal/tab-collection"]
            },
        {
            "name":"coding",
            "tab_list":["https://leetcode.com/problemset/all/","https://www.interviewbit.com/search/?q=Amazon"]
        }] */
        tab_collections=data
        //creating a new docFrag to add in the document
        var docFrag = document.createDocumentFragment();

        for(t=0;t<tab_collections.length;t++){
            //deep cloning a temp-node which already exists in html doc with display:none
            var temp_node=document.getElementById("temp-node").cloneNode(true);

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


