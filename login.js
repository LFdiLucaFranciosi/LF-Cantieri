const users = [
  { code: "L001", password: "Luchino2025", role: "employee", name: "Luchino" },
  { code: "M002", password: "Marco2025", role: "employee", name: "Marco" },
  { code: "T003", password: "Tommy2025", role: "employee", name: "Tommy" },
  { code: "E004", password: "Ema2025", role: "employee", name: "Ema" },
  { code: "A001", password: "Admin2025", role: "admin", name: "Admin" }
];

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const code = document.getElementById('code').value;
  const password = document.getElementById('password').value;
  const loginMessage = document.getElementById('loginMessage');

  const user = users.find(u => u.code === code && u.password === password);

  if (user) {
    localStorage.setItem('loggedInUser', JSON.stringify({ code: user.code, role: user.role, name: user.name }));
    if (user.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'employee.html';
    }
  } else {
    loginMessage.textContent = 'Codice o password errati.';
  }
});
