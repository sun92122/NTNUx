<template>
  <div
    :class="[
      last ? 'border-b-0' : 'border-b-2 border-gray-200 dark:border-gray-700',
      'course-row relative px-4 py-3 w-full items-start',
      'grid gap-x-2 grid-cols-[56px_6fr_6fr_7fr] grid-rows-[auto_1fr] grid-flow-col',
      'max-md:flex max-md:flex-col max-md:items-start',
    ]"
  >
    <div
      class="course-code order-1 flex flex-col max-md:flex-row shrink-0 grow-0 md:row-span-2 md:h-full md:justify-center"
    >
      <span class="max-md:mr-4 text-sm"> {{ course?.id }}</span>
      <span class="text-sm">{{ course?.course_code }}</span>
    </div>
    <span class="course-title order-2 col-span-2 max-md:w-full max-md:pr-25">
      <ULink
        class="course-name text-lg text-primary dark:text-white font-bold"
        as="button"
        :to="{
          path:
            course?.year && course?.term && (course?.id || course?.course_code)
              ? '/courses/' +
                `${course.year}/${course.term}/${
                  course.id || course.course_code + '-' + course?.course_group
                }/${encodeURIComponent(course?.name)}`
              : '#',
        }"
      >
        {{ course?.name }}
      </ULink>
    </span>
    <div
      class="course-info order-3 badge-group flex flex-wrap gap-y-1 gap-x-2 pt-2"
    >
      <UBadge icon="tabler:building" variant="soft" color="neutral">
        {{ course?.department }}
      </UBadge>
      <UBadge icon="tabler:user" variant="soft" color="neutral">
        {{ course?.teacher }}
      </UBadge>
      <UBadge
        v-if="course?.time && !course?.intensive"
        icon="tabler:clock"
        :color="
          !course?.time?.length ||
          course.time.join('/').match(/.* (0|1)([-/\n\r]|$)/)
            ? 'warning'
            : 'neutral'
        "
        variant="soft"
      >
        {{ course.time.join("/") || "無資料" }}
      </UBadge>
      <UBadge
        v-if="course?.intensive"
        icon="tabler:clock"
        color="warning"
        variant="soft"
        class="cursor-pointer"
        @click="toggle($event)"
      >
        <div class="underline">密集課程</div>
      </UBadge>
      <UBadge
        icon="tabler:map-pin"
        color="neutral"
        variant="soft"
        v-if="course?.location"
      >
        {{ course?.location }}
      </UBadge>
    </div>
    <div
      class="course-info order-4 badge-group flex flex-wrap gap-y-1 gap-x-2 pt-2"
    >
      <UBadge variant="soft" color="neutral">
        {{ course?.credits }} 學分
      </UBadge>
      <UBadge variant="soft" color="neutral">
        {{
          course?.course_category
            ? optionMap[course.course_category as keyof typeof optionMap] ||
              course.course_category
            : ""
        }}
      </UBadge>
      <UBadge
        v-if="course?.general_education"
        v-for="item in course.general_education.split('/')"
        :key="item"
        icon="tabler:blocks"
        color="neutral"
        variant="soft"
      >
        {{ generalCoreMap[item as keyof typeof generalCoreMap] || item }}
      </UBadge>
      <UBadge
        icon="tabler:users"
        :color="course?.limit_enrollment || 0 > 0 ? 'neutral' : 'warning'"
        variant="soft"
      >
        {{
          course?.limit_enrollment ? `${course.limit_enrollment} 人` : "無資料"
        }}
      </UBadge>
      <UBadge
        v-if="course?.english_teaching"
        icon="tabler:language"
        color="error"
        variant="soft"
      >
        英文授課
      </UBadge>
      <UBadge
        v-if="course?.credit_program"
        v-for="item in course.credit_program.split('/')"
        :key="item"
        icon="tabler:book"
        variant="soft"
        color="neutral"
      >
        {{ programMap[item] || item }}
      </UBadge>
    </div>
    <div
      class="course-comment order-5 flex flex-col justify-center text-sm whitespace-pre-wrap row-span-2"
    >
      <div
        :class="[
          'course-button flex flex-row items-center justify-end gap-2',
          'max-md:absolute max-md:right-4 max-md:top-4',
        ]"
      >
        <UButton icon="tabler:heart" size="lg" color="neutral" variant="link" />
        <UButton
          :label="isAdded ? '已加入' : '加入'"
          size="lg"
          :color="isAdded ? 'primary' : 'neutral'"
          :variant="isAdded ? 'solid' : 'soft'"
          class="w-14 items-center justify-center px-0 cursor-pointer"
          @click="toggleCourse"
        ></UButton>
      </div>
      <span v-if="course?.restriction" class="pt-1 text-xs">
        {{
          course.restriction.replace(/<\/br>/g, "\n").replace(/(?<=.)◎/g, "\n◎")
        }}
      </span>
      <span v-if="course?.comment" class="pt-1 text-xs">
        {{ course.comment.replace(/<\/br>/g, "\n") }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from "@/composables/useCourseTable";
import { optionMap, generalCoreMap } from "@/composables/useConstants";
import { toggleCourseInTimetable } from "@/composables/useTimetable";
import {
  addToTimetableToast,
  removeFromTimetableToast,
} from "@/composables/useTools";

const config = useRuntimeConfig();

const props = defineProps({
  course: {
    type: Object as () => Course | undefined,
    required: true,
  },
  last: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const programs = useState("programDropdownItems");
const programMap = useState<Record<string, string>>("programMap", () => {
  const map: Record<string, string> = {};
  for (const program of programs.value as Array<{
    value: string;
    label: string;
  }>) {
    if (program.value && program.label) {
      map[program.value] = program.label;
    }
  }
  return map;
});

const densePopover = ref();
const denseData = useState("denseData", () => <Record<string, any>>{});
const toggle = (e: any) => {
  if (densePopover.value) {
    densePopover.value.toggle(e);
  }
};

const yt = computed(() => `${props.course?.year}-${props.course?.term}`);
const courseKey = computed(() => {
  return (
    props.course?.id ||
    `${props.course?.course_code}-${props.course?.course_group}`
  );
});
const isAdded = ref(
  props.course ? isCourseInTimetable(yt.value, props.course as Course) : false,
);

function toggleCourse() {
  toggleCourseInTimetable(yt.value, props.course as Course);
  if (isCourseInTimetable(yt.value, props.course as Course)) {
    isAdded.value = true;
    addToTimetableToast(props.course?.name as string, courseKey.value);
  } else {
    isAdded.value = false;
    removeFromTimetableToast(props.course?.name as string, courseKey.value);
  }
}

onMounted(() => {
  isAdded.value = props.course
    ? isCourseInTimetable(yt.value, props.course as Course)
    : false;
});
</script>
