<template>
  <div class="course-row">
    <div class="course-cell course-code">
      <span> {{ course.serial_no }}</span>
      <span>{{ course.course_code }}</span>
    </div>
    <div class="course-cell course-title">
      <span class="course-name">
        <a
          :href="`https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/SyllabusCtrl?year=${course.acadm_year}&term=${course.acadm_term}&courseCode=${course.course_code}&courseGroup=${course.course_group}&deptCode=${course.dept_code}&formS=${course.form_s}&classes1=${course.classes}&deptGroup=${course.dept_group_name}`"
          target="_blank"
          >{{ course.course_name }}</a
        >
      </span>
      <div class="message-group">
        <Message
          icon="pi pi-building"
          severity="secondary"
          class="custom-message"
          >{{ course.dept_chiabbr }}</Message
        >
        <Message
          icon="pi pi-user"
          severity="secondary"
          class="custom-message"
          >{{ course.teacher }}</Message
        >
        <Message
          icon="pi pi-clock"
          severity="secondary"
          class="custom-message"
          v-if="course.time"
          >{{ course.time }}</Message
        >
        <Message
          icon="pi pi-map-marker"
          severity="secondary"
          class="custom-message"
          v-if="course.location"
          >{{ course.location }}</Message
        >
      </div>
    </div>
    <div class="course-cell">
      <div class="message-group">
        <Message icon="pi pi-tag" severity="secondary" class="custom-message">{{
          optionMap[course.option_code] || course.option_code
        }}</Message>
        <Message
          v-if="course.generalCore"
          v-for="item in course.generalCore.split('/')"
          :key="item"
          icon="pi pi-tag"
          severity="secondary"
          class="custom-message"
          >{{ generalCoreMap[item] || item }}</Message
        >
        <Message icon="pi pi-book" severity="secondary" class="custom-message"
          >{{ Math.floor(course.credit) }} 學分</Message
        >
        <Message
          icon="pi pi-users"
          severity="secondary"
          class="custom-message"
          >{{ `${course.limit_count_h} 人` }}</Message
        >
        <Message
          v-if="course.eng_teach === '是'"
          severity="error"
          class="custom-message"
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
import Message from "primevue/message";

defineProps({
  course: {
    type: Object,
    required: true,
  },
});

const optionMap = {
  必: "必修",
  選: "選修",
  通: "通識",
};
const generalCoreMap = {
  A1UG: "人文藝術",
  A2UG: "社會科學",
  A3UG: "自然科學",
  A4UG: "邏輯運算",
  B1UG: "學院共同課程",
  B2UG: "跨域專業探索課程",
  B3UG: "大學入門",
  C1UG: "專題探究",
  C2UG: "MOOCs",
};
</script>

<style lang="scss">
.course-row {
  display: grid;
  grid-template-columns: 90px 6fr 6fr 7fr auto;
  align-items: center;
  padding: 0.5rem 0;
  gap: 0.5rem;

  a {
    color: var(--ag-header-foreground-color);
  }
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

  .course-title {
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
