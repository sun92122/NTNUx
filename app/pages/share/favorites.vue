<template>
  <div class="page-container w-full">
    <h1 class="text-2xl font-bold text-center my-6 grid">
      {{ title || "分享的收藏課程" }}
      <span v-if="a" class="text-sm text-dimmed mx-auto">作者：{{ a }}</span>
    </h1>
    <CourseFavoritesControl
      :favoriteCourses="sharedFavoriteCourses"
      :shared="true"
    />

    <ClientOnly>
      <CourseFavoritesTable
        :favoriteCourses="sharedFavoriteCourses"
        :shared="true"
      />

      <template #fallback>
        <UProgress size="xl" color="neutral" class="max-w-md mt-4 mx-auto" />
      </template>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { prefetchDefaultTermData } from "@/composables/useCourseTable";
import { loadFavoriteCourses } from "@/composables/useFavorites";

const { cs, title, a } = useRoute().query;
const sharedFavoriteCourses = computed(() => {
  if (!cs || typeof cs !== "string") return [];
  return cs.split(",").map((code) => code.trim());
});

const pageTitle = title ? `收藏課程（${title}）` : "我的收藏課程";
useHead({
  title: pageTitle,
});
useSeoMeta({
  title: pageTitle,
  appleMobileWebAppTitle: pageTitle,
  ogTitle: pageTitle,
  twitterTitle: pageTitle,
  ogUrl: "https://ntnux.org/user/favorites",
});

onMounted(() => {
  prefetchDefaultTermData(false);
  loadFavoriteCourses();
});
</script>
