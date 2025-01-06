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
            alert("문자 유형은 최소 2개 이상 선택해야 합니다.");
            return;
        }

        // 옵션 2: 길이 옵션 하나만 선택 확인
        if (!lengthOption) {
            alert("길이 옵션을 하나 선택해야 합니다.");
            return;
        }

        // 비밀번호 생성
        const [minLength, maxLength] = lengthOption.value.split("-").map(Number);
        currentPassword = generatePassword(includeLetters, includeNumbers, includeSpecialChars, minLength, maxLength);

        result.textContent = `생성된 비밀번호: ${currentPassword}`;
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
        for (let i = 0; i < passwordLength; i++) {
            password += characterPool.charAt(Math.floor(Math.random() * characterPool.length));
        }

        return password;
    }

    // "목록에 추가하기" 버튼 생성 함수
    function createAddToListButton() {
        // 기존 버튼이 있으면 중복 생성 방지
        if (document.getElementById("addToListButton")) return;

        const addToListButton = document.createElement("button");
        addToListButton.id = "addToListButton";
        addToListButton.textContent = "목록에 추가하기";
        addToListButton.className = "btn";

        // 버튼 클릭 시 관리 페이지로 데이터 전달
        addToListButton.addEventListener("click", () => {
            const date = new Date().toLocaleString(); // 현재 날짜 및 시간
            const usage = prompt("사용처를 입력해주세요:", "예: 이메일"); // 사용처 입력 받기

            if (!usage) {
                alert("사용처를 입력해야 합니다.");
                return;
            }

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

            alert("목록에 추가되었습니다!");

            // "관리 페이지로 이동" 버튼 생성
            createManagePageButton();
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
        managePageButton.textContent = "관리하기 페이지로 이동";
        managePageButton.className = "btn";

        managePageButton.addEventListener("click", () => {
            window.location.href = "password-manage.html"; // 관리 페이지로 이동
        });

        const addToListButton = document.getElementById("addToListButton");
        addToListButton.after(managePageButton);
    }
});