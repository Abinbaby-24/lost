console.log("Lost & Found JS loaded!");

const form = document.getElementById('itemForm');
const tableBody = document.getElementById('itemsTable');
const searchBox = document.getElementById('searchBox');

const API_BASE = "http://localhost:8080/api/items";
let allItems = [];

// --- 1️⃣ Add Item to MySQL Database ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const itemData = {
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    status: form.status.value,
    location: form.location.value.trim(),
    contact: form.contact.value.trim()
  };

  // Validation based on your table structure
  if (!itemData.name || !itemData.description || !itemData.location || !itemData.contact) {
    alert('Please fill in all required fields!');
    return;
  }

  if (itemData.name.length > 100) {
    alert('Item name must be less than 100 characters');
    return;
  }

  if (itemData.location.length > 150 || itemData.contact.length > 150) {
    alert('Location and Contact must be less than 150 characters');
    return;
  }

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData)
    });

    if (res.ok) {
      alert('Item added successfully to database!');
      form.reset();
      searchBox.value = '';
      loadItems(); // Refresh the table
    } else {
      const error = await res.text();
      alert("Failed to add item: " + error);
    }
  } catch (err) {
    console.error("Error adding item:", err);
    alert("Network error. Please check if the server is running.");
  }
});

// --- 2️⃣ Load All Items from MySQL Database ---
async function loadItems() {
  try {
    const res = await fetch(API_BASE);
    if (res.ok) {
      allItems = await res.json();
      renderTable(allItems);
    } else {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  } catch (err) {
    console.error("Error loading items from database:", err);
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          Error connecting to database. Please check:<br>
          1. Backend server is running<br>
          2. MySQL database 'lostfound2' is running<br>
          3. Database credentials are correct
        </td>
      </tr>
    `;
  }
}

// --- 3️⃣ Render Table with MySQL Data ---
function renderTable(items) {
  tableBody.innerHTML = '';
  
  if (items.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No items found in database</td></tr>';
    return;
  }

  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.description)}</td>
      <td>
        <span class="badge ${item.status === 'Found' ? 'bg-success' : 'bg-warning'}">
          ${item.status}
        </span>
      </td>
      <td>${escapeHtml(item.location)}</td>
      <td>${escapeHtml(item.contact)}</td>
      <td>${formatDate(item.created_at)}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// --- 4️⃣ Search Items in MySQL Database ---
searchBox.addEventListener('input', async () => {
  const query = searchBox.value.trim();
  
  if (!query) {
    renderTable(allItems);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
    if (res.ok) {
      const filteredItems = await res.json();
      renderTable(filteredItems);
    }
  } catch (err) {
    console.error("Error searching items:", err);
    // Fallback to client-side filtering
    const filtered = allItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase()) ||
      item.contact.toLowerCase().includes(query.toLowerCase())
    );
    renderTable(filtered);
  }
});

// --- 5️⃣ Delete Item Function ---
async function deleteItem(itemId) {
  if (!confirm('Are you sure you want to delete this item?')) {
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/${itemId}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Item deleted successfully!');
      loadItems();
    } else {
      const error = await res.text();
      alert('Failed to delete item: ' + error);
    }
  } catch (err) {
    console.error("Error deleting item:", err);
    alert('Error deleting item from database');
  }
}

// --- 6️⃣ Update Item Status ---
async function updateItemStatus(itemId, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      alert('Item status updated successfully!');
      loadItems();
    } else {
      const error = await res.text();
      alert('Failed to update item: ' + error);
    }
  } catch (err) {
    console.error("Error updating item:", err);
    alert('Error updating item status');
  }
}

// --- 7️⃣ Utility Functions ---
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// --- 8️⃣ Initialize the Application ---
document.addEventListener('DOMContentLoaded', function() {
  loadItems();
  console.log('Lost & Found system initialized with MySQL database: lostfound2');
});

// --- 9️⃣ Export Data (Bonus Feature) ---
async function exportData() {
  try {
    const res = await fetch(`${API_BASE}/export`);
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lostfound_data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (err) {
    console.error("Error exporting data:", err);
  }
}