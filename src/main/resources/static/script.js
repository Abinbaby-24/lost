const form = document.getElementById('itemForm');
const tableBody = document.getElementById('itemsTable');
const searchBox = document.getElementById('searchBox');

// Submit form (POST request)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value,
    description: form.description.value,
    status: form.status.value,
    location: form.location.value,
    contact: form.contact.value
  };

  try {
    await fetch('http://localhost:8080/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    form.reset();
    loadItems();
  } catch (err) {
    console.error("Error adding item:", err);
  }
});

// Load all items (GET request)
async function loadItems() {
  try {
    const res = await fetch('http://localhost:8080/api/items');
    const items = await res.json();

    tableBody.innerHTML = '';
    items.forEach(item => {
      const row = `
        <tr>
          <td>${item.name}</td>
          <td>${item.description}</td>
          <td>${item.status}</td>
          <td>${item.location}</td>
          <td>${item.contact}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error loading items:", err);
  }
}

// Search by name or location
searchBox.addEventListener('input', async () => {
  const query = searchBox.value.trim();

  if(query === '') {
    loadItems(); // reload all items if search box is empty
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/items/search?location=${query}`);
    const items = await res.json();

    tableBody.innerHTML = '';
    items.forEach(item => {
      const row = `
        <tr>
          <td>${item.name}</td>
          <td>${item.description}</td>
          <td>${item.status}</td>
          <td>${item.location}</td>
          <td>${item.contact}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error searching items:", err);
  }
});

// Initial load
loadItems();
