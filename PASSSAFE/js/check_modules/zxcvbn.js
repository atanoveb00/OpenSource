// JM

export function checkPasswordStrength(password) {
    const result = zxcvbn(password); // zxcvbn 함수 호출
        return {
            score: result.score,
            strengthLevels: ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"],
            strengthColors: ["#F37878", "#F99A5F", "#FFEB56", "#B9E179", "#00AB59"],
            strengthWidths: ["20%", "40%", "60%", "80%", "100%"],
        };
    }
    