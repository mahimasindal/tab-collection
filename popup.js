let x=document.getElementById('add-collection');

console.log("x=",x)

x.addEventListener('click',change_css);

function change_css(){
    console.log("here");
    document.getElementById('new-collection-form').style.cssText = 'display:block;';
    }
