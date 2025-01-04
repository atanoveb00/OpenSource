// JH + JM

import { checkPasswordStrength } from './check_modules/zxcvbn.js';

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
            const {
                score,
                strengthLevels,
                strengthColors,
                strengthWidths,
            } = checkPasswordStrength(password);

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

