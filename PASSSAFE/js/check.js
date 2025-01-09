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

      strengthBar.style.width = "0%";
      strengthBar.style.backgroundColor = "#e0e0e0";
      strengthText.innerHTML = `Password strength: <span style="color: #e0e0e0;">Too Short</span>`;
      return;
    } else {
      result.textContent = "비밀번호 길이는 적절합니다.";
      result.className = "alert success";
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

// 비밀번호 보기/숨기기 버튼 기능
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("passwordInput");
  const togglePassword = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");

  togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.src = "/assets/img/eye-open.png"; // 눈 감은 아이콘으로 변경
    } else {
      passwordInput.type = "password";
      eyeIcon.src = "/assets/img/eye-closed.png"; // 눈 뜬 아이콘으로 변경
    }
  });
});

// 비밀번호 상태 체크 기능
const conditionStatus = document.getElementById("condition-status");

const analyzePassword = (password) => {
  const conditions = [
    { label: "Length (12+)", valid: password.length >= 12 },
    { label: "Uppercase Letters", valid: /[A-Z]/.test(password) },
    { label: "Lowercase Letters", valid: /[a-z]/.test(password) },
    { label: "Numbers", valid: /[0-9]/.test(password) },
    { label: "Special Characters", valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  return conditions;
};

const renderVisualFeedback = (password) => {
  const conditions = analyzePassword(password);

  // 시각적 조건 상태 표시
  conditionStatus.innerHTML = `
    <div class="conditions-row">
      ${conditions.slice(0, 3)
        .map(
          (condition) =>
            `<div class="condition-item">${condition.valid ? "✔️" : "❌"} ${condition.label}</div>`
        )
        .join("")}
    </div>
    <div class="conditions-row">
      ${conditions.slice(3)
        .map(
          (condition) =>
            `<div class="condition-item">${condition.valid ? "✔️" : "❌"} ${condition.label}</div>`
        )
        .join("")}
    </div>
  `;
};

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value.trim();
  renderVisualFeedback(password);
});

// brute force 시뮬레이션
document.getElementById("brute-force-button").addEventListener("click", () => {
  const password = document.getElementById("passwordInput").value.trim();
  if (!password) {
    alert("비밀번호를 입력하세요.");
    return;
  }

  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  const progressBarFill = document.getElementById("progress-bar-fill");
  const currentAttemptDisplay = document.getElementById("current-attempt");
  const statusDisplay = document.getElementById("status");
  const bruteStrengthText = document.getElementById("brute-strength-text");

  // 초기화
  progressBarFill.style.width = "0%";
  progressBarFill.style.backgroundColor = "#e0e0e0";
  statusDisplay.textContent = "Status: In Progress...";
  currentAttemptDisplay.textContent = "Current attempt: Waiting...";
  bruteStrengthText.textContent = "Password strength: Calculating...";

  // 웹 워커 생성
  const bruteForceWorker = new Worker("./js/check_modules/bruteForce.js");

  // 워커에 데이터 전달
  bruteForceWorker.postMessage({ password, chars });

  // 워커 메시지 처리
  bruteForceWorker.onmessage = (event) => {
    const { type, progress, attemptCount, current, elapsedTime, strength } = event.data;

    if (type === "progress") {
      // 진행 상태 업데이트
      progressBarFill.style.width = `${progress}%`;
      currentAttemptDisplay.textContent = `Current attempt: ${current}`;
    } else if (type === "complete") {
      // 강도 단계별 색상 및 너비
      const strengthColors = {
        "Very Weak": "#F37878",
        "Weak": "#F99A5F",
        "Fair": "#FFD54F",
        "Strong": "#90CAF9",
        "Very Strong": "#00AB59",
      };

      const strengthWidths = {
        "Very Weak": "20%",
        "Weak": "40%",
        "Fair": "60%",
        "Strong": "80%",
        "Very Strong": "100%",
      };

      // 막대 게이지와 텍스트 업데이트
      currentAttemptDisplay.textContent = `Current attempt: ${password}`;
      progressBarFill.style.width = strengthWidths[strength];
      progressBarFill.style.backgroundColor = strengthColors[strength];
      statusDisplay.innerHTML = `Password found in <span>${elapsedTime.toFixed(2)} seconds</span> after <span>${attemptCount} attempts</span>.`;
      bruteStrengthText.innerHTML = `Password strength: <span style="color: ${strengthColors[strength]}">${strength}</span>`;
    }
  };
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
