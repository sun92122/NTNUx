<template>
  <div class="page-container w-full">
    <CourseFavoritesControl />

    <ClientOnly>
      <CourseFavoritesTable />

      <template #fallback>
        <UProgress size="xl" color="neutral" class="max-w-md mx-auto" />
      </template>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { prefetchDefaultTermData } from "@/composables/useCourseTable";
import { loadFavoriteCourses } from "@/composables/useFavorites";

onMounted(() => {
  prefetchDefaultTermData(false);
  loadFavoriteCourses();
});
</script>
