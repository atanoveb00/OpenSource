// MJ

document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.getElementById("generateButton");
  const result = document.getElementById("result");
  
  generateButton.addEventListener("click", () => {
      // 옵션 1 체크박스 상태 확인
      const includeLetters = document.getElementById("includeLetters").checked;
      const includeNumbers = document.getElementById("includeNumbers").checked;
      const includeSpecialChars = document.getElementById("includeSpecialChars").checked;

      // 옵션 2 라디오 버튼 상태 확인
      const lengthOption = document.querySelector('input[name="lengthOption"]:checked');

      // 옵션 1: 최소 2개 이상 체크 확인
      const option1SelectedCount = [includeLetters, includeNumbers, includeSpecialChars].filter(Boolean).length;
      if (option1SelectedCount < 2) {
          alert("비밀번호 유형은 최소 2개 이상 선택해야 합니다.");
          return;
      }

      // 옵션 2: 길이 옵션 하나만 선택 확인
      if (!lengthOption) {
          alert("길이 옵션을 하나 선택해야 합니다.");
          return;
      }

      // 비밀번호 생성
      const [minLength, maxLength] = lengthOption.value.split("-").map(Number);
      const password = generatePassword(includeLetters, includeNumbers, includeSpecialChars, minLength, maxLength);

      result.textContent = `생성된 비밀번호: ${password}`;
      result.style.display = "block";
  });

  // 비밀번호 생성 함수
  function generatePassword(includeLetters, includeNumbers, includeSpecialChars, minLength, maxLength) {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const numbers = "0123456789";
      const specialChars = "!@#$%^&*()_+[]{}|;:',.<>?";

      let characterPool = "";
      if (includeLetters) characterPool += letters;
      if (includeNumbers) characterPool += numbers;
      if (includeSpecialChars) characterPool += specialChars;

      const passwordLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
      let password = "";
      for (let i = 0; i < passwordLength; i++) {
          password += characterPool.charAt(Math.floor(Math.random() * characterPool.length));
      }

      return password;
  }
});