import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common"

const onProfileClick = (event) => {
    event.stopPropagation();
    const profileMenu = document.querySelector("#profile-menu");
    profileMenu.classList.toggle("hidden");
    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.querySelector("li#logout").addEventListener("click", logout)
    }
}

const loadUserProfile = async () => {
    const defaultImage = document.querySelector("#default-image");
    const profileButton = document.querySelector("#user-profile-btn");
    const displayNameElement = document.querySelector("#display-name");

    // const userInfo = await fetchRequest(ENDPOINT.userInfo);

    const { display_name: displayName, images } = await fetchRequest(ENDPOINT.userInfo);
    // console.log(userInfo);

    if (images?.length) //i images have a length >  0
    {
        defaultImage.classList.add("hidden");
    }
    else {
        defaultImage.classList.remove("hidden");
    }

    profileButton.addEventListener("click", onProfileClick);

    displayNameElement.textContent = displayName;

}


const onPlaylistItemClicked = (event) => {
    console.log(event.target)
}


const loadPlaylist = async (endpoint, elementId) => {
    // const featuredPlaylist = await fetchRequest(ENDPOINT.featuredPlaylist);
    const { playlists: { items, } } = await fetchRequest(endpoint);
    const playlistItemsSection = document.querySelector(`#${elementId}`);


    for (let { name, description, images, id } of items) {

        const playlistItem = document.createElement("section")
        playlistItem.className = "bg-black-secondary rounded p-4 hover:cursor-pointer hover:bg-light-black"
        playlistItem.id = id;

        playlistItem.setAttribute("data-type", "playlist")
        playlistItem.addEventListener("click", onPlaylistItemClicked)


        const [{ url: imageUrl }] = images;
        playlistItem.innerHTML =
            `<img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow">
                    <h2 class="text-base font-semibold mb-4 truncate"   >${name}</h2>
                    <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`;

        playlistItemsSection.appendChild(playlistItem);

    }


    // console.log(featuredPlaylist);
}

const loadPlaylists = () => {
    loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist-items");
    loadPlaylist(ENDPOINT.toplists, "top-playlist-items");

}

// To be uncommented---below code
const fillContentForDashboard = () => {
    const pageContent = document.querySelector("#page-content");

    const playlistMap = new Map([["featured", "featured-playlist-items"],["top-playlists", "top-playlist-items"]])
    let innerHTML = "";
    for (let [type, id] of playlistMap) {
        innerHTML += `
        <article class="p-4 ">
        Content
        <h1 class="text-2xl mb-4 font-bold capitalize">${type}</h1>
        <section id="${id}"
          class="featured-songs grid-cols-auto-fill-cards grid gap-4 ">
        </section>

      </article>
      `
    }
    pageContent.innerHTML = innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    fillContentForDashboard();
    loadPlaylists();

    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }

    })

    document.querySelector(".content").addEventListener("scroll",(event)=>{
        const {scrollTop} = event.target;
        const header= document.querySelector(".header");
        if(scrollTop >= header.offsetHeight)
        {
            header.classList.add("sticky","top-0","bg-black-secondary");
            header.classList.remove("bg-transparent");
        }
        else{
            header.classList.remove("sticky","top-0","bg-black-secondary");
            header.classList.add("bg-transparent");
        }

    })
})