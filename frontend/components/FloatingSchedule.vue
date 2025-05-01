<template>
  <div class="schedule-box">
    <div class="timetable">
      <div class="row header-row">
        <div class="cell time-cell"></div>
        <div v-for="day in days" :key="day" class="cell">{{ day }}</div>
      </div>
      <div v-for="slot in slots" :key="slot.label" class="row">
        <div class="cell time-cell">
          {{ slot.label }}<br /><small>{{ slot.time }}</small>
        </div>
        <div v-for="day in days" :key="day" class="cell">
          <div
            v-for="course in CoursesByDay[day]?.[slot.label] || []"
            :key="course.serial_no"
            class="course-block"
            :style="{ backgroundColor: getCourseColor(course.serial_no) }"
          >
            {{ course.chn_name.replace(/<\/?br>/g, " ") }}
            <br />
            {{ course.teacher }}
            <br />
            {{ course.loc }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <SpeedDial
    :model="settingItems"
    direction="up"
    :style="{ position: 'absolute', right: '-2.5rem', bottom: '1.5rem' }"
    :buttonProps="{ severity: 'secondary', rounded: true }"
    :tooltipOptions="{ position: 'left' }"
  />
</template>

<script setup>
import ColorPicker from "primevue/colorpicker";
import SpeedDial from "primevue/speeddial";

const props = defineProps({
  selectedRows: {
    type: Array,
    default: () => [],
  },
});

const days = ["一", "二", "三", "四", "五"];
const slots = [
  { label: "0", time: "07:10 ~ 08:00" },
  { label: "1", time: "08:10 ~ 09:00" },
  { label: "2", time: "09:10 ~ 10:00" },
  { label: "3", time: "10:20 ~ 11:10" },
  { label: "4", time: "11:20 ~ 12:10" },
  { label: "5", time: "12:20 ~ 13:10" },
  { label: "6", time: "13:20 ~ 14:10" },
  { label: "7", time: "14:20 ~ 15:10" },
  { label: "8", time: "15:30 ~ 16:20" },
  { label: "9", time: "16:30 ~ 17:20" },
  { label: "10", time: "17:30 ~ 18:20" },
  { label: "A", time: "18:30 ~ 19:25" },
  { label: "B", time: "19:35 ~ 20:25" },
  { label: "C", time: "20:30 ~ 21:20" },
  { label: "D", time: "21:25 ~ 22:15" },
];

function parseTimeSlots(timeObj) {
  const result = [];
  if (typeof timeObj !== "object" || !timeObj) {
    return result;
  }

  for (const seg of Object.keys(timeObj)) {
    const match = seg.match(
      /([一二三四五])\s*(\d+|A|B|C|D)(?:-(\d+|A|B|C|D))?/
    );
    if (match) {
      const [_, day, start, end] = match;
      const range = getRange(start, end || start);
      for (const period of range) {
        result.push({ day, period, loc: timeObj[seg] });
      }
    }
  }
  return result;
}

function getRange(start, end) {
  const periodOrder = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "A",
    "B",
    "C",
    "D",
  ];
  const s = periodOrder.indexOf(start);
  const e = periodOrder.indexOf(end);
  return periodOrder.slice(s, e + 1);
}

function getCoursesAt(day, period) {
  return props.selectedRows.filter((course) => {
    const slots = parseTimeSlots(course.time || "");
    return slots.some((slot) => slot.day === day && slot.period === period);
  });
}

const CoursesByDay = ref({});
// { 一: { 0: [course at 一 0], 1: [course at 一 1] }, ...}
function groupCoursesByDay() {
  CoursesByDay.value = {};
  for (const course of props.selectedRows) {
    const slots = parseTimeSlots(course.time_loc || "");
    for (const slot of slots) {
      if (!CoursesByDay.value[slot.day]) {
        CoursesByDay.value[slot.day] = {};
      }
      if (!CoursesByDay.value[slot.day][slot.period]) {
        CoursesByDay.value[slot.day][slot.period] = [];
      }
      CoursesByDay.value[slot.day][slot.period].push({
        ...course,
        loc: slot.loc,
      });
    }
  }
}
groupCoursesByDay();

const colorMap = ref({});
function autoColor(serial_no) {
  const palette = [
    "#FFDD57",
    "#87CEEB",
    "#FF7F7F",
    "#90EE90",
    "#DDA0DD",
    "#FFA07A",
    "#00CED1",
    "#F4A460",
    "#B0E0E6",
    "#FFB6C1",
  ];
  const hash = Array.from(serial_no).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  return palette[hash % palette.length];
}

function getCourseColor(serial_no) {
  if (!(serial_no in colorMap.value)) {
    colorMap.value[serial_no] = autoColor(serial_no);
  }
  return colorMap.value[serial_no];
}

function changeCourseColor(serial_no, color) {
  colorMap.value[serial_no] = color;
}

const colorPickerTarget = ref(null); // 當前正在選擇顏色的 serial_no

function openColorPicker(serial_no, event) {
  const rect = event.target.getBoundingClientRect();
  const screenWidth = window.innerWidth;

  colorPickerTarget.value = {
    serial_no,
    x: rect.right + (rect.right > screenWidth * 0.6 ? -160 : 10), // 調整偏移量
    y: rect.top,
  };
}

const settingItems = ref([
  {
    label: "顏色",
    icon: "pi pi-palette",
    command: (event) => {
      // openColorPicker(event.serial_no, event);
    },
  },
]);
</script>

<style scoped>
.schedule-box {
  background: white;
  overflow-y: auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 8px;
}
.timetable {
  display: grid;
  grid-template-columns: 80px repeat(5, 1fr);
}
.row {
  display: contents;
}
.cell {
  border: 1px solid #ddd;
  min-height: 60px;
  padding: 2px;
  position: relative;
}
.time-cell {
  background: #f8f8f8;
  text-align: center;
  font-size: 12px;
}
.course-block {
  background: #e2f0ff;
  /* border-left: 4px solid #1e90ff; */
  font-size: 12px;
  padding: 2px;
  margin: 1px 0;
}
button {
  background: transparent;
  border: none;
  cursor: pointer;
}
.color-picker {
  position: fixed; /* 使用 fixed，避免被表格內容擋住 */
  background: white;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  text-align: center;
}
.color-picker input[type="color"] {
  margin: 10px 0;
}
.color-picker button {
  background: #ddd;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
