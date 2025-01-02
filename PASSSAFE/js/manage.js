// MJ

document.addEventListener("DOMContentLoaded", () => {
  const passwordList = [
    { date: "2025-01-01", password: "example123", usage: "Email" },
    { date: "2025-01-02", password: "securePass!@#", usage: "Bank" },
    { date: "2025-01-03", password: "myStrongPass456", usage: "Work" },
  ];

  const tableBody = document.getElementById("passwordList");

  passwordList.forEach((entry) => {
    const row = document.createElement("tr");
    row.className = "password-row";

    const dateCell = document.createElement("td");
    dateCell.textContent = entry.date;

    const passwordCell = document.createElement("td");
    passwordCell.textContent = entry.password;

    const usageCell = document.createElement("td");
    usageCell.textContent = entry.usage;

    row.appendChild(dateCell);
    row.appendChild(passwordCell);
    row.appendChild(usageCell);

    tableBody.appendChild(row);
  });
});
