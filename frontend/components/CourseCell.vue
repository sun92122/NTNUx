<template>
  <div class="course-row">
    <div class="course-cell course-code">
      <span> {{ course.serial_no }}</span>
      <span>{{ course.course_code }}</span>
    </div>
    <div class="course-cell course-name">
      <span v-html="courseNameCellRenderer(course)"></span>
      <div class="message-group">
        <Message
          icon="pi pi-user"
          severity="secondary"
          class="custom-message"
          size="small"
          >{{ teacherNameFormatter(course.teacher) }}</Message
        >
        <Message
          icon="pi pi-clock"
          severity="secondary"
          class="custom-message"
          size="small"
          >{{ timeFormatter(course.time_loc) }}</Message
        >
        <Message
          icon="pi pi-map-marker"
          severity="secondary"
          class="custom-message"
          size="small"
          >{{ locationFormatter(course.time_loc) }}</Message
        >
      </div>
    </div>
    <div class="course-cell">
      <div class="message-group">
        <Message
          icon="pi pi-tag"
          severity="secondary"
          class="custom-message"
          size="small"
          >{{ optionMap[course.option_code] || course.option_code }}</Message
        >
        <Message
          icon="pi pi-book"
          severity="secondary"
          class="custom-message"
          size="small"
          >{{ Math.floor(course.credit) }} 學分</Message
        >
        <Message
          icon="pi pi-users"
          severity="secondary"
          class="custom-message"
          size="small"
          >{{ `限修人數 ${course.limit_count_h}` }}</Message
        >
        <Message
          v-if="course.eng_teach === '是'"
          severity="error"
          class="custom-message"
          size="small"
          >英文授課</Message
        >
      </div>
    </div>
    <div class="course-cell">
      <span v-if="course.restrict" class="course-comment">
        {{
          course.restrict.replace(/<\/br>/g, "\n").replace(/(?<=.)◎/g, "\n◎")
        }}
      </span>
      <span v-if="course.comment" class="course-comment">
        {{ course.comment.replace(/<\/br>/g, "\n") }}
      </span>
    </div>
  </div>
</template>

<script setup>
// "acadm_year": course["acadm_year"],
// "acadm_term": course["acadm_term"],
// "authorize_p": course["authorize_p"],
// "authorize_using": course["authorize_using"],
// "chn_name": course["chn_name"],
// "classes": course["classes"],
// "comment": course["comment"],
// "counter": course["counter"],
// "counter_exceptAuth": course["counter_exceptAuth"],
// "course_avg": course["course_avg"],
// "course_code": course["course_code"],
// "course_group": course["course_group"],
// "course_kind": course["course_kind"],
// "credit": course["credit"],
// "dept_chiabbr": course["dept_chiabbr"],
// "dept_code": course["dept_code"],
// "dept_group_name": course["dept_group_name"],
// "eng_name": course["eng_name"],
// "eng_teach": course["eng_teach"],
// "form_s": course["form_s"],
// "limit": course["limit"],
// "limit_count_h": course["limit_count_h"],
// "option_code": course["option_code"],
// "restrict": course["restrict"],
// "rt": course["rt"],
// "serial_no": course["serial_no"],
// "teacher": course["teacher"],
// "time_inf": course["time_inf"],
// "time_loc": time_location_format(course["time_inf"]),

import message from "primevue/message";
import Message from "primevue/message";

const optionMap = {
  必: "必修",
  選: "選修",
  通: "通識",
};

function courseNameCellRenderer(course) {
  const courseName = course.chn_name.replace(/<\/br>.*/g, "");
  const courseUrl = `https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/SyllabusCtrl?year=${course.acadm_year}&term=${course.acadm_term}&courseCode=${course.course_code}&courseGroup=${course.course_group}&deptCode=${course.dept_code}&formS=${course.form_s}&classes1=${course.classes}&deptGroup=${course.dept_group_name}`;
  return `<a href="${courseUrl}" target="_blank">${courseName}</a>`;
}

function teacherNameFormatter(teacher) {
  return teacher.replace("", "温");
}

// .time_loc => { '一 1-2': 'A', '二 3-4': 'B' }
function timeFormatter(time) {
  const timeLocation = [];
  for (const [key, _] of Object.entries(time)) {
    const [day, period] = key.split(" ");
    timeLocation.push(`${day} ${period}`);
  }
  return timeLocation.join("/");
}

function locationFormatter(location) {
  // all same => A, else => A/B/...
  const locations = [];
  for (const [_, value] of Object.entries(location)) {
    if (value !== "") {
      locations.push(value);
    }
  }
  const uniqueLocations = [...new Set(locations)];
  if (uniqueLocations.length === 1) {
    return uniqueLocations[0];
  }
  return locations.join("/");
}
</script>

<script>
export default {
  name: "CourseCell",
  beforeMount() {
    this.updateDisplay(this.params);
  },
  methods: {
    updateDisplay(params) {
      this.course = params.data;
    },
  },
};
</script>

<style lang="scss">
.course-row {
  display: grid;
  grid-template-columns: 90px 6fr 6fr 7fr auto;
  align-items: center;
  padding: 0.5rem 0;
  gap: 0.5rem;
}

.course-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

@media screen and (max-width: 768px) {
  .course-row {
    grid-template-columns: 1fr;
  }

  .course-cell {
    flex-direction: row;
    justify-content: flex-start;
  }

  .course-name {
    flex-direction: column;
  }
}

.course-name {
  font-size: medium;
}

.message-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.custom-message {
  --p-message-content-padding: 0.25rem 0.5rem;
  --p-message-text-font-size: smaller;
}

.p-message-icon {
  margin-top: 4px;
}
.red-message {
  --p-message-background: var(--p-tag-danger-background);
  --p-message-color: var(--p-tag-danger-color);
}
</style>
