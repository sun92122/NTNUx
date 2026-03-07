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
import { modeList } from "@/composables/useConstants";
import { getTimetable } from "@/composables/useTimetable";

const route = useRoute();
const router = useRouter();

const params = ref(route.params);
const mode = computed(() => {
  return params.value.mode as string;
});
// assert mode
if (!modeList.includes(mode.value as any)) {
  router.replace("/search/quick");
}

const defaultTerm = useState<string>(
  "defaultTerm",
  () => (useRuntimeConfig().public.ntnuxDefaultTerm as string) || "",
);
const currentTerm = useState<string>("currentTerm", () => defaultTerm.value);

onMounted(() => {
  // prefetch timetable data for current term
  getTimetable(currentTerm.value);
});
</script>
