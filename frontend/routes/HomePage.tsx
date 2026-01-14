import { useNavigate } from "react-router-dom";

export default function HomePage() {

    const navigate = useNavigate();
    
    return (
        <>
            <button onClick={() => {navigate("../edit/new-board")}}>press me to make a new board</button>
            <button onClick={() => {navigate("../edit/new-board")}}>press me to edit an existing board from your account</button>
            <ul>
                {}
            </ul>            
        </>
    )

}