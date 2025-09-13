window.onload = () => {
    getData();
} 

async function getData() {
  const url = "https://raw.githubusercontent.com/medojanos/MaxxedOut/main/README.md";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    displayData(await response.text());
  } catch (error) {
    console.error(error.message);
  }
}

function displayData(data) {
  const more = document.getElementById("more");
  let rows = data.split('\n');
  rows.splice(0, 2);
  let rowText;
  rows.forEach(row => {
    if (row[0] == '#' && row[1] == '#' && row[2] == '#') {
      rowText = document.createElement('h4');
      rowText.textContent = row.slice(3);
    } else if (row[0] == '#' && row[1] == '#') {
      rowText = document.createElement('h3');
      rowText.textContent = row.slice(2);
    } else if (row[0] == '#') {
      rowText = document.createElement('h2');
      rowText.textContent = row.slice(1);
    } else {
      rowText = document.createElement('p');
      rowText.textContent = row;
    }
    more.appendChild(rowText);
  });
}