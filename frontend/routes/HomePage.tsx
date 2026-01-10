import { useEffect, useState } from "react"
// import PlaylistIcon from "../ui/PlaylistIcon";

import "../styles/Profile.css"
import "../styles/HomePage.css"
import CrossSiteHeader from "../ui/CrossSiteHeader";
import type { Clue } from "../types/clue";
import JeopardyBoard from "../ui/JeopardyBoard";

export default function HomePage() {
    

    // const [imgSrc, setImgSrc] = useState("");
    // const [username, setUsername] = useState("");
    const [clue, setClue] = useState<Clue>();
    const [clues, setClues] = useState<Clue[]>([]);
    const [editing, setEditing] = useState<boolean>(true);

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


    function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }    

    async function getRandomClue() {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_CLUE_API}/random_question`);
        if (res.ok) {

        }
        const data = await res.json();
        console.log(data)
        const n = randomInt(1, 49);
        setClue(data.data[n])
    }

    async function getRandomBoard() {
        // console.log("here")
        const res = await fetch(`${import.meta.env.VITE_BACKEND_CLUE_API}/random_board`);
        if (res.ok) {

        }
        const data = await res.json();
        setClues(data.data);
    }

    
    return (
        <>
            <CrossSiteHeader />
            <div>
                <button onClick={getRandomClue}>IsraelGPT, generate me a jeopardy CLUE that IDF soldiers will love</button>
                <button onClick={getRandomBoard}>IsraelGPT, generate me a jeopardy BOARD that IDF soldiers will love</button>
                <button onClick={() => setEditing(!editing)}>IsraelGPT do the thing</button>
            </div>
            <JeopardyBoard clues={clues} editing={editing}/>
            
        </>
    )

}