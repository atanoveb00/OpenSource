// MJ

document.addEventListener("DOMContentLoaded", () => {
  const passwordListTable = document.getElementById("passwordList");
  const homeButtonContainer = document.getElementById("homeButtonContainer");

  // 로컬 스토리지에서 비밀번호 리스트 가져오기
  const passwordList = JSON.parse(localStorage.getItem("passwordList")) || [];

  // 테이블에 비밀번호 리스트 렌더링
  function renderPasswordList() {
    passwordListTable.innerHTML = ""; // 기존 리스트 초기화

    if (passwordList.length === 0) {
      // 리스트가 비어 있을 경우 메시지 표시
      const emptyRow = document.createElement("tr");
      const emptyCell = document.createElement("td");
      emptyCell.colSpan = 4; // 테이블 열 수에 맞추기
      emptyCell.textContent = "표가 비어 있습니다. 비밀번호를 추가해주세요.";
      emptyCell.style.textAlign = "center"; // 중앙 정렬
      emptyRow.appendChild(emptyCell);
      passwordListTable.appendChild(emptyRow);
      return;
    }

    passwordList.forEach((passwordData, index) => {
      const row = document.createElement("tr");
      row.className = "password-row";

      // 생성 날짜 셀
      const dateCell = document.createElement("td");
      dateCell.textContent = passwordData.date;

      // 비밀번호 셀 (숨김 처리 + 보기 버튼 추가)
      const passwordCell = document.createElement("td");
      const passwordSpan = document.createElement("span");
      passwordSpan.textContent = "●●●●●●●"; // 기본적으로 숨김 표시
      passwordSpan.className = "hidden-password";

      const toggleButton = document.createElement("button");
      toggleButton.textContent = "보기";
      toggleButton.className = "btn-toggle";
      toggleButton.addEventListener("click", () => {
        if (passwordSpan.textContent === "●●●●●●●") {
          passwordSpan.textContent = passwordData.password; // 비밀번호 표시
          toggleButton.textContent = "숨기기";
        } else {
          passwordSpan.textContent = "●●●●●●●"; // 비밀번호 숨김
          toggleButton.textContent = "보기";
        }
      });

      passwordCell.appendChild(passwordSpan);
      passwordCell.appendChild(toggleButton);

      // 사용처 셀
      const usageCell = document.createElement("td");
      const usageInput = document.createElement("input");
      usageInput.type = "text";
      usageInput.value = passwordData.usage;
      usageInput.className = "usage-input";
      usageInput.addEventListener("change", () => {
        // 사용처 변경 시 로컬 스토리지 업데이트
        passwordList[index].usage = usageInput.value;
        localStorage.setItem("passwordList", JSON.stringify(passwordList));
        alert("사용처가 수정되었습니다.");
      });
      usageCell.appendChild(usageInput);

      // 삭제 버튼
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "삭제";
      deleteButton.className = "btn-delete";
      deleteButton.addEventListener("click", () => {
        if (confirm("이 비밀번호를 삭제하시겠습니까?")) {
          passwordList.splice(index, 1); // 리스트에서 삭제
          localStorage.setItem("passwordList", JSON.stringify(passwordList)); // 로컬 스토리지 업데이트
          renderPasswordList(); // 테이블 다시 렌더링
        }
      });

      // 행에 셀 추가
      row.appendChild(dateCell);
      row.appendChild(passwordCell);
      row.appendChild(usageCell);
      const deleteCell = document.createElement("td");
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      // 테이블에 행 추가
      passwordListTable.appendChild(row);
    });
  }

  // 홈으로 가기 버튼 추가
  function renderHomeButton() {
    const homeButton = document.createElement("button");
    homeButton.textContent = "홈으로 가기";
    homeButton.className = "btn-home";
    homeButton.addEventListener("click", () => {
      window.location.href = "index.html"; // 비밀번호 생성 페이지로 이동
    });
    homeButtonContainer.appendChild(homeButton);
  }

  // 파일로 추출하기 버튼 추가
  function renderTxtExtractButton() {
    const txtButton = document.createElement("button");
    txtButton.textContent = "파일로 추출하기";
    txtButton.className = "btn-txt";
    txtButton.addEventListener("click", downloadPasswordList);
    txtButtonContainer.appendChild(txtButton);
  }

  function downloadPasswordList() {
    // 로컬 스토리지에서 비밀번호 리스트 가져오기
    const passwordList = JSON.parse(localStorage.getItem("passwordList")) || [];

    if (passwordList.length === 0) {
      alert("비밀번호 리스트가 비어 있습니다.");
      return;
    }

    // 텍스트 데이터 생성
    let fileContent = "생성 날짜\t비밀번호\t사용처\n"; // 헤더 추가
    passwordList.forEach((item) => {
      fileContent += `${item.date}\t${item.password}\t${item.usage}\n`;
    });

    // Blob 객체 생성
    const blob = new Blob([fileContent], { type: "text/plain" });

    // 다운로드 링크 생성
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "passwordList.txt";
    document.body.appendChild(link); // 링크 추가
    link.click(); // 링크 클릭
    document.body.removeChild(link); // 링크 제거
  }

  renderPasswordList(); // 초기 렌더링
  renderHomeButton(); // 홈 버튼 렌더링
  renderTxtExtractButton(); // 파일로 추출하기 버튼 렌더링
});
