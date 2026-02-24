<template>
  <div class="search-bar-container w-full flex flex-col justify-center">
    <div
      class="breadcrumb-container max-w-full m-auto px-2 flex items-center gap-2 hide-scrollbar overflow-x-scroll"
    >
      <UButton
        v-for="(breadcrumb, index) in modeBreadcrumbs"
        :key="index"
        :to="breadcrumb.to"
        :label="
          breadcrumb?.active
            ? breadcrumb?.activeLabel || breadcrumb.label
            : breadcrumb.label
        "
        variant="link"
        :color="breadcrumb?.active ? 'info' : 'neutral'"
        size="xl"
        class="px-2 cursor-pointer"
      />
    </div>
    <div
      class="relative search-bar max-w-3xl w-2/3 max-md:w-full m-auto max-md:px-2 max-md:flex-col max-md:items-center"
    >
      <UFieldGroup
        class="flex items-center max-md:flex-col max-md:items-stretch"
        :class="searchInputContainerClass"
        label=""
        :orientation="windowWidth < 768 ? 'vertical' : 'horizontal'"
      >
        <UInput
          ref="input"
          name="globalFilterInput"
          v-model="globalFilterInput"
          color="neutral"
          variant="ghost"
          placeholder=""
          clearable
          :ui="searchInputUI"
          class="text-sm"
        >
          <label
            :class="[
              'pointer-events-none absolute left-8 top-3 text-xs text-info', // has text
              'peer-focus:top-3 peer-focus:text-xs peer-focus:text-info', // focus
              'peer-placeholder-shown:top-5.5 peer-placeholder-shown:object-left peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500', // placeholder
              'transition-all duration-200 ease-in-out',
            ]"
          >
            <span class="inline-flex">關鍵字搜尋</span>
          </label>
          <label
            :class="[
              'pointer-events-none absolute left-8 top-8 text-sm text-gray-500 collapse', // has text
              'peer-placeholder-shown:peer-focus:visible', // focus + placeholder
              'transition-all duration-50 ease-in-out',
            ]"
          >
            <span class="inline-flex">搜尋課程名稱、教師、課程號碼</span>
          </label>
        </UInput>

        <!-- Extra search -->
        <div v-if="mode && mode !== 'quick'"></div>
      </UFieldGroup>
      <!-- search button -->
      <div
        class="absolute right-0 top-0 h-full w-16 flex items-center justify-center pr-2.5 z-10"
      >
        <UButton
          color="info"
          icon="tabler:search"
          size="xl"
          class="rounded-full cursor-pointer"
          @click="updateGlobalFilter()"
        />
      </div>
    </div>
    <div
      class="advanced-search-control mt-4 flex items-center gap-4 max-md:flex-col max-md:items-start"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import {
  useCourseFilter,
  getGlobalFilterInput,
  updateGlobalFilterByInput,
} from "~/composables/useCourseFilter";

import type { BreadcrumbItem } from "@nuxt/ui";
import { breadcrumb } from "#build/ui";

const windowWidth = useState("windowWidth", () => window?.innerWidth || 1200);
const termList = useState<string[]>("termList", () =>
  process.env.NTNUX_TERMS ? process.env.NTNUX_TERMS.split(",") : [],
);

const route = useRoute();
const { globalFilter } = useCourseFilter();

const params = ref(route.params);
const mode = computed(() => {
  return params.value.mode as string;
});

const globalFilterInput = useState("globalFilterInput", () => "");
const globalFilterInputRef = useTemplateRef("input");

function updateGlobalFilter() {
  updateGlobalFilterByInput(globalFilterInput.value);
  if (!route.path.includes("/search")) {
    navigateTo("/search/quick");
  }
}

defineShortcuts({
  "/": {
    handler: () => {
      globalFilterInputRef.value?.inputRef?.focus();
    },
  },
  // if enter is pressed while the input is focused, trigger search
  enter: {
    usingInput: "globalFilterInput",
    handler: () => {
      updateGlobalFilter();
    },
  },
});

const searchInputUI = {
  root: "search-input w-full h-full text-base",
  base: "px-8 pb-3 pt-8 peer",
};
const searchInputContainerClass =
  "w-full h-16 rounded-full overflow-hidden shadow-xs shadow-gray-400";

interface modeBreadcrumb extends BreadcrumbItem {
  activeLabel?: string;
  do?: Function;
}
const modeBreadcrumbs = computed<modeBreadcrumb[]>(() => [
  {
    label: "快速",
    activeLabel: "快速搜尋",
    to: "/search/quick",
    active: mode.value === "quick",
  },
  {
    label: "系所",
    activeLabel: "系所課程",
    to: "/search/dept",
    active: mode.value === "dept",
  },
  {
    label: "通識",
    activeLabel: "通識課程",
    to: "/search/general",
    active: mode.value === "general",
  },
  {
    label: "體育",
    activeLabel: "普通體育",
    do: () => {
      // TODO: change filter to show only PE courses
    },
  },
  {
    label: "進階搜尋",
    do: () => {
      // TODO: implement advanced search page
    },
  },
  {
    label: "國防",
    activeLabel: "全民國防",
    do: () => {
      // TODO: change filter to show only national defense courses
    },
  },
  {
    label: "學分學程",
    to: "/search/program",
    active: mode.value === "program",
  },
  {
    label: "校際",
    activeLabel: "臺大系統課程",
    do: () => {
      // TODO: change filter to show only interschool courses
    },
  },
  {
    label: "英文三",
    do: () => {
      // TODO: change filter to show only English III courses
    },
  },
  {
    label: "英文授課",
    do: () => {
      // TODO: change filter to show only English-taught courses
    },
  },
]);

onMounted(() => {
  // if mode is not set, redirect to quick search
  globalFilterInput.value = getGlobalFilterInput();
});
</script>
