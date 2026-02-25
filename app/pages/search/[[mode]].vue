<template>
  <div class="page-container w-full">
    <!-- search bar -->
    <CourseSearchBar />
    <!-- table -->
    <CourseTable />
  </div>
</template>

<script lang="ts" setup>
import { CourseTable, CourseSearchBar } from "#components";

const route = useRoute();
const router = useRouter();

const modeList = [
  // default
  "quick",
  // with dropdown filters
  "dept",
  "general",
  "program",
  // only advanced filters
  "pe",
  "nd",
  "interschool",
  "english3",
  "emi",
] as const;
const params = ref(route.params);
const mode = computed(() => {
  return params.value.mode as string;
});
// assert mode
if (!modeList.includes(mode.value as any)) {
  router.replace("/search/quick");
}
</script>
