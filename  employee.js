// Controllo login all'avvio
document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const content = document.getElementById('content');
  const userInfo = document.getElementById('userInfo');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!user || user.role !== 'employee') {
    window.location.href = 'login.html';
  } else {
    userInfo.textContent = `Benvenuto, ${user.name}!`;
    logoutBtn.style.display = 'block';
  }
});

let currentEntry = null;

document.getElementById('entryForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const site = document.getElementById('site').value;

  if (!site) {
    alert('Inserisci un cantiere.');
    return;
  }

  const now = new Date().toISOString();
  const registerExitButton = document.getElementById('registerExit');

  if (!currentEntry) {
    // Registrazione entrata
    currentEntry = {
      employee: user.name,
      site: site,
      entryTime: now,
      exitTime: null,
      hoursWorked: 0
    };
    document.getElementById('entryForm').reset();
    registerExitButton.disabled = false;
    alert('Entrata registrata alle: ' + new Date(now).toLocaleString());
  } else {
    // Registrazione uscita
    currentEntry.exitTime = now;
    const hoursWorked = (new Date(currentEntry.exitTime) - new Date(currentEntry.entryTime)) / (1000 * 60 * 60);
    currentEntry.hoursWorked = hoursWorked;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const entry = {
            ...currentEntry,
            latitude: latitude,
            longitude: longitude,
            timestamp: new Date().toISOString()
          };
          let entries = JSON.parse(localStorage.getItem('entries')) || [];
          entries.push(entry);
          localStorage.setItem('entries', JSON.stringify(entries));

          alert('Uscita registrata alle: ' + new Date(now).toLocaleString() + '\nOre lavorate: ' + hoursWorked.toFixed(2));
          document.getElementById('entryForm').reset();
          currentEntry = null;
          registerExitButton.disabled = true;
        },
        (error) => {
          alert('Errore: Impossibile ottenere la posizione GPS. Assicurati di aver abilitato il GPS e concesso i permessi.');
          console.error('Errore geolocalizzazione:', error);
        }
      );
    } else {
      alert('Errore: Il tuo dispositivo non supporta la geolocalizzazione.');
    }
  }
});

// Pulsante Registra Uscita
document.getElementById('registerExit').addEventListener('click', function() {
  if (!currentEntry) {
    alert('Registra prima un\'entrata!');
    return;
  }

  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const now = new Date().toISOString();
  currentEntry.exitTime = now;
  const hoursWorked = (new Date(currentEntry.exitTime) - new Date(currentEntry.entryTime)) / (1000 * 60 * 60);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const entry = {
          ...currentEntry,
          exitTime: now,
          hoursWorked: hoursWorked,
          latitude: latitude,
          longitude: longitude,
          timestamp: new Date().toISOString()
        };
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));

        alert('Uscita registrata alle: ' + new Date(now).toLocaleString() + '\nOre lavorate: ' + hoursWorked.toFixed(2));
        document.getElementById('entryForm').reset();
        currentEntry = null;
        this.disabled = true;
      },
      (error) => {
        alert('Errore: Impossibile ottenere la posizione GPS. Assicurati di aver abilitato il GPS e concesso i permessi.');
        console.error('Errore geolocalizzazione:', error);
      }
    );
  } else {
    alert('Errore: Il tuo dispositivo non supporta la geolocalizzazione.');
  }
});

// Funzione logout
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}
