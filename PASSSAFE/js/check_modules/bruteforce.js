// js/check_modules/bruteForce.js

self.onmessage = function (event) {
    const { password, chars } = event.data;
    let attemptCount = 0;
    let current = chars[0].repeat(password.length);
    const totalAttempts = Math.pow(chars.length, password.length);
    const startTime = Date.now();
  
    // 브루트 포스 계산 루프
    while (current !== password) {
      attemptCount++;
      current = generateNextString(current, chars);
  
      // 진행 상태를 업데이트
      if (attemptCount % 1000 === 0) {
        const progress = (attemptCount / totalAttempts) * 100;
        self.postMessage({ type: "progress", progress, attemptCount, current });
      }
    }
  
    // 완료 시 메시지 전달
    const elapsedTime = (Date.now() - startTime) / 1000; // 초 단위
    const strength = determineStrength(elapsedTime);
  
    self.postMessage({
      type: "complete",
      password,
      elapsedTime,
      attemptCount,
      strength,
    });
  };
  
  function generateNextString(current, chars) {
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
  }
  
  // 강도 단계를 결정하는 함수
  function determineStrength(elapsedTime) {
    if (elapsedTime <= 10) return "Very Weak"; // 10초 이하
    if (elapsedTime <= 600) return "Weak"; // 10초 ~ 10분
    if (elapsedTime <= 3600) return "Fair"; // 10분 ~ 1시간
    if (elapsedTime <= 86400) return "Strong"; // 1시간 ~ 24시간
    return "Very Strong";
  }
  