// Базовые наборы символов
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// DOM элементы
const passwordEl = document.getElementById('password');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');
const notification = document.getElementById('notification');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');

// Получаем все чекбоксы
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');

// Обновляем значение слайдера
function updateLengthValue() {
    lengthValue.textContent = lengthSlider.value;
}

// Проверяем, выбран ли хотя бы один тип символов
function isAnyCheckboxChecked() {
    return uppercaseCheckbox.checked || 
           lowercaseCheckbox.checked || 
           numbersCheckbox.checked || 
           symbolsCheckbox.checked;
}

// Обновляем состояние кнопки генерации и поля ввода
function updateUIState() {
    const isAnyChecked = isAnyCheckboxChecked();
    
    // Блокируем/разблокируем кнопку генерации
    generateBtn.disabled = !isAnyChecked;
    generateBtn.style.opacity = isAnyChecked ? '1' : '0.5';
    generateBtn.style.cursor = isAnyChecked ? 'pointer' : 'not-allowed';
    
    // Блокируем/разблокируем поле пароля
    passwordEl.disabled = !isAnyChecked;
    
    // Блокируем/разблокируем кнопку копирования
    copyBtn.disabled = !isAnyChecked || !passwordEl.value;
    copyBtn.style.opacity = (!isAnyChecked || !passwordEl.value) ? '0.5' : '1';
    copyBtn.style.cursor = (!isAnyChecked || !passwordEl.value) ? 'not-allowed' : 'pointer';
    
    // Обновляем текст в поле пароля
    if (!isAnyChecked) {
        passwordEl.value = '';
        passwordEl.placeholder = 'Выберите хотя бы один тип символов';
        updateStrengthIndicator('');
    } else {
        passwordEl.placeholder = 'Нажмите кнопку для генерации';
    }
}

// Обновленная функция генерации пароля с учетом настроек
function generatePassword() {
    let charset = '';
    
    // Собираем набор символов на основе настроек
    if (uppercaseCheckbox.checked) charset += uppercase;
    if (lowercaseCheckbox.checked) charset += lowercase;
    if (numbersCheckbox.checked) charset += numbers;
    if (symbolsCheckbox.checked) charset += symbols;
    
    // Проверяем, что выбран хотя бы один тип символов
    if (charset === '') {
        showNotification('Выберите хотя бы один тип символов!');
        return '';
    }
    
    // Получаем длину из слайдера
    const length = parseInt(lengthSlider.value);
    
    // Генерируем пароль
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
}

// Оценка надежности пароля
function evaluatePasswordStrength(password) {
    if (!password) return 0;
    
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

// Обновление индикатора надежности
function updateStrengthIndicator(password) {
    if (!password) {
        strengthFill.style.width = '0%';
        strengthFill.style.backgroundColor = '#ddd';
        strengthText.textContent = 'Надёжность: не задано';
        strengthText.style.color = '#666';
        return;
    }
    
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

// Показ уведомления
function showNotification(message) {
    notification.querySelector('span').textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Копирование в буфер обмена
function copyToClipboard(text) {
    if (!text || !isAnyCheckboxChecked()) return;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('Пароль скопирован!');
        })
        .catch(err => {
            console.error('Ошибка копирования: ', err);
            showNotification('Ошибка копирования');
        });
}

// Обновленная функция инициализации
function init() {
    // Инициализация слайдера
    updateLengthValue();
    
    // Инициализация состояния UI
    updateUIState();
    
    // Обработчик изменения слайдера
    lengthSlider.addEventListener('input', function() {
        updateLengthValue();
    });
    
    lengthSlider.addEventListener('change', function() {
        updateLengthValue();
        // Перегенерируем пароль с новой длиной, если есть выбранные типы
        if (isAnyCheckboxChecked()) {
            const newPassword = generatePassword();
            passwordEl.value = newPassword;
            updateStrengthIndicator(newPassword);
            updateUIState();
        }
    });
    
    // Обработчики для чекбоксов
    const checkboxes = [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox];
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateUIState();
            
            // Если хотя бы один чекбокс выбран - генерируем новый пароль
            if (isAnyCheckboxChecked()) {
                const newPassword = generatePassword();
                passwordEl.value = newPassword;
                updateStrengthIndicator(newPassword);
            }
        });
    });
    
    // Обработчик для кнопки генерации
    generateBtn.addEventListener('click', () => {
        if (!isAnyCheckboxChecked()) {
            showNotification('Выберите хотя бы один тип символов!');
            return;
        }
        
        const newPassword = generatePassword();
        passwordEl.value = newPassword;
        updateStrengthIndicator(newPassword);
        updateUIState();
    });
    
    // Обработчик для кнопки копирования
    copyBtn.addEventListener('click', () => {
        if (passwordEl.value && isAnyCheckboxChecked()) {
            copyToClipboard(passwordEl.value);
        }
    });
    
    // Клик по полю пароля тоже копирует
    passwordEl.addEventListener('click', function() {
        if (!this.value || !isAnyCheckboxChecked()) return;
        
        this.select();
        copyToClipboard(this.value);
    });
    
    // Генерация первого пароля при загрузке (если чекбоксы выбраны)
    if (isAnyCheckboxChecked()) {
        const initialPassword = generatePassword();
        passwordEl.value = initialPassword;
        updateStrengthIndicator(initialPassword);
    }
    
    updateUIState();
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);