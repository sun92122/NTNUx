<!-- 使用者課表，使用 Cookie 儲存課程資料  -->

<template>
  <!-- controls -->
  <CourseTimetableControl />

  <!-- for testing -->
  <!-- <ClientOnly>
    <div class="max-w-3xl mx-auto">{{ currentTimetable }}</div>
  </ClientOnly>
  <UButton
    @click="clearTimetable(currentTerm)"
    color="error"
    variant="outline"
    class="mx-auto block"
  >
    Clear Timetable
  </UButton> -->

  <!-- timetable -->
  <ClientOnly>
    <CourseTimetable :timetable="currentTimetable" :settings="settings" />

    <template #fallback>
      <UProgress size="xl" color="neutral" class="max-w-md mx-auto" />
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { TimetableSettings, Timetable } from "@/composables/useTimetable";
import {
  allTimetable,
  timetableSettings,
  clearTimetable,
} from "@/composables/useTimetable";

const config = useRuntimeConfig();
const defaultTerm = useState<string>(
  "defaultTerm",
  () => (config.public.ntnuxDefaultTerm as string) || "",
);
const currentTerm = useState<string>("currentTerm", () => defaultTerm.value);

const currentTimetable = computed<Timetable>(() => {
  const term = currentTerm.value;
  if (!term) {
    return {} as Timetable;
  }
  if (!allTimetable.value[term]) {
    getTimetable(term);
  }
  return allTimetable.value[term] || ({} as Timetable);
});
const settings = computed<TimetableSettings>(() => {
  return timetableSettings.value || {};
});
</script>
