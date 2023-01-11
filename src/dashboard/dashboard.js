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


const loadFeaturedPlaylist = async () => {
    const featuredPlaylist = await fetchRequest(ENDPOINT.featuredPlaylist);
    console.log(featuredPlaylist);
}

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    loadFeaturedPlaylist();

    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }

    })
})