const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

//* Unsplash API
let count = 5;
const apiKey = "9WNCg0J3yvF8xKEaq1mVzPjnukAYGSxnEtrZQ6sxRZw";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

//*Helper function to check the count of photos for the initial load
function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

//*Helper function to check if all images where loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

//* Helper function to set attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

//* Create elements for links and photos and adding to the DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  //for each method in the photos array
  photosArray.forEach((photo) => {
    // Creating <a> to link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    //Create <img> for photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    //Event listener to check when each is finished loading
    img.addEventListener("load", imageLoaded);
    //Put <img> inside the <a> and then both inside the imageContainer element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

//* Get photos request from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    console.log(photosArray);
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (err) {
    console.log(err);
    //Catch error here
  }
}

//* Check with an event if the scroll is near the bottom of the page to run the getPhotos function
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

//* On load
getPhotos();
