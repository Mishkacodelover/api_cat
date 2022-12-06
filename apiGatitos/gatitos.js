const URL_API_RANDOM =
  "https://api.thecatapi.com/v1/images/search?limit=2&api_key=live_w7JFkwlpLIJ9SvoQCSHBPezmFByNVki11W5H3XPoZB7COHXpeAdTQh5WqGe0XE03";

const URL_API_FAVOURITES =
  "https://api.thecatapi.com/v1/favourites?api_key=live_w7JFkwlpLIJ9SvoQCSHBPezmFByNVki11W5H3XPoZB7COHXpeAdTQh5WqGe0XE03";

const URL_API_FAV_DELETE = "https://api.thecatapi.com/v1/favourites/:favouriteId";

const URL_API_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

const API_KEY = "live_w7JFkwlpLIJ9SvoQCSHBPezmFByNVki11W5H3XPoZB7COHXpeAdTQh5WqGe0XE03";

let spanError = document.getElementById("error");

async function loadRandomMichies() {
  const res = await fetch(URL_API_RANDOM);
  const data = await res.json();
  console.log("random");
  console.log(data);
  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    const btn1 = document.getElementById("btn1");
    const btn2 = document.getElementById("btn2");

    btn1.onclick = () => saveFavoritesMichies(data[0].id);
    btn2.onclick = ()=> saveFavoritesMichies(data[1].id);

    img1.src = data[0].url;
    img2.src = data[1].url;
  }
}

async function favoritesMichies() {
  const res = await fetch(URL_API_FAVOURITES);
  const data = await res.json();
  console.log("favoritos");
  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  }else{
   const section = document.getElementById("favoritesMichies");
   section.innerHTML = "";
   const h2 = document.createElement("h2");
   const h2Text = document.createTextNode("Mis gatitos favoritos");
   h2.appendChild(h2Text);
   section.appendChild(h2);

   data.forEach(michi =>{
    
      const article = document.createElement("article");
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnTxt = document.createTextNode("Eliminar de favoritos");
      btn.appendChild(btnTxt);
      btn.onclick =()=> deleteFavorites(michi.id);
      img.src = michi.image.url;
      //img.width = 150;
      figure.appendChild(img);
      article.appendChild(figure);
      article.appendChild(btn);
      section.appendChild(article);
     })
  }
}

async function saveFavoritesMichies(id) {
  const res = await fetch(URL_API_FAVOURITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });
  const data = await res.json();
  console.log("guardar")
  console.log(res);
  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  }else{
   console.log("Michi guardado en favoritos");
   favoritesMichies();
  }
}


async function deleteFavorites(id){
   const favouriteId = id;
   const res = await fetch(`https://api.thecatapi.com/v1/favourites/${favouriteId}`, {
      method: "DELETE",
      headers: {
         "x-api-key": `${API_KEY}`,
       }
    
   });
    const data = await res.json();
    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }else{
     console.log("Michi eliminado de favoritos");
     favoritesMichies();
    }

}

async function uploadPhoto(){
   const form = document.getElementById("uploadingForm");
   const formData = new FormData(form);
   console.log(formData.get("file"));

   const res = await fetch(URL_API_UPLOAD,{
      method:"POST",
      headers: {
        // "Content-Type":"multipart/form-data",..da error 500si se activa, basta con el body.formData y funciona.
         "x-api-key": `${API_KEY}`,
      },
      body:formData,
   });
   const data = await res.json();
   if (res.status !== 201) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
      console.log({data})
    }else{
     console.log("Foto subida");
     console.log({data});
     console.log(data.url);
     saveFavoritesMichies(data.id) ;
     
    }
   

}

loadRandomMichies();
favoritesMichies();
