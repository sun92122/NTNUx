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
</script>
