window.onload = fetchReadme();

async function fetchReadme() {
  const url = "https://raw.githubusercontent.com/medojanos/MaxxedOut/refs/heads/main/README.md";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    document.getElementById("more").innerHTML = await response.text();
  } catch (error) {
    console.error(error.message);
  }
}