<template>
  <div v-if="show" class="overlay" @click="close">
    <div class="schedule-box" @click.stop>
      <div class="header">
        <span>課表</span>
        <button @click="close">✕ 關閉</button>
      </div>
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
              v-for="course in getCoursesAt(day, slot.label)"
              :key="course.serial_no"
              class="course-block"
              :style="{ backgroundColor: getCourseColor(course.serial_no) }"
            >
              {{ course.chn_name }}
              <button @click="openColorPicker(course.serial_no, $event)">
                🎨
              </button>
              <br />
              {{ course.teacher }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 顏色選擇器浮動視窗 -->
    <div
      v-if="colorPickerTarget"
      class="color-picker"
      :style="{
        top: colorPickerTarget.y + 'px',
        left: colorPickerTarget.x + 'px',
      }"
    >
      <input
        type="color"
        :value="getCourseColor(colorPickerTarget.serial_no)"
        @input="
          changeCourseColor(colorPickerTarget.serial_no, $event.target.value)
        "
        @change="colorPickerTarget = null"
      />
      <button @click="colorPickerTarget = null">關閉</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedRows: {
    type: Array,
    default: () => [],
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

function close() {
  colorPickerTarget.value = null; // 關閉顏色選擇器
  emit("close");
}

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

function parseTimeSlots(timeStr) {
  const result = [];
  const segments = timeStr.split(",");
  for (const seg of segments) {
    const match = seg.match(
      /([一二三四五])\s*(\d+|A|B|C|D)(?:-(\d+|A|B|C|D))?/
    );
    if (match) {
      const [_, day, start, end] = match;
      const range = getRange(start, end || start);
      for (const period of range) {
        result.push({ day, period });
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
  colorPickerTarget.value = {
    serial_no,
    x: rect.right + 10, // 調整偏移量
    y: rect.top,
  };
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.schedule-box {
  position: absolute;
  top: 10%;
  left: 10%;
  right: 10%;
  background: white;
  padding: 16px;
  border-radius: 8px;
  max-height: 80%;
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
