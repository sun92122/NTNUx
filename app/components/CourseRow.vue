<template>
  <div
    :class="[
      last ? 'border-b-0' : 'border-b-2 border-gray-200',
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
    <span class="course-title order-2 col-span-2">
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
          course.time.join('/').match(/.* (0|1)([-/\n\r]|$)/)
            ? 'warning'
            : 'neutral'
        "
        variant="soft"
      >
        {{ course.time.join("/") }}
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
            ? optionMap[course.course_category] || course.course_category
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
        {{ generalCoreMap[item] || item }}
      </UBadge>
      <UBadge
        v-if="course?.credit_program"
        v-for="item in course.credit_program.split('/')"
        :key="item"
        icon="tabler:book"
        variant="soft"
        color="neutral"
      >
        {{ item }}
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
        <UButton label="加入" size="lg" color="neutral" variant="soft" />
      </div>
      <span v-if="course?.restriction" class="pt-1">
        {{
          course.restriction.replace(/<\/br>/g, "\n").replace(/(?<=.)◎/g, "\n◎")
        }}
      </span>
      <span v-if="course?.comment" class="pt-1">
        {{ course.comment.replace(/<\/br>/g, "\n") }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from "@/composables/useCourseTable";

defineProps({
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

const optionMap = <Record<string, string>>{
  必: "必修",
  選: "選修",
  通: "通識",
};
const generalCoreMap = <Record<string, string>>{
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

const densePopover = ref();
const denseData = useState("denseData", () => <Record<string, any>>{});
const toggle = (e: any) => {
  if (densePopover.value) {
    densePopover.value.toggle(e);
  }
};
</script>
