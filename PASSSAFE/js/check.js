// JH + JM

import { checkPasswordStrength } from "./check_modules/zxcvbn.js";
import { checkPassword, checkBulkPasswords } from "./check_modules/hibp.js";

document.addEventListener("DOMContentLoaded", () => {
  const result = document.getElementById("result");
  const passwordInput = document.getElementById("passwordInput");
  const strengthBar = document.getElementById("strength-bar");
  const strengthText = document.getElementById("strength-text");

  const updatePasswordFeedback = () => {
    const password = passwordInput.value.trim();

    if (password.length < 8) {
      result.textContent = "비밀번호가 너무 짧습니다. 8자 이상 입력하세요.";
      result.className = "alert error";
      result.style.display = "block";

      strengthBar.style.width = "0%";
      strengthBar.style.backgroundColor = "#e0e0e0";
      strengthText.innerHTML = `Password strength: <span style="color: #e0e0e0;">Too Short</span>`;
      return;
    } else {
      result.textContent = "비밀번호 길이는 적절합니다.";
      result.className = "alert success";
      result.style.display = "block";
    }

    try {
      const { score, strengthLevels, strengthColors, strengthWidths } =
        checkPasswordStrength(password);

      // 안전도 막대 업데이트
      strengthBar.style.width = strengthWidths[score];
      strengthBar.style.backgroundColor = strengthColors[score];

      // 안전도 텍스트 업데이트 (강도만 색상 적용)
      const strengthTextContent = strengthLevels[score];
      strengthText.innerHTML = `Password strength: <span style="color: ${strengthColors[score]};">${strengthTextContent}</span>`;
    } catch (error) {
      console.error(error.message);
      strengthText.innerHTML = `Password strength: <span style="color: #e0e0e0;">Error</span>`;
    }
  };

  passwordInput.addEventListener("input", updatePasswordFeedback);
});

////////

const form = document.getElementById("password-form");
const bulkForm = document.getElementById("bulk-form");
const resultDiv_Single = document.getElementById("result_HIBP_Single");
const resultDiv_Multiple = document.getElementById("result_HIBP_Multiple");

// 비밀번호 강도 등급
function getPasswordStrength(count) {
  if (count === 0) return { grade: "Safe", color: "green" };
  if (count <= 10) return { grade: "Moderate Risk", color: "orange" };
  return { grade: "High Risk", color: "red" };
}

// 단일 비밀번호 검사 핸들러
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;

  if (password) {
    resultDiv_Single.textContent = "Checking...";
    const count = await checkPassword(password);
    const { grade, color } = getPasswordStrength(count);

    resultDiv_Single.innerHTML = `
      <span style="color: ${color};">
        This password has been pwned ${count} times. Risk Level: ${grade}
      </span>`;
  } else {
    resultDiv_Single.textContent = "Please enter a password.";
  }
});

// 대량 비밀번호 검사 핸들러
bulkForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("bulk-passwords");
  const file = fileInput.files[0];

  if (file) {
    const text = await file.text();
    const passwords = text.split("\n").filter((p) => p.trim() !== "");

    resultDiv_Multiple.textContent = "Checking bulk passwords...";
    const results = await checkBulkPasswords(passwords);

    resultDiv_Multiple.innerHTML = `
      <h3>Bulk Password Check Results:</h3>
      <ul>
        ${results
          .map(
            (r) => `
          <li>
            Password: ${r.password} - Found ${r.count} times.
            <span style="color: ${getPasswordStrength(r.count).color};">
              (${getPasswordStrength(r.count).grade})
            </span>
          </li>
        `
          )
          .join("")}
      </ul>`;
  } else {
    resultDiv_Multiple.textContent = "Please upload a file.";
  }
});

// 폼 제출 처리
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password_HIBP").value;

  if (password) {
    resultDiv_Single.textContent = "Checking...";
    const count = await checkPassword(password);

    if (count > 0) {
      resultDiv_Single.innerHTML = `<span style="color: red;">This password has been pwned ${count} times! Choose another password.</span>`;
    } else {
      resultDiv_Single.innerHTML = `<span style="color: green;">This password is safe to use.</span>`;
    }
  } else {
    resultDiv_Single.textContent = "Please enter a password.";
  }
});
