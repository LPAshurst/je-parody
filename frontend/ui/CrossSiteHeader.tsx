import { useState, useRef, useEffect } from "react";
import {  Autocomplete, MenuItem, } from "@mui/material";
import { CircleUser, House, LogOut, Search, UserPen } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { StyledMenu, UserButton, SearchComponent, SearchIconWrapper, StyledInputBase, StyledPopper } from "../styles/muiStyled";
import "../styles/CrossSiteHeader.css"

export default function CrossSiteHeader() {

    const navigate = useNavigate();
    const location = useLocation();

    const headerEl = useRef<HTMLDivElement | null>(null);
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [anchorSearchEl, setAnchorSearchEl] = useState<null | HTMLElement>(null);

    const [query, setQuery] = useState("");
    const [artistList, setArtistList] = useState<[]>([]);
    const [loading, setLoading] = useState(false);

    const openEl = Boolean(anchorEl);
    const openSearch = Boolean(anchorSearchEl);

    useEffect(() => {

        if (!query) {
            setArtistList([])
            return;
        }

        const controller = new AbortController();

        const timeoutId = setTimeout(async () => {
            setLoading(true)
            
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_SPOTIFY_API}/searchArtists?` +
                    new URLSearchParams({ q: query }),
                    { signal: controller.signal }
                );
                const data = await res.json();
                setArtistList(data.artists.items); 
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }

        }, 500);

        return () => {
            clearTimeout(timeoutId)
            controller.abort()
        }
        
    }, [query])

    const handleClickEl = () => {
        if (headerEl.current) {
            setAnchorEl(headerEl.current);
        }
    };
    const handleCloseEl = () => {
        setAnchorEl(null);
    };

    async function handleLogout() {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_AUTH_API}/logout`, {
            method: "POST",
            body: JSON.stringify({}),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
        navigate("/");
    }

    function goHome() {
        if (location.pathname !== "/home") {
            navigate("/home")
        }
    }

    return (
        <header className="profile-header" ref={headerEl}>
            {/* for both user buttons here i am just overriding the style that i set in muiStyled.ts for if they are on the left or right */}
            <UserButton sx={{marginLeft: ".75rem"}} onClick={goHome}>
                <House strokeWidth={1.75} />
            </UserButton>


            <Autocomplete
                slots={{
                    popper: StyledPopper,
                    
                }}
                sx={{width: "60ch"}}
                popupIcon={null}
                options={artistList}
                filterOptions={(x) => x}
                getOptionLabel={(artist) => typeof artist === "string" ? artist : artist}
                loading={loading}
                onInputChange={(_, q) => setQuery(q)}
                renderInput={(params) => (
                    <SearchComponent>
                        <SearchIconWrapper>
                            <Search size={22} strokeWidth={1.5} />
                                <StyledInputBase
                                    {...params}
                                    inputRef={params.InputProps.ref} 
                                    placeholder="Search..."
                                    variant="outlined"
                                />
                        </SearchIconWrapper>
                    </SearchComponent>
                )}
                
            />

            {/* Should prolly make this .5rem thing a var that i can use but for now im going to hardcode it */}

            <UserButton onClick={handleClickEl} sx={{marginRight: ".75rem"}}>
                <UserPen size={20} /> {/* you can control icon size */}
            </UserButton>

            <StyledMenu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openEl}
                onClose={handleCloseEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                // this is set so that the menu can be flush with the right side of screen
                marginThreshold={0}
                
            >
                <MenuItem onClick={handleCloseEl}>
                    <CircleUser strokeWidth={1.75} style={{marginRight: "1rem"}}/>
                    View Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <LogOut style={{marginRight: "1rem"}}/>
                    Log out
                </MenuItem>
            </StyledMenu>

        </header>
    )
}