import { useEffect } from "react";

async function Fetch() {
    const url = "http://localhost:4000/readme";
    let readme = document.getElementById("readme");
    try {
        const response = await fetch(url);
        const data = await response.text();
        readme.innerHTML = data.slice(data.search("</h2>"));
    } catch (e) {
        readme.innerHTML = "Error getting information! <br> " + e;
    }
}

export default function About() {
    useEffect(() => {Fetch()})
    return (
        <section>
            <div id="readme"></div>
        </section>
    )
}