const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

const passwordEl = document.getElementById('password');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');
const notification = document.getElementById('notification');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');

function updateLengthValue() {
    lengthValue.textContent = lengthSlider.value;
}

function generatePassword() {
    let charset = '';
    
    if (document.getElementById('uppercase').checked) {
        charset += uppercase;
    }
    if (document.getElementById('lowercase').checked) {
        charset += lowercase;
    }
    if (document.getElementById('numbers').checked) {
        charset += numbers;
    }
    if (document.getElementById('symbols').checked) {
        charset += symbols;
    }
    
    if (charset === '') {
        showNotification('Выберите хотя бы один тип символов!');
        charset = lowercase + uppercase + numbers; // fallback
    }
    
    const length = parseInt(lengthSlider.value);
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
}

function evaluatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    return score;
}

function updateStrengthIndicator(password) {
    const score = evaluatePasswordStrength(password);
    let width, color, text;
    
    if (score <= 2) {
        width = '30%'; color = '#e74c3c'; text = 'Слабый';
    } else if (score <= 4) {
        width = '60%'; color = '#f39c12'; text = 'Средний';
    } else {
        width = '100%'; color = '#27ae60'; text = 'Надёжный';
    }
    
    strengthFill.style.width = width;
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = `Надёжность: ${text}`;
    strengthText.style.color = color;
}

function showNotification(message) {
    notification.querySelector('span').textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('Пароль скопирован!');
        })
        .catch(err => {
            console.error('Ошибка копирования: ', err);
            showNotification('Ошибка копирования');
        });
}

function init() {
    updateLengthValue();
    
    lengthSlider.addEventListener('input', function() {
        updateLengthValue();
    });
    
    lengthSlider.addEventListener('change', function() {
        updateLengthValue();
        const newPassword = generatePassword();
        passwordEl.value = newPassword;
        updateStrengthIndicator(newPassword);
    });
    
    const initialPassword = generatePassword();
    passwordEl.value = initialPassword;
    updateStrengthIndicator(initialPassword);
    
    generateBtn.addEventListener('click', () => {
        const newPassword = generatePassword();
        passwordEl.value = newPassword;
        updateStrengthIndicator(newPassword);
    });
    
    copyBtn.addEventListener('click', () => {
        if (passwordEl.value) {
            copyToClipboard(passwordEl.value);
        }
    });
    
    const checkboxes = document.querySelectorAll('.setting-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const newPassword = generatePassword();
            passwordEl.value = newPassword;
            updateStrengthIndicator(newPassword);
        });
    });
    
    passwordEl.addEventListener('click', function() {
        this.select();
        if (this.value) {
            copyToClipboard(this.value);
        }
    });
}

document.addEventListener('DOMContentLoaded', init);