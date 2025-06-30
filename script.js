let bugs = JSON.parse(localStorage.getItem('bugs')) || [];

function addBug() {
  const title = document.getElementById('bugTitle').value;
  const desc = document.getElementById('bugDesc').value;
  const priority = document.getElementById('bugPriority').value;
  const category = document.getElementById('bugCategory').value;
  const assignedTo = document.getElementById('assignedTo').value;

  if (!title || !desc) {
    alert("Title and Description required!");
    return;
  }

  const bug = {
    id: Date.now(),
    title,
    desc,
    priority,
    category,
    assignedTo,
    status: 'Open',
    history: [`Created at ${new Date().toLocaleString()}`]
  };

  bugs.push(bug);
  localStorage.setItem('bugs', JSON.stringify(bugs));
  renderBugs();
}

function toggleStatus(id) {
  bugs = bugs.map(bug => {
    if (bug.id === id) {
      bug.status = bug.status === 'Open' ? 'Closed' : 'Open';
      bug.history.push(`Status changed to ${bug.status} at ${new Date().toLocaleString()}`);
    }
    return bug;
  });
  localStorage.setItem('bugs', JSON.stringify(bugs));
  renderBugs();
}

function deleteBug(id) {
  bugs = bugs.filter(bug => bug.id !== id);
  localStorage.setItem('bugs', JSON.stringify(bugs));
  renderBugs();
}

function renderBugs(filtered = bugs) {
  const list = document.getElementById('bugList');
  list.innerHTML = '';

  filtered.forEach(bug => {
    const div = document.createElement('div');
    div.className = 'bug';
    div.innerHTML = `
      <h3>${bug.title}</h3>
      <p><strong>Description:</strong> ${bug.desc}</p>
      <p><strong>Priority:</strong> ${bug.priority} | <strong>Status:</strong> ${bug.status}</p>
      <p><strong>Category:</strong> ${bug.category} | <strong>Assigned To:</strong> ${bug.assignedTo}</p>
      <p><strong>History:</strong><br>${bug.history.join('<br>')}</p>
      <button onclick="toggleStatus(${bug.id})">Toggle Status</button>
      <button onclick="deleteBug(${bug.id})">Delete</button>
    `;
    list.appendChild(div);
  });
}

function filterBugs() {
  const priority = document.getElementById('filterPriority').value;
  const status = document.getElementById('filterStatus').value;

  const filtered = bugs.filter(bug => {
    return (priority ? bug.priority === priority : true) &&
           (status ? bug.status === status : true);
  });

  renderBugs(filtered);
}

function exportCSV() {
  const csv = ["Title,Description,Priority,Status,Category,Assigned To"];
  bugs.forEach(bug => {
    csv.push(`${bug.title},${bug.desc},${bug.priority},${bug.status},${bug.category},${bug.assignedTo}`);
  });
  const blob = new Blob([csv.join("\n")], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bugs.csv";
  a.click();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

renderBugs();
