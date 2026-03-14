<template>
  <div class="sm:px-2">
    <UAccordion
      ref="accordion"
      :items="favoriteAccordionItems"
      v-model="selectedFavorite"
      type="multiple"
      class="w-full max-w-3xl mx-auto"
      :ui="{
        item: 'mb-2 shadow-sm rounded-xl',
        header: 'bg-gray-500/5 p-2 rounded-xl data-[state=open]:rounded-b-none',
        content: 'bg-gray-500/1 rounded-b-xl',
        body: 'pb-0',
      }"
    >
      <template #body="{ item }">
        <CourseFavoritesRow
          v-for="course in item.courses"
          :key="`${course?.year}-${course?.term}-${course?.course_group}`"
          :course="course"
          class="even:bg-gray-500/5 last:pb-3.5"
        />
      </template>
    </UAccordion>
    <div
      v-if="favoriteAccordionItems.length === 0"
      class="text-center text-dimmed py-10"
    >
      沒有收藏的課程
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FavoriteCourses } from "@/composables/useFavorites";
import {
  useSortable,
  moveArrayElement,
} from "@vueuse/integrations/useSortable";

const { favoriteCourses, shared } = defineProps<{
  favoriteCourses: FavoriteCourses;
  shared?: boolean | undefined;
}>();

const dataAllTerms = useState<AllTermsData>("dataAllTerms", () => ({}));
const config = useRuntimeConfig();
const defaultTerm = useState<string>(
  "defaultTerm",
  () => (config.public.ntnuxDefaultTerm as string) || "",
);
const selectedTerm = useState<string[]>("selectedTerm", () => [
  defaultTerm.value,
]);

const selectedFavorite = useState<string[]>("selectedFavorite", () => []);

function getCourseData(course_code: string) {
  const courses = [];
  for (const term of selectedTerm.value) {
    const termData = dataAllTerms.value[term];
    if (!termData) continue;
    const matchedCourses = termData.filter(
      (course) => course.course_code === course_code,
    );
    courses.push(...matchedCourses);
  }
  return courses;
}

const favoriteAccordionItems = computed<any>(() => {
  return favoriteCourses.map((course_code) => {
    const courses = getCourseData(course_code);
    return {
      label: courses?.[0]?.name
        ? `${course_code}（${courses[0]?.name || "？"}）`
        : course_code,
      courses: courses,
    };
  });
});

const accordion = useTemplateRef<HTMLElement>("accordion");

if (!shared) {
  useSortable(accordion, favoriteCourses, {
    animation: 150,
    onStart: () => {
      // Prevent accordion from changing selected item when dragging
      selectedFavorite.value = [];
    },
    onUpdate: (e: any) => {
      moveArrayElement(favoriteCourses, e.oldIndex, e.newIndex, e);
      nextTick(() => {
        saveFavoriteCourses();
      });
    },
  } as any);
}
</script>
