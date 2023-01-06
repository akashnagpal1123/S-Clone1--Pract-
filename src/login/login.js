const CLIENT_ID = "096ba04c09a74bd3a27ad311ff23c509";
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read";
const REDIRECT_URI = "http://localhost:3000/login/login.html";
const ACCESS_TOKEN_KEY = "acessToken";
const APP_URL = "http://localhost:3000"


const authorizeUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes}&show_dialog=true`;

    window.open(url, "login", "width=800,height=600");
}

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-to-spotify");
    loginButton.addEventListener("click", authorizeUser);

})


window.setItemsInLocalStorage = ({ accessToken, tokenType, expiresIn }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("tokenType", tokenType);
    localStorage.setItem("expiresIn", expiresIn);
    window.location.href = `${APP_URL}`;
}

window.addEventListener("load", () => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN_KEY");
    if (accessToken) {
        window.location.href = `${APP_URL}/dashboard/dashboard.html`;
    }
    if (window.opener !== null && !window.opener.closed) {


        window.focus();
        if (window.location.href.includes("error")) {
            window.close();
        }

        const { hash } = window.location;
        const searchParams = new URLSearchParams(hash);
        const accessToken = searchParams.get("#access_token");
        // #access_token = 'BQDGtP2rrAeNMjMUsdaYeV2LGRmElkUoAsaOKEAQ5NacbwlI1lKc5ePO4ie-pf_XNM3u7wIW5VGQpLaXgcr5h445IA9qL4SOOlW980Ce-dnZLBS2_QAbFbE1mC9nstFbao2sT2sXUjXySFHQifs4vBgLhDM0uIBz5Wz2DaI8yfSVb8GvhdVyWhoSt1maGT0D_b44V9zSPKgtwJgkueN8Nd51ggoTWqMrxc4VwQ'

        const tokenType = searchParams.get("token_type");
        const expiresIn = searchParams.get("expires_in");
        if (accessToken) {
            window.close();
            window.opener.setItemsInLocalStorage({ accessToken, tokenType, expiresIn });
         
        } else {
            window.close();
        }
    }
})

// Access Token ------
// BQBup4CA0WHvGBhSe5VDzNHte0o56vI_UrDVoqKZo1JJ-NfqJNfDD6hZQ7zta6bamgcqYn4ZsPAw_wax3644iSq0nC8xLKKSzDk18PKgvXfy2Zqt4QHA4dfqD5zRlV97We3EreEWkJcVO6dKWx5MBPXjWqvjHL_rWhl5I77yf4YGglJ2PpcVU-oZORD6dBsfFAsoTQbcVPvjG1b2PpJPrndbolsN13Hve-HOrw
