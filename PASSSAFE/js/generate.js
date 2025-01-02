// MJ

document.getElementById("generateButton").addEventListener("click", () => {
  const includeLetters = document.getElementById("includeLetters").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSpecialChars = document.getElementById(
    "includeSpecialChars"
  ).checked;
  const minLength = document.getElementById("minLength").checked;

  const resultDiv = document.getElementById("result");

  // Generate password
  const password = generatePassword(
    includeLetters,
    includeNumbers,
    includeSpecialChars,
    minLength
  );

  if (password) {
    resultDiv.textContent = `Generated Password: ${password}`;
    resultDiv.style.display = "block";
  } else {
    resultDiv.textContent = "Please select at least one option.";
    resultDiv.style.display = "block";
  }
});

function generatePassword(
  includeLetters,
  includeNumbers,
  includeSpecialChars,
  minLength
) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
  let characters = "";

  if (includeLetters) characters += letters;
  if (includeNumbers) characters += numbers;
  if (includeSpecialChars) characters += specialChars;

  if (!characters) return null;

  const length = minLength ? 8 : 6; // Default to 6 if no minimum length is selected
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}
