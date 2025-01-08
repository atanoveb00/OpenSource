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

// brute force 시뮬레이션
document.getElementById("brute-force-button").addEventListener("click", () => {
  const password = document.getElementById("passwordInput").value.trim();

  if (!password) {
    alert("Please enter a password.");
    return;
  }

  let attemptCount = 0;
  const startTime = Date.now();
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const statusDisplay = document.getElementById("status");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const currentAttemptDisplay = document.getElementById("current-attempt");
  const bruteForceTime = document.getElementById("brute-force-time");

  // 진행 상태 초기화
  statusDisplay.textContent = "Status: Starting brute force...";
  progressBarFill.style.width = "0%";
  progressBarFill.className = "progress-bar-fill"; // 초기 상태
  currentAttemptDisplay.textContent = "Current attempt: ";
  bruteForceTime.textContent = "";

  const totalAttempts = Math.pow(chars.length, password.length);

  const bruteForce = (current) => {
    if (current === password) {
      const endTime = Date.now();
      const elapsedTime = ((endTime - startTime) / 1000).toFixed(2);

      // 비밀번호 찾음
      statusDisplay.textContent = `Status: Password found in ${elapsedTime} seconds after ${attemptCount} attempts!`;
      currentAttemptDisplay.textContent = `Current attempt: ${current}`;
      progressBarFill.style.width = "100%";
      progressBarFill.className = "progress-bar-fill critical";
      return;
    }

    attemptCount++;
    currentAttemptDisplay.textContent = `Current attempt: ${current}`;

    // 게이지 업데이트
    const progress = ((attemptCount / totalAttempts) * 100).toFixed(2);
    progressBarFill.style.width = `${progress}%`;

    // 진행 상태에 따른 색상 변경
    if (progress < 40) {
      progressBarFill.className = "progress-bar-fill";
    } else if (progress < 70) {
      progressBarFill.className = "progress-bar-fill high";
    } else {
      progressBarFill.className = "progress-bar-fill critical";
    }

    // 다음 문자열 생성
    setTimeout(() => {
      const next = generateNextString(current, chars);
      bruteForce(next);
    }, 0); // 업데이트 간격
  };

  const generateNextString = (current, chars) => {
    let i = current.length - 1;
    while (i >= 0) {
      const charIndex = chars.indexOf(current[i]);
      if (charIndex < chars.length - 1) {
        return (
          current.substring(0, i) +
          chars[charIndex + 1] +
          current.substring(i + 1)
        );
      }
      current = current.substring(0, i) + chars[0] + current.substring(i + 1);
      i--;
    }
    return chars[0] + current;
  };

  bruteForce(chars[0]);
});

// HIBP 부분

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
    // 파일 내용 파싱: 첫 번째 줄(헤더) 제외, 탭으로 구분된 데이터에서 비밀번호 추출
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const passwords = lines
      .slice(1) // 첫 번째 줄(헤더) 제외
      .map((line) => line.split("\t")[1]) // 두 번째 열(비밀번호)만 추출
      .filter((password) => password && password.trim() !== ""); // 유효한 비밀번호만 필터링

    if (passwords.length === 0) {
      resultDiv_Multiple.textContent =
        "파일에서 유효한 비밀번호를 찾을 수 없습니다.";
      return;
    }

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
