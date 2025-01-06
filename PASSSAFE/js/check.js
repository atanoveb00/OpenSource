// JH + JM

import { checkPasswordStrength } from "./check_modules/zxcvbn.js";

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
const resultDiv = document.getElementById("result_HIBP");

// SHA-1 해시 생성 함수
async function sha1(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// HIBP API 호출
async function checkPassword(password) {
  const hashedPassword = await sha1(password);
  const prefix = hashedPassword.slice(0, 5);
  const suffix = hashedPassword.slice(5);

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`
  );
  const text = await response.text();

  const matches = text
    .split("\n")
    .find((line) => line.startsWith(suffix.toUpperCase()));
  return matches ? parseInt(matches.split(":")[1], 10) : 0;
}

// 폼 제출 처리
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password_HIBP").value;

  if (password) {
    resultDiv.textContent = "Checking...";
    const count = await checkPassword(password);

    if (count > 0) {
      resultDiv.innerHTML = `<span style="color: red;">This password has been pwned ${count} times! Choose another password.</span>`;
    } else {
      resultDiv.innerHTML = `<span style="color: green;">This password is safe to use.</span>`;
    }
  } else {
    resultDiv.textContent = "Please enter a password.";
  }
});
