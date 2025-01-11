// MJ

document.addEventListener("DOMContentLoaded", () => {
    const generateButton = document.getElementById("generateButton");
    const result = document.getElementById("result");

    let currentPassword = ""; // 최근 생성된 비밀번호 저장

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
            Swal.fire({
                icon: 'warning', // 경고 아이콘
                html: 'You need to select <br> at least two types of characters.',
                confirmButtonText: 'OK', // 버튼 텍스트
                width: '350px',
                customClass: {
                    popup: 'swal-popup',
                    title: 'swal-title',
                    text: 'swal-text',
                    confirmButton: 'btn',
                },
                buttonsStyling: false,
            });
            return;
        }

        // 옵션 2: 길이 옵션 하나만 선택 확인
        if (!lengthOption) {
            Swal.fire({
                icon: 'warning', // 경고 아이콘
                html: 'You need to select <br> at least one length option.',
                confirmButtonText: 'OK', // 버튼 텍스트
                height: '60px',
                width: '350px',
                customClass: {
                    popup: 'swal-popup',
                    title: 'swal-title',
                    text: 'swal-text',
                    confirmButton: 'btn',
                },
                buttonsStyling: false,
            });
            return;
        }

        // 비밀번호 생성
        const [minLength, maxLength] = lengthOption.value.split("-").map(Number);
        currentPassword = generatePassword(includeLetters, includeNumbers, includeSpecialChars, minLength, maxLength);

        result.innerHTML = `Generated Password: <strong>${currentPassword}</strong>`;
        result.className = "alert password-display";
        result.style.display = "block";

        // "목록에 추가하기" 버튼 생성
        createAddToListButton();
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
        let specialCharCount = 0;

        for (let i = 0; i < passwordLength; i++) {
            let char = "";

            // 첫 글자 조건: 문자 또는 숫자로 시작
            if (i === 0) {
                const firstPool = (includeLetters ? letters : "") + (includeNumbers ? numbers : "");
                char = firstPool.charAt(Math.floor(Math.random() * firstPool.length));
            } else {
                // 일반적인 문자 선택
                char = characterPool.charAt(Math.floor(Math.random() * characterPool.length));
            }

            // 연속 3개 같은 문자/숫자/특수문자 방지
            if (password.length >= 2 &&
                char === password[password.length - 1] &&
                char === password[password.length - 2]) {
                i--; // 연속 문자 발생 시 다시 뽑기
                continue;
            }

            // 특수문자 갯수 제한
            if (specialChars.includes(char)) {
                if (specialCharCount >= 5) {
                    i--; // 특수문자 초과 시 다시 뽑기
                    continue;
                }
                specialCharCount++;
            }

            password += char;
        }

        return password;
    }

    // "목록에 추가하기" 버튼 생성 함수
    function createAddToListButton() {
        // 기존 버튼이 있으면 중복 생성 방지
        if (document.getElementById("addToListButton")) return;

        const addToListButton = document.createElement("button");
        addToListButton.id = "addToListButton";
        addToListButton.textContent = "Add to List and Manage";
        addToListButton.className = "btn-fill";

        // 버튼 클릭 시 SweetAlert 사용
        addToListButton.addEventListener("click", () => {
            Swal.fire({
                title: 'Add Password to List',
                input: 'text',
                inputLabel: 'Enter the usage for this password:',
                inputPlaceholder: 'e.g., Email, Social Media',
                showCancelButton: true,
                confirmButtonText: 'Add to List',
                cancelButtonText: 'Cancel',
                customClass: {
                    popup: 'swal-popup',   // 팝업 스타일
                    title: 'swal-title',   // 제목 스타일
                    text: 'swal-text',      // 본문 텍스트 스타일
                    confirmButton: 'custom-confirm-btn', // 확인 버튼 스타일
                    cancelButton: 'custom-cancel-btn',  // 취소 버튼 스타일
                    input: 'custom-input-field', // 입력 필드 스타일
                },
                buttonsStyling: false,
                
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to provide a usage!';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const usage = result.value;
                    const date = new Date().toLocaleString(); // 현재 날짜 및 시간

                    // 비밀번호 및 추가 정보 저장
                    const passwordData = {
                        date: date,
                        password: currentPassword,
                        usage: usage,
                    };

                    // 로컬 스토리지에 저장
                    const passwordList = JSON.parse(localStorage.getItem("passwordList")) || [];
                    passwordList.push(passwordData);
                    localStorage.setItem("passwordList", JSON.stringify(passwordList));

                    Swal.fire({
                        icon: 'success',
                        title: 'Added Successfully!',
                        html: 'The password has been added <br> to the list.',
                        confirmButtonText: 'OK',
                        width: '350px',
                        customClass: {
                            popup: 'swal-popup',   // 팝업 스타일
                            title: 'swal-title',   // 제목 스타일
                            text: 'swal-text',      // 본문 텍스트 스타일
                            confirmButton: 'custom-confirm-btn',
                        },
                        buttonsStyling: false,
                    });
                    // "관리 페이지로 이동" 버튼 생성
                    createManagePageButton();
                }
            });
        });

        // 결과 아래에 버튼 추가
        result.after(addToListButton);
    }


    // "관리 페이지로 이동" 버튼 생성 함수
    function createManagePageButton() {
        // 기존 버튼이 있으면 중복 생성 방지
        if (document.getElementById("managePageButton")) return;

        const managePageButton = document.createElement("button");
        managePageButton.id = "managePageButton";
        managePageButton.textContent = "Go to Manage Page";
        managePageButton.className = "btn-fill";

        managePageButton.addEventListener("click", () => {
            window.location.href = "password-manage.html"; // 관리 페이지로 이동
        });

        const addToListButton = document.getElementById("addToListButton");
        addToListButton.after(managePageButton);
    }

});