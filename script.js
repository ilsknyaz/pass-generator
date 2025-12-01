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

function generatePassword() {
    let allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    const length = 12;
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }
    
    return password;
}

function evaluatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 12) score += 2;
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
        width = '30%'; color = '#f44336'; text = 'Слабый';
    } else if (score <= 4) {
        width = '60%'; color = '#ffa726'; text = 'Средний';
    } else {
        width = '100%'; color = '#4CAF50'; text = 'Надёжный';
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
    
    passwordEl.addEventListener('click', function() {
        this.select();
        if (this.value) {
            copyToClipboard(this.value);
        }
    });
}

document.addEventListener('DOMContentLoaded', init);