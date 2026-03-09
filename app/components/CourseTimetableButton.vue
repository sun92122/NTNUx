<template>
  <UButton
    :label="isAdded ? '已加入' : '加入'"
    size="lg"
    :color="isAdded ? 'primary' : 'neutral'"
    :variant="isAdded ? 'solid' : 'soft'"
    class="w-14 items-center justify-center px-0 cursor-pointer"
    @click="toggleCourse"
  ></UButton>
</template>

<script lang="ts" setup>
// props: course: Course, isAdded: boolean
import type { Course } from "@/composables/useCourseTable";
import { toggleCourseInTimetable } from "@/composables/useTimetable";
import {
  addToTimetableToast,
  removeFromTimetableToast,
} from "@/composables/useTools";

const { yt, course, isAdded } = defineProps<{
  yt: string;
  course: Course | undefined;
  isAdded: boolean;
}>();
const emit = defineEmits<{
  change: [boolean];
}>();
const courseKey = computed(() => {
  return course?.id || `${course?.course_code}-${course?.course_group}`;
});

function toggleCourse() {
  toggleCourseInTimetable(yt, course as Course);
  if (isCourseInTimetable(yt, course as Course)) {
    addToTimetableToast(course?.name as string, courseKey.value);
    emit("change", true);
  } else {
    removeFromTimetableToast(course?.name as string, courseKey.value);
    emit("change", false);
  }
}
</script>
