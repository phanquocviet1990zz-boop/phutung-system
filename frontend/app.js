const input = document.getElementById("code");
const result = document.getElementById("result");
const suggest = document.getElementById("suggest");


const viewer=document.getElementById("viewer");

const bigImage=document.getElementById("bigImage");

const closeViewer=document.getElementById("closeViewer");

input.addEventListener("input", async function () {

    const keyword = input.value.trim();

    if (keyword === "") {
        suggest.innerHTML = "";
        return;
    }

    const res = await fetch("/api/suggest?keyword=" + encodeURIComponent(keyword));
    const data = await res.json();

    suggest.innerHTML = "";

    data.forEach(code => {

        const div = document.createElement("div");

        div.className = "item";

        div.innerText = code;

        div.onclick = () => {

            input.value = code;

            suggest.innerHTML = "";

            search();

        }

        suggest.appendChild(div);

    });

});

async function search(){

    const code=input.value.trim();

    if(code==="") return;

    const res=await fetch("/api/search?code="+encodeURIComponent(code));

    const data=await res.json();

    result.innerHTML="";

    if(!data.success){

        result.innerHTML="<h2>"+data.message+"</h2>";

        return;

    }

    data.images.forEach(img=>{

        const image=document.createElement("img");

        image.src=img;

       image.onclick=function(){

viewer.style.display="flex";

bigImage.src=img;

}

        result.appendChild(image);

    });

}


closeViewer.onclick=function(){

viewer.style.display="none";

}

viewer.onclick=function(e){

if(e.target===viewer){

viewer.style.display="none";

}

}