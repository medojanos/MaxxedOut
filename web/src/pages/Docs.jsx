export default function Docs() {
    fetch("https://raw.githubusercontent.com/medojanos/MaxxedOut/main/README.md")
    .then(res => res.text())
    .then(markdown => {
        document.getElementById("readme").innerHTML = markdown.slice(markdown.search("</b>"), markdown.length - 1);
    });
    return (
        <section>
            <h2>Documentation</h2>
            <p>Download whole documentation</p>
            <p>
                <a href="https://raw.githubusercontent.com/medojanos/MaxxedOut/refs/heads/main/documents/Documentation_MaxxedOut-EN.docx">English</a>
                <span> | </span>
                <a href="https://raw.githubusercontent.com/medojanos/MaxxedOut/refs/heads/main/documents/Documentation_MaxxedOut-HU.docx">Hungarian</a>
            </p>
            <div id="readme" className="content"></div>
        </section>
    )
}
