export default function Changelog() {
    fetch("https://raw.githubusercontent.com/medojanos/MaxxedOut/main/CHANGELOG.md")
    .then(res => res.text())
    .then(markdown => document.getElementById("changelog").innerHTML = markdown.slice(markdown.search("</p>", markdown.length - 1)));
    return (
        <section>
            <h2>Releases</h2>
            <div id="changelog" className="content"></div>
        </section>
    )
}