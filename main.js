const btn = document.querySelector("#btn"); // иконка монеты
const hText = document.querySelector("#hText"); // баланс
const bustClick = document.querySelector("#bustClick"); // кнопка улучшения клика
const bustBusiness = document.querySelector("#bustBusiness"); // кнопка улучшения бизнеса
const income = document.querySelector("#income"); // индикатор дохода за клик
const income2 = document.querySelector("#income2"); // индикатор дохода с бизнеса

let money = 0; // сумма баланса
let bustClickCost = 50; // стоимость улучшения клика
let clickLevel = 0; // уровень клика
let bustBusinessCost = 100; // стоимость улучшения бизнеса
let businessLevel = 0; // уровень бизнеса
let timerId; // таймер дохода от бизнеса

// функция для сокращения чисел
const formatNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "млрд";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "млн";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "к";
  return num.toFixed(2);
};

// обновление дисплея
const updateDisplay = () => {
  hText.innerHTML = `Деньги: ${formatNumber(money)}₽`; // обновление суммы денег
  bustClick.style.opacity = money >= bustClickCost ? 1 : 0.5; // доступность покупки клика
  bustBusiness.style.opacity = money >= bustBusinessCost ? 1 : 0.5; // доступность покупки бизнеса
};

let bonusMultiplier = 1; // коэффициент увеличения доходов

// функция, которая активирует бонус
const activateBonus = () => {
  bonusMultiplier = 2; 
  setTimeout(() => bonusMultiplier = 1, 10000); // Бонус длится 10 секунд
};

const calculateIncomePerClick = () => bonusMultiplier * (1 + clickLevel * Math.pow(1.1, clickLevel)); // доход от клика
const calculateIncomePerSecond = () => bonusMultiplier * (businessLevel > 0 ? 0.5 * Math.pow(1.5, businessLevel) : 0); // доход от бизнеса

// сохраняет прогресс в localStorage
const saveProgress = () => {
  localStorage.setItem('money', money);
  localStorage.setItem('clickLevel', clickLevel);
  localStorage.setItem('bustClickCost', bustClickCost);
  localStorage.setItem('businessLevel', businessLevel);
  localStorage.setItem('bustBusinessCost', bustBusinessCost);
};

// загружает прогресс из localStorage
const loadProgress = () => {
  money = parseFloat(localStorage.getItem('money')) || 0;
  clickLevel = parseInt(localStorage.getItem('clickLevel')) || 0;
  bustClickCost = parseFloat(localStorage.getItem('bustClickCost')) || 50;
  businessLevel = parseInt(localStorage.getItem('businessLevel')) || 0;
  bustBusinessCost = parseFloat(localStorage.getItem('bustBusinessCost')) || 100;

  // Обновляем значения на экране после загрузки прогресса
  bustClick.innerHTML = `Повысить: ${formatNumber(bustClickCost)}₽`;
  income.innerHTML = `доход за клик: ${formatNumber(calculateIncomePerClick())}`;
  bustBusiness.innerHTML = `Улучшить: ${formatNumber(bustBusinessCost)}₽`;
  income2.innerHTML = `доход в секунду: ${formatNumber(calculateIncomePerSecond())}`;

  // Если бизнес-уровень больше 0, запускаем таймер дохода от бизнеса
  if (businessLevel > 0) {
    clearInterval(timerId);
    timerId = setInterval(timerBusiness, 100);
  }

  updateDisplay();
};

// увеличивает баланс за клик и обновляет данные на дисплее
btn.onclick = () => {
  money += calculateIncomePerClick(); 
  saveProgress(); // Сохраняем прогресс после клика
  updateDisplay();
};

// улучшение клика
bustClick.onclick = () => {
  if (money >= bustClickCost) {
    money -= bustClickCost; // плата за покупку
    clickLevel++; // повышение уровня клика
    bustClickCost = 50 * Math.pow(1.3, clickLevel); // Увеличиваем цену улучшения
    bustClick.innerHTML = `Повысить: ${formatNumber(bustClickCost)}₽`;
    income.innerHTML = `доход за клик: ${formatNumber(calculateIncomePerClick())}`;
    saveProgress(); // Сохраняем прогресс после улучшения клика
    updateDisplay();
  }
};

// доход от бизнеса
const timerBusiness = () => {
  money += calculateIncomePerSecond() / 10;
  saveProgress(); // Сохраняем прогресс после каждого дохода от бизнеса
  updateDisplay();
};

// улучшение бизнеса
bustBusiness.onclick = () => {
  if (money >= bustBusinessCost) {
    money -= bustBusinessCost; // оплата
    businessLevel++; // повышение уровня
    bustBusinessCost = 100 * Math.pow(1.5, businessLevel); // Увеличиваем цену улучшения
    bustBusiness.innerHTML = `Улучшить: ${formatNumber(bustBusinessCost)}₽`;
    income2.innerHTML = `доход в секунду: ${formatNumber(calculateIncomePerSecond())}`;
    
    clearInterval(timerId);
    timerId = setInterval(timerBusiness, 100);
    
    saveProgress(); // Сохраняем прогресс после улучшения бизнеса
    updateDisplay();
  }
};

// сброс прогресса
const resetProgress = () => {
  localStorage.removeItem('money');
  localStorage.removeItem('clickLevel');
  localStorage.removeItem('bustClickCost');
  localStorage.removeItem('businessLevel');
  localStorage.removeItem('bustBusinessCost');
  
  money = 0;
  clickLevel = 0;
  bustClickCost = 50;
  businessLevel = 0;
  bustBusinessCost = 100;
  
  clearInterval(timerId); // Останавливаем таймер, если он был запущен
  updateDisplay();
};

// загрузка прогресса при загрузке страницы
window.onload = loadProgress;
