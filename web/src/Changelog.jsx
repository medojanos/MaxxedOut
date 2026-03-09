export default function Changelog() {
    fetch("https://raw.githubusercontent.com/medojanos/MaxxedOut/main/CHANGELOG.md")
    .then(res => res.text())
    .then(markdown => document.getElementById("changelog").innerHTML = markdown.slice(markdown.search("</p>", markdown.length - 1)));
    return (
        <section>
            <div id="changelog" className="container-lg"></div>
        </section>
    )
}