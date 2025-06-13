// Controllo login all'avvio
document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const content = document.getElementById('content');
  const userInfo = document.getElementById('userInfo');

  if (!user || user.role !== 'admin') {
    window.location.href = 'login.html';
  } else {
    userInfo.textContent = `Benvenuto, ${user.name}!`;
  }
});

function renderSummary(monthFilter) {
  const entries = JSON.parse(localStorage.getItem('entries')) || [];
  const summaryTable = document.getElementById('summaryTable');
  summaryTable.innerHTML = '';

  const summary = {};
  entries.forEach(entry => {
    if (!entry.hoursWorked) return;

    if (monthFilter) {
      const entryMonth = new Date(entry.entryTime).toISOString().slice(0, 7);
      if (entryMonth !== monthFilter) return;
    }

    const key = `${entry.employee}-${entry.site}`;
    if (!summary[key]) {
      summary[key] = {
        employee: entry.employee,
        site: entry.site,
        hours: 0,
        gps: []
      };
    }
    summary[key].hours += entry.hoursWorked;
    summary[key].gps.push({
      latitude: entry.latitude,
      longitude: entry.longitude,
      timestamp: entry.entryTime
    });
  });

  Object.values(summary).forEach(item => {
    const row = document.createElement('tr');
    const gpsLinks = item.gps
      .map(g => `<a href="https://maps.google.com/?q=${g.latitude},${g.longitude}" target="_blank">${g.latitude}, ${g.longitude} (${new Date(g.timestamp).toLocaleString()})</a>`)
      .join('<br>');
    row.innerHTML = `
      <td>${item.employee}</td>
      <td>${item.site}</td>
      <td>${item.hours.toFixed(2)}</td>
      <td>${gpsLinks}</td>
    `;
    summaryTable.appendChild(row);
  });
}

document.getElementById('monthFilter').addEventListener('change', function() {
  renderSummary(this.value);
});

renderSummary();

// Funzione logout
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}
