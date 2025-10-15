window.onload = async () => {
  const url = "https://raw.githubusercontent.com/medojanos/MaxxedOut/refs/heads/main/README.md";
  try {
    const response = await fetch(url);
    document.getElementById("more").innerHTML = await response.text();
  } catch (error) {
    console.error(error.message);
  }
};