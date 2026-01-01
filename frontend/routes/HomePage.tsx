import { useEffect, useState } from "react"
import { SpotifyPlaylist, SpotifyProfile } from "../types";
// import PlaylistIcon from "../ui/PlaylistIcon";

import "../styles/Profile.css"
import CrossSiteHeader from "../ui/CrossSiteHeader";

export default function HomePage() {


    // const [imgSrc, setImgSrc] = useState("");
    // const [username, setUsername] = useState("");
    // const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

    useEffect(() => {

        // const fetchProfile = async () => {
        //     const data = await fetch(`${import.meta.env.VITE_BACKEND_SPOTIFY_API}/me/profile`, { credentials: "include" });
        //     const resultJson = await data.json();
        //     const result: SpotifyProfile = resultJson.data;
            
        //     setImgSrc(result.images[0].url);
        //     setUsername(result.display_name);
        // }
        // fetchProfile();

        // const fetchPlaylists = async () => {
        //     const data = await fetch(`${import.meta.env.VITE_BACKEND_SPOTIFY_API}/me/playlists`, { credentials: "include" });
        //     const resultJson = await data.json();
        //     const result: SpotifyPlaylist[] = resultJson.data.items
        //     console.log(result);
        //     setPlaylists(result ?? []);
        // }
        // fetchPlaylists();
    }, []);


    
    return (
        <>
            <CrossSiteHeader />
            {/* <div>
                <h1 style={{top: "0px"}}>Hello this is my profile</h1>
                <h3> username: {username}</h3>
                {imgSrc ? (
                    <img src={imgSrc} alt="profile" style={{ width: 100, height: 100 }} />
                ) : (
                    <p>No image available</p>
                )}
                <h2>Playlists</h2>
                <ul>
                    {
                    playlists.map((playlist: SpotifyPlaylist) => (
                        <PlaylistIcon 
                            key={playlist.id}
                            url={playlist.images?.[0]?.url ?? ""} 
                            playlistName={playlist.name} 
                        />
                    ))}
                </ul>
                
            </div> */}
        </>

            
    )

}