const daysElement = document.getElementById("calendarDays");
const fullDate1Element = document.getElementById("fullDate1");
const fullDate2Element = document.getElementById("fullDate2");
const japaneseMonths = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
const japaneseDays = ["月", "火", "水", "木", "金", "土", "日"];
const previousMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
let currentDate1 = new Date();
const clockElementLeft = document.getElementById("clock-left");
const clockElementRight = document.getElementById("clock-right");
const fixedYear = currentDate1.getFullYear();
const fixedMonth = currentDate1.getMonth();
const fixedDay = currentDate1.getDate();
const fixedJapaneseDay = japaneseDays[(currentDate1.getDay() + 6) % 7];

fullDate2Element.textContent =
  `日付: ${fixedYear}年${fixedMonth + 1}月${fixedDay}日 (${fixedJapaneseDay})`;

// Lista de eventos. Para añadir uno nuevo, agrega otra línea con start/end (YYYY-MM-DD) y name.
const events = [
  { start: "2026-08-07", end: "2026-08-09", name: "Festival Sierra Sonora" }
];

function generateCalendar(year, month, day) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date().getDate();
  fullDate1Element.textContent = `${year}年${month + 1}月`;
  document.getElementById("japanese-month").textContent = japaneseMonths[month];
  daysElement.innerHTML = "";
  const firstDayOfWeek = (firstDay + 6) % 7; // 0 = lunes

  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("day");
    daysElement.appendChild(emptyDay);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    const dayNumber = document.createElement("div");
    dayNumber.textContent = d;
    dayElement.appendChild(dayNumber);
    if (d === today && month === fixedMonth) {
      dayElement.classList.add("highlight");
    }

    const currentDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isEventDay = events.some(ev => currentDateStr >= ev.start && currentDateStr <= ev.end);
    if (isEventDay) {
      dayElement.classList.add("event");
    }

    daysElement.appendChild(dayElement);
  }

  const dayOfWeekElements = document.querySelectorAll(".day-of-week");
  dayOfWeekElements.forEach(el => el.classList.remove("highlight2"));
  if (month === fixedMonth) {
    const dow = new Date(year, month, day).getDay();
    const indexMonFirst = (dow + 6) % 7;
    dayOfWeekElements[indexMonFirst].classList.add("highlight2");
  }

  renderEventBanners(year, month, firstDayOfWeek);
}

// Crea un "cartel" que cruza las columnas del evento en su fila correspondiente
function renderEventBanners(year, month, firstDayOfWeek) {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  events.forEach(ev => {
    const evStart = new Date(ev.start + "T00:00:00");
    const evEnd = new Date(ev.end + "T00:00:00");
    const rangeStart = evStart < monthStart ? monthStart : evStart;
    const rangeEnd = evEnd > monthEnd ? monthEnd : evEnd;
    if (rangeStart > rangeEnd) return;

    let segStartIndex = null;
    let prevIndex = null;

    const flush = (startIdx, endIdx) => {
      const row = Math.floor(startIdx / 7);
      const colStart = startIdx % 7;
      const colEnd = endIdx % 7;
      const banner = document.createElement("div");
      banner.classList.add("event-banner");
      banner.textContent = ev.name;
      banner.style.gridRow = row + 1;
      banner.style.gridColumn = `${colStart + 1} / ${colEnd + 2}`;
      daysElement.appendChild(banner);
    };

    for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
      const index = firstDayOfWeek + d.getDate() - 1;
      if (segStartIndex === null) {
        segStartIndex = index;
      } else if (index !== prevIndex + 1 || Math.floor(index / 7) !== Math.floor(segStartIndex / 7)) {
        flush(segStartIndex, prevIndex);
        segStartIndex = index;
      }
      prevIndex = index;
    }
    if (segStartIndex !== null) flush(segStartIndex, prevIndex);
  });
}

function navigatePreviousMonth() {
  currentDate1 = new Date(currentDate1.getFullYear(), currentDate1.getMonth() - 1, 1);
  generateCalendar(currentDate1.getFullYear(), currentDate1.getMonth(), 1);
}
function navigateNextMonth() {
  currentDate1 = new Date(currentDate1.getFullYear(), currentDate1.getMonth() + 1, 1);
  generateCalendar(currentDate1.getFullYear(), currentDate1.getMonth(), 1);
}
previousMonthButton.addEventListener("click", navigatePreviousMonth);
nextMonthButton.addEventListener("click", navigateNextMonth);
generateCalendar(currentDate1.getFullYear(), currentDate1.getMonth(), currentDate1.getDate());

function updateClocks() {
  const now = new Date();
  clockElementLeft.textContent =
    `here: ${now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`;
  clockElementRight.textContent =
    `jst: ${now.toLocaleTimeString("en-US", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`;
}
updateClocks();
setInterval(updateClocks, 1000);
