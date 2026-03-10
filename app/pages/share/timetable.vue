<!-- 分享課表  -->
<!-- 
  /share/timetable
  query:
    - term: 課表所屬學期
    - courses: 課表資料，格式為 "courseKey:color,courseKey:color,..."
    - auth: 分享者名稱（選填）
    - settings: jsonLz 格式的課表設定（選填）
-->

<template>
  <h1 class="text-2xl font-bold text-center mb-6">
    {{ auth ? `${auth}的課表` : "分享的課表" }}
  </h1>
  <!-- timetable -->
  <ClientOnly>
    <CourseTimetable
      :timetable="timetable"
      :settings="settings"
      :shared="true"
    />

    <template #fallback>
      <UProgress size="xl" color="neutral" class="max-w-md mx-auto" />
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type {} from "@/composables/useTimetable";
import { defaultTimetableSettings } from "@/composables/useTimetable";
import { jsonLzDecode } from "@/composables/useTools";

const route = useRoute();
const { term, courses, auth } = route.query as {
  term?: string;
  courses?: string;
  auth?: string;
  settings?: string;
};

const title = auth ? `${auth}的課表` : "分享的課表";
useHead({
  title: title,
});
useSeoMeta({
  title: title,
  appleMobileWebAppTitle: title,
  ogTitle: title,
  twitterTitle: title,
  ogUrl: "https://ntnux.org/user/timetable",
});

const timetable = ref({});
const settings = ref<any>(defaultTimetableSettings);
try {
  const decodedSettings: any = jsonLzDecode(route.query.settings as string);
  settings.value = {
    ...defaultTimetableSettings,
    ...decodedSettings,
  };
} catch (error) {
  console.warn("無法解析課表設定，使用預設設定:", error);
}
const errorEntries = ref<string[]>([]);
onMounted(() => {
  // 預先載入課表資料
  importCourses(courses as string, term as string)
    .then(
      ({
        timetable: importedTimetable,
        errorEntries: importedErrorEntries,
      }) => {
        timetable.value = importedTimetable;
        errorEntries.value = importedErrorEntries;
      },
    )
    .catch((error) => {
      console.error("匯入課表失敗:", error);
    });
});
</script>
