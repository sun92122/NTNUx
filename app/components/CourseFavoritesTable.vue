<template>
  <div class="sm:px-2">
    <UAccordion
      :items="favoriteAccordionItems"
      v-model="selectedFavorite"
      type="multiple"
      class="w-full max-w-3xl mx-auto"
      :ui="{
        item: 'mb-2 shadow-sm rounded-xl',
        header:
          'bg-gray-500/5 p-2 rounded-xl data-[state=open]:rounded-b-none',
        content: 'bg-gray-500/1 rounded-b-xl',
      }"
    >
      <template #body="{ item }">
        <CourseFavoritesRow
          v-for="course in item.courses"
          :key="`${course?.year}-${course?.term}-${course?.course_group}`"
          :course="course"
          class="even:bg-gray-500/5"
        />
      </template>
    </UAccordion>
  </div>
</template>

<script lang="ts" setup>
import { favoriteCourses } from "@/composables/useFavorites";

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
  return Object.entries(favoriteCourses.value).map(([course_code, name]) => {
    const courses = getCourseData(course_code);
    return {
      label: `${course_code}（${name}）`,
      courses: courses,
    };
  });
});
</script>
