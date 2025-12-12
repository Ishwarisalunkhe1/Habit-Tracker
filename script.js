const months = [
  { name: 'January', days: 31 },
  { name: 'February', days: 28 },
  { name: 'March', days: 31 },
  { name: 'April', days: 30 },
  { name: 'May', days: 31 },
  { name: 'June', days: 30 },
  { name: 'July', days: 31 },
  { name: 'August', days: 31 },
  { name: 'September', days: 30 },
  { name: 'October', days: 31 },
  { name: 'November', days: 30 },
  { name: 'December', days: 31 }
];

let currentYear = 2025;
let currentMonth = new Date().getMonth();

const circle = document.querySelector('.progress-ring__circle');
const text = document.querySelector('.circle-text');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

const grid = document.getElementById("grid");
const resetBtn = document.getElementById("resetBtn");
const monthYearDisplay = document.getElementById("monthYear");
const monthSidebar = document.getElementById("monthSidebar");


function initMonthSidebar() {
  monthSidebar.innerHTML = '';
  for(let y=2025; y<=2026; y++) {
    months.forEach((m, index) => {
      const div = document.createElement('div');
      div.classList.add('month-item');
      div.textContent = `${m.name} ${y}`;
      // Mark completed months
      const completedDays = JSON.parse(localStorage.getItem(`tracker_${y}_${index}`)) || [];
      if(completedDays.length === getDaysInMonth(y, index)) div.classList.add('completed');
      if(y===currentYear && index===currentMonth) div.classList.add('current');
      div.addEventListener('click', () => {
        currentYear = y;
        currentMonth = index;
        initMonth();
      });
      monthSidebar.appendChild(div);
    });
  }
}


function initMonth() {
  grid.innerHTML = '';
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  for(let i=1; i<=daysInMonth; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    day.textContent = i;
    grid.appendChild(day);
  }
  monthYearDisplay.textContent = `${months[currentMonth].name} ${currentYear}`;
  loadProgress();
  document.querySelectorAll(".day").forEach((day, index)=>{
    day.addEventListener("click", ()=>{
      day.classList.toggle("completed");
      saveProgress();
      initMonthSidebar();
    });
  });
  initMonthSidebar();
}


function getDaysInMonth(year, month) {
  if(month===1) return (year%4===0 && (year%100!==0 || year%400===0))?29:28;
  return months[month].days;
}


function saveProgress() {
  const days = document.querySelectorAll(".day");
  const completedDays = [];
  days.forEach((day,index)=>{ if(day.classList.contains("completed")) completedDays.push(index); });
  localStorage.setItem(`tracker_${currentYear}_${currentMonth}`, JSON.stringify(completedDays));
  updateCircle();
}

function loadProgress() {
  const days = document.querySelectorAll(".day");
  const completedDays = JSON.parse(localStorage.getItem(`tracker_${currentYear}_${currentMonth}`)) || [];
  days.forEach((day,index)=>{ if(completedDays.includes(index)) day.classList.add("completed"); });
  updateCircle();
}


function updateCircle() {
  const completedCount = document.querySelectorAll(".day.completed").length;
  const daysCount = document.querySelectorAll(".day").length;
  const percent = Math.round((completedCount/daysCount)*100);
  if(percent>=100) text.textContent = "COMPLETED";
  else text.textContent = `${percent}%`;
  const offset = circumference - (percent/100)*circumference;
  circle.style.strokeDashoffset = offset;
}

resetBtn.addEventListener("click", ()=>{
  document.querySelectorAll(".day").forEach(day=>day.classList.remove("completed"));
  saveProgress();
  initMonthSidebar();
});

document.getElementById("prevMonth").addEventListener("click", ()=>{
  if(currentMonth===0){ currentMonth=11; currentYear--; }
  else currentMonth--;
  initMonth();
});

document.getElementById("nextMonth").addEventListener("click", ()=>{
  if(currentMonth===11){ currentMonth=0; currentYear++; }
  else currentMonth++;
  initMonth();
});


initMonth();
