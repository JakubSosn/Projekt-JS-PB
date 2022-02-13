const height = document.querySelector('.height');
const weight = document.querySelector('.weight');
const btn = document.querySelector('.button');
const ul = document.querySelector('ul');
const clearBtn = document.querySelector('div.right input');
const yourHeight = document.querySelector('.middle p:nth-child(2)');
const yourWeight = document.querySelector('.middle p:nth-child(3)');
const bmiCount = document.querySelector('.middle p:nth-child(4)');

let historyCount = 1;
let historyIndex = 0;
let allAverageBmi = 0;
let history = (JSON.parse(sessionStorage.getItem('history')) === null) ? [] : JSON.parse(sessionStorage.getItem('history'));

function countBmi(e) {
    e.preventDefault();
    let givenWeight = weight.value;
    let givenHeight = height.value;
    if ( givenHeight === '' || givenWeight === '') {
        return alert('Uzupełnij wymagane pola.')
    }
    if (givenWeight < 40 || givenWeight > 200) {
        return alert('Podana waga jest nieprawidłowo, wprowadź poprawną wagę.')
    }
    if (givenHeight < 120 || givenHeight > 240) {
        return alert('Podany wzrost jest nieprawidłowy, wprowadź poprawną wagę.')
    }
    let bmi = parseFloat(givenWeight / ((givenHeight / 100) * (givenHeight / 100))).toFixed(2);
    yourHeight.textContent = `Twój wzrost to ${givenHeight} cm`;
    yourWeight.textContent = `Twója waga to ${givenWeight} kg`;
    bmiCount.textContent = `Wyliczone BMI: ${bmi}`;
    const registration = document.createElement('div');
    registration.className = 'shownHistory';
    registration.dataset.key = historyIndex +=1;
    let time = clock()
    registration.innerHTML = `Pomiar: ${historyCount} z ${time}`;
    history.push({Pomiar: historyCount, Czas: time, Wzrost: givenHeight, Waga: givenWeight, WynikBMI: bmi, });
    historyCount++;
    ul.appendChild(registration);
    bmiComparison();
    averageBmi();
    historyStorage();
    document.querySelector('.right p').textContent = `Średnie BMI: ${allAverageBmi.toFixed(2)}`;
    clearBtn.setAttribute('type', 'submit');
    weight.value = '';
    height.value = '';
}

function clock () {
    const time = new Date();

    const seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    const hours= time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const days = time.getUTCDate() < 10 ? '0' + time.getUTCDate() : time.getUTCDate();
    const month = (time.getMonth()+1) < 10 ? '0' + (time.getMonth()+1) : (time.getMonth()+1);
    const year = time.getFullYear()

    return `${days}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

function showHistory(e) {
    let index = e.target.dataset.key;
    yourHeight.textContent = `Twój wzrost to ${history[index].Wzrost} cm`; 
    yourWeight.textContent = `Twója waga to ${history[index].Waga} kg`; 
    bmiCount.textContent = `Wyliczone BMI ${history[index].WynikBMI}`; 
  }

const bmiComparison = () => {
    let yourBmi = document.querySelector('.middle p:nth-child(1)');
    if (history.length <= 1) {
        yourBmi.textContent = 'Historia BMI';
    } else {
        if (history[history.length-1].WynikBMI >= history[history.length-2].WynikBMI) {
            yourBmi.textContent = 'Twoje BMI wzrosło!';
        } else {
            yourBmi.textContent = 'Twoje BMI spadło!';
        }
    }
} 

const averageBmi = () => {
    allAverageBmi = 0;
    allAverage = 0;
    for (let i = 0; i < history.length; i++) {
        let mean = history[i];
        allAverage = parseFloat(allAverage) + parseFloat(mean.WynikBMI);
    }
    allAverageBmi = allAverage / history.length;
}

const historyStorage = () => {
    sessionStorage.setItem('history', JSON.stringify(history));
}

const getStorage = () => {
    if (history !== null) {
      for (let i = 0; i < history.length; i++) {
        const div = document.createElement("div");
        div.className = "shownHistory";
        div.dataset.key = historyIndex;
        historyIndex++;
        div.textContent = `Pomiar: ${history[i].Pomiar} z ${history[i].Czas}`;  
        ul.appendChild(div);
        clearBtn.setAttribute("type", "submit");
      }
      historyCount = history.length + 1;
      historyIndex = history.length - 1;
      document.querySelector('.middle p:nth-child(1)').textContent = 'Historia BMI';
      document.querySelector('.right p').textContent = '';
    }
};

getStorage();

const clearHistory = () => {
    history = [];
    sessionStorage.clear();
    location.reload();
}

btn.addEventListener('click', countBmi);
ul.addEventListener('click', showHistory);
clearBtn.addEventListener('click', clearHistory);



