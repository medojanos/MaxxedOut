export default function Docs() {
    fetch("https://raw.githubusercontent.com/medojanos/MaxxedOut/main/README.md")
    .then(res => res.text())
    .then(markdown => {
        document.getElementById("docs").innerHTML = markdown.slice(markdown.search("</b>"), markdown.length - 1);
    });
    return (
        <section>
            <div id="docs" className="container-lg"></div>
        </section>
    )
}