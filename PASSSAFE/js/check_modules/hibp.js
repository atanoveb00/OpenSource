// JH

// SHA-1 해시 생성
async function sha1(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 단일 비밀번호 검사
export async function checkPassword(password) {
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

// 대량 비밀번호 검사
export async function checkBulkPasswords(passwords) {
  const results = [];
  for (const password of passwords) {
    const count = await checkPassword(password);
    results.push({ password, count });
  }
  return results;
}
