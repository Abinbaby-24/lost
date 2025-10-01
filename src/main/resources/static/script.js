const form = document.getElementById('itemForm');
const tableBody = document.getElementById('itemsTable');
const searchBox = document.getElementById('searchBox');

// Load items from backend
async function loadItems() {
  const res = await fetch('http://localhost:8080/api/items');
  const items = await res.json();

  tableBody.innerHTML = '';
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.status}</td>
      <td>${item.location}</td>
      <td>${item.contact}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Add new item
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    name: form.name.value,
    description: form.description.value,
    status: form.status.value,
    location: form.location.value,
    contact: form.contact.value
  };

  const res = await fetch('http://localhost:8080/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  if(res.ok) {
    form.reset();
    loadItems(); // instantly refresh table
  } else {
    alert('Error adding item.');
  }
});

// Search filter
searchBox.addEventListener('input', () => {
  const filter = searchBox.value.toLowerCase();
  Array.from(tableBody.rows).forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
  });
});

// Initial load
loadItems();
