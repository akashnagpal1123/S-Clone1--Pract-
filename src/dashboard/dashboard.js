import { fetchRequest } from "../api";
import { ENDPOINT, logout, SECTIONTYPE } from "../common"

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


const onPlaylistItemClicked = (event, id) => {
    console.log(event.target);
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: id };

    history.pushState(section, "", `playlist/${id}`);
    loadSection(section);
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

        playlistItem.addEventListener("click", (event) => onPlaylistItemClicked(event, id));

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

    const playlistMap = new Map([["featured", "featured-playlist-items"], ["top-playlists", "top-playlist-items"]])
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


function formatDuration(duration) {
    const min = Math.floor(duration / 60000);
    const sec = ((duration % 60000) / 1000).toFixed(0);
    const formmattedTime = sec == 60 ?
        min + 1 + ":00" : min + ":" + (sec < 10 ? '0' : '') + sec;
    return formmattedTime;
}

const onTrackSelection = (id, event) => {

    document.querySelectorAll("#tracks .track").forEach(trackItem => {
        if (trackItem.id === id) {
            trackItem.classList.add("bg-gray", "selected")
        }
        else {
            trackItem.classList.remove("bg-gray", "selected")
        }
    })
}

const onPlayTrack = (event, {image, artistNames, name, duration, previewURL, id  }) => {
    console.log(image, artistNames, name, duration, previewURL, id );
}
const loadPlaylistTracks = ({ tracks }) => {
    const trackSections = document.querySelector("#tracks");

    let trackNumber = 1;

    for (let trackItem of tracks.items) {
        let { id, artists, name, album, duration_ms: duration, preview_rl: previewURL } = trackItem.track;
        let track = document.createElement("section");
        track.id = id;



        track.className = "track p-1 grid grid-cols-[50px_1fr_1fr_50px] items-center justify-items-start gap-4 rounded-md hover:bg-light-black text-secondary"

        let image = album.images.find(img => img.height === 64);

        let artistNames = Array.from(artists, artist => artist.name).join(", ");

        track.innerHTML = `
                <p class=" rellative w-full flex justify-center items-center justify-self-center"><span class="track-no" >${trackNumber++}</span></p>
                <section class="grid grid-cols-[auto_1fr] gap-3 place-items-center">
                  <img class="h-10 w-10" src="${image.url}" alt="${name}">
                  <article class="flex flex-col gap-2 justify-center">
                    <h2 class="text-primary text-base">${name}</h2>
                    <p class="text-xs">${artistNames}</p>
                  </article>
                </section>
    
                <p class="text-sm">${album.name}</p>
                <p class="text-sm">${formatDuration(duration)}</p>
        `;

        track.addEventListener("click", (event) => {
            onTrackSelection(id, event);
        })

        const playButton = document.createElement("button");
        playButton.id = `play-track${id}`;
        playButton.className = `play w-full absolute left-o text-lg invisible`;
        playButton.textContent = "▶";

        playButton.addEventListener("click", (event) => {
            onPlayTrack(event, { image, artistNames, name, duration, previewURL, id })
        })

        track.querySelector("p").appendChild(playButton);

        trackSections.appendChild(track);
    }
}



const fillContentForPlaylist = async (playlistId) => {
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
    const pageContent = document.querySelector("#page-content");
    pageContent.innerHTML = `  
    <header id ="playlist-header" class="mx-8 py-4 border-secondary border-b-[0.5px]">
        <nav class="py-2">
        <ul class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary line-clamp-1">
        <li class="justify-self-center line-clamp-1">#</li>
        <li>Title</li>
        <li>Album</li>
        <li>⏱</li>
        </ul>
        </nav>
    </header>

    <section class="px-8 text-secondary mt-4" id="tracks">
    </section>
    `



    loadPlaylistTracks(playlist);

    console.log(playlist);
}

const onContentScroll = (event) => {

    const { scrollTop } = event.target;
    const header = document.querySelector(".header");
    if (scrollTop >= header.offsetHeight) {
        header.classList.add("sticky", "top-0", "bg-black");
        header.classList.remove("bg-transparent");
    } else {
        header.classList.remove("sticky", "top-0", "bg-black");
        header.classList.add("bg-transparent");
    }
    if (history.state.type === SECTIONTYPE.PLAYLIST) {
        const coverElement = document.querySelector("#cover-content");
        const playlistHeader = document.querySelector("#playlist-header");
        if (scrollTop >= coverElement.offsetHeight - header.offsetHeight) {
            playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.remove("mx-8");
            playlistHeader.style.top = `${header.offsetHeight}px`;
        }
        else {
            playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.add("mx-8");
            playlistHeader.style.top = `revert`;
        }

    }

}


const loadSection = (section) => {
    if (section.type === SECTIONTYPE.DASHBOARD) {
        fillContentForDashboard();
        loadPlaylists();
    } else if (section.type === SECTIONTYPE.PLAYLIST) {
        //load the elements for playlist
        fillContentForPlaylist(section.playlist);
    }

    document.querySelector(".content").removeEventListener("scroll", onContentScroll);
    document.querySelector(".content").addEventListener("scroll", onContentScroll);
}



document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    // const section = { type: SECTIONTYPE.DASHBOARD }

    const section = { type: SECTIONTYPE.PLAYLIST, playlist: "37i9dQZF1DX4ghkRUdIogy" }

    // history.pushState(section, "", "");
    history.pushState(section, "", `/dashboard/playlist/${section.playlist}`);

    loadSection(section);
    // fillContentForDashboard();
    // loadPlaylists();

    document.addEventListener("click", () => {
        const profileMenu = document.querySelector("#profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }

    })

    document.querySelector(".content").addEventListener("scroll", (event) => {
        console.log("Hello");
        const { scrollTop } = event.target;
        const header = document.querySelector(".header");
        if (scrollTop >= header.offsetHeight) {
            header.classList.add("sticky", "top-0", "bg-black-secondary");
            header.classList.remove("bg-transparent");
        }
        else {
            header.classList.remove("sticky", "top-0", "bg-black-secondary");
            header.classList.add("bg-transparent");
        }

        // if(history.state.type === SECTIONTYPE.PLAYLIST)
        // {
        //       const playlistHeader = document.querySelector("playlist-header");
        //      if (scrollTop >= playlistHeader.offsetHeight)
        //      {
        //         playlistHeader.classList.add("sticky", "top-[${header.offsetHeight}px]");
        //      }
        // }



    })

    window.addEventListener("popstate", (event) => {
        console.log(event);
        loadSection(event.state);
    })
})

