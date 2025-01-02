// JH + JM

document.addEventListener("DOMContentLoaded", () => {
  const checkButton = document.getElementById("checkButton");
  const result = document.getElementById("result");
  const passwordInput = document.getElementById("password");

  checkButton.addEventListener("click", () => {
    const password = passwordInput.value.trim();
    if (password.length < 8) {
      result.textContent = "비밀번호가 너무 짧습니다. 8자 이상 입력하세요.";
      result.className = "alert error";
      result.style.display = "block";
    } else {
      result.textContent = "안전한 비밀번호입니다.";
      result.className = "alert success";
      result.style.display = "block";
    }
  });
});
