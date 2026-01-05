import { useEffect } from "react";

export default function Docs() {
    useEffect(() => {
        async function Fetch() {
            const url = "http://localhost:4000/readme";
            let readme = document.getElementById("readme");
            try {
                const response = await fetch(url);
                const data = await response.text();
                readme.innerHTML = data.slice(data.search("</b>"));
            } catch (e) {
                readme.innerHTML = "Error getting information! <br> " + e;
            }
        }
        Fetch();
    })
    return (
        <section id="docs">
            <div className="container-lg" id="readme"></div>
        </section>
    )
}