document.addEventListener("DOMContentLoaded", () => {
  const passwordListTable = document.getElementById("passwordList");
  const homeButtonContainer = document.getElementById("homeButtonContainer");
  const txtButtonContainer = document.getElementById("txtButtonContainer");

  // 로컬 스토리지에서 비밀번호 리스트 가져오기
  const passwordList = JSON.parse(localStorage.getItem("passwordList")) || [];

  // 테이블에 비밀번호 리스트 렌더링
  function renderPasswordList() {
    passwordListTable.innerHTML = ""; // 기존 리스트 초기화

    if (passwordList.length === 0) {
      const emptyRow = document.createElement("tr");
      const emptyCell = document.createElement("td");
      emptyCell.colSpan = 4; // 테이블 열 수에 맞추기
      emptyCell.textContent = "The table is empty. Please add a password.";
      emptyCell.style.textAlign = "center"; // 중앙 정렬
      emptyRow.appendChild(emptyCell);
      passwordListTable.appendChild(emptyRow);
      return;
    }

    passwordList.forEach((passwordData, index) => {
      const row = document.createElement("tr");

      // 생성 날짜 셀
      const dateCell = document.createElement("td");
      dateCell.textContent = passwordData.date;

      // 비밀번호 셀 (숨김 처리 + 보기 버튼 추가)
      const passwordCell = document.createElement("td");
      const passwordSpan = document.createElement("span");
      passwordSpan.textContent = "●●●●●●●"; // 기본적으로 숨김 표시
      passwordSpan.className = "hidden-password";

      const toggleIcon = document.createElement("img");
      toggleIcon.src = "/assets/img/eye-closed.png"; // 기본 눈 감은 아이콘
      toggleIcon.alt = "Toggle Password";
      toggleIcon.className = "toggle-icon";
      toggleIcon.style.cursor = "pointer";

      toggleIcon.addEventListener("click", () => {
        if (passwordSpan.textContent === "●●●●●●●") {
          passwordSpan.textContent = passwordData.password; // 비밀번호 표시
          toggleIcon.src = "/assets/img/eye-open.png"; // 눈 뜬 아이콘
        } else {
          passwordSpan.textContent = "●●●●●●●"; // 비밀번호 숨김
          toggleIcon.src = "/assets/img/eye-closed.png"; // 눈 감은 아이콘
        }
      });

      passwordCell.appendChild(passwordSpan);
      passwordCell.appendChild(toggleIcon);

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
        Swal.fire({
          icon: 'success',
          title: 'Usage updated successfully.',
          confirmButtonText: 'OK',
          width: '350px',
          customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            text: 'swal-text',
            confirmButton: 'custom-confirm-btn'
          },
          buttonsStyling: false
        });
      });
      usageCell.appendChild(usageInput);

      // 삭제 버튼
      const deleteButton = document.createElement("button");
      deleteButton.className = "btn-delete";
      const deleteImage = document.createElement("img");
      deleteImage.src = "/assets/img/delete.png"; // 이미지 경로
      deleteImage.alt = "Delete";
      deleteImage.style.width = "14px"; // 이미지 크기
      deleteImage.style.height = "14px"; // 이미지 크기
      deleteButton.appendChild(deleteImage);

      deleteButton.addEventListener("click", () => {
        Swal.fire({
          title: 'Password Delete',
          html: 'Are you sure you want to delete <br> this password?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'delete',
          cancelButtonText: 'cancel',
          width: '350px',
          customClass: {
            popup: 'swal-popup',
            title: 'swal-title',
            text: 'swal-text',
            confirmButton: 'custom-confirm-btn',
            cancelButton: 'custom-cancel-btn',
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.isConfirmed) {
            passwordList.splice(index, 1);
            localStorage.setItem("passwordList", JSON.stringify(passwordList));
            renderPasswordList();
            Swal.fire({
              icon: 'success',
              title: 'Deletion completed!',
              text: 'The password has been deleted.',
              width: '350px',
              confirmButtonText: 'OK',
              customClass: {
                popup: 'swal-popup',
                title: 'swal-title',
                text: 'swal-text',
                confirmButton: 'custom-confirm-btn',
              },
              buttonsStyling: false,
            });
          }
        });
      });

      const deleteCell = document.createElement("td");
      deleteCell.appendChild(deleteButton);

      // 행에 셀 추가
      row.appendChild(dateCell);
      row.appendChild(passwordCell);
      row.appendChild(usageCell);
      row.appendChild(deleteCell);

      // 테이블에 행 추가
      passwordListTable.appendChild(row);
    });
  }

  // 홈으로 가기 버튼 추가
  function renderHomeButton() {
    const homeButton = document.createElement("button");
    homeButton.textContent = "Go to Home Page";
    homeButton.className = "btn-fill";
    homeButton.addEventListener("click", () => {
      window.location.href = "index.html"; // 비밀번호 생성 페이지로 이동
    });
    homeButtonContainer.appendChild(homeButton);
  }

  // 파일로 추출하기 버튼 추가
  function renderTxtExtractButton() {
    const txtButton = document.createElement("button");
    txtButton.textContent = "Export to File";
    txtButton.className = "btn-fill";
    txtButton.addEventListener("click", downloadPasswordList);
    txtButtonContainer.appendChild(txtButton);
  }

  function downloadPasswordList() {
    if (passwordList.length === 0) {
      alert("The password list is empty.");
      return;
    }

    let fileContent = "Generation Date\tPassword\tUsage\n";
    passwordList.forEach((item) => {
      fileContent += `${item.date}\t${item.password}\t${item.usage}\n`;
    });

    const blob = new Blob([fileContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "passwordList.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  renderPasswordList();
  renderHomeButton();
  renderTxtExtractButton();
});
