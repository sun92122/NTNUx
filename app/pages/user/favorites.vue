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

const title = "我的收藏課程";
useHead({
  title: title,
});
useSeoMeta({
  title: title,
  appleMobileWebAppTitle: title,
  ogTitle: title,
  twitterTitle: title,
  ogUrl: "https://ntnux.org/user/favorites",
});

onMounted(() => {
  prefetchDefaultTermData(false);
  loadFavoriteCourses();
});
</script>
