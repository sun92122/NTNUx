<template>
  <div class="search-bar-container w-full flex flex-col justify-center">
    <div
      class="breadcrumb-container max-w-full m-auto px-2 flex items-center gap-2 hide-scrollbar overflow-x-scroll"
    >
      <UButton
        v-for="(breadcrumb, index) in modeBreadcrumbs"
        :key="index"
        :label="
          breadcrumb?.active
            ? breadcrumb?.activeLabel || breadcrumb.label
            : breadcrumb.label
        "
        variant="link"
        :color="breadcrumb?.active ? 'primary' : 'neutral'"
        size="xl"
        class="px-2 cursor-pointer"
        @click="breadcrumb.do && breadcrumb.do()"
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
              'pointer-events-none absolute left-8 top-3 text-xs text-primary', // has text
              'peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary', // focus
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
          color="primary"
          icon="tabler:search"
          size="xl"
          class="rounded-full cursor-pointer"
          @click="updateGlobalFilter()"
        />
      </div>
    </div>
    <div
      class="advanced-search-control max-w-full min-w-2/3 m-auto px-2 flex items-center gap-2 hide-scrollbar overflow-x-scroll my-4"
    >
      <UDropdownMenu
        :items="dropdownTermOptions"
        :content="{
          align: 'start',
          side: 'bottom',
        }"
      >
        <UButton
          :label="currentTerm || '學期'"
          :color="currentTerm ? 'primary' : 'neutral'"
          variant="outline"
          size="lg"
          icon="tabler:calendar"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useCourseFilter,
  getGlobalFilterInput,
  updateGlobalFilterByInput,
  clearAndSetAllFilters,
} from "~/composables/useCourseFilter";
import { prefetchDefaultTermData } from "~/composables/useCourseTable";
import type { BreadcrumbItem } from "@nuxt/ui";

const windowWidth = useState("windowWidth", () => window?.innerWidth || 1200);
const config = useRuntimeConfig();
const termList = useState<string[]>("termList", () =>
  config.ntnuxTerms
    ? ((config.ntnuxTerms as String) || "")
        .split(",")
        .map((term: string) => term.trim())
    : [],
);
const defaultTerm = useState<string>(
  "defaultTerm",
  () => (config.ntnuxDefaultTerm as string) || "",
);
const currentTerm = useState<string>("currentTerm", () => defaultTerm.value);

const route = useRoute();
const router = useRouter();
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

// each year in termList is like "114", we need to convert it to "114-1", "114-2", "114-暑期", termList is like ["114", "113", "112"]
const dropdownTermOptions = computed(() =>
  termList.value.map((year) => {
    return {
      label: year,

      children: [
        {
          label: `${year}-1`,
          value: `${year}-1`,
          onSelect() {
            currentTerm.value = `${year}-1`;
          },
        },
        {
          label: `${year}-2`,
          value: `${year}-2`,
          onSelect() {
            currentTerm.value = `${year}-2`;
          },
        },
        {
          label: `${year}-暑期`,
          value: `${year}-3`,
          onSelect() {
            currentTerm.value = `${year}-3`;
          },
        },
      ],
    };
  }),
);

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
    active: mode.value === "quick",
    do: () => {
      if (mode.value !== "quick") {
        router.push("/search/quick");
      }
      clearAndSetAllFilters({});
    },
  },
  {
    label: "系所",
    activeLabel: "系所課程",
    active: mode.value === "dept",
    do: () => {
      if (mode.value !== "dept") {
        router.push("/search/dept");
      }
      clearAndSetAllFilters({});
    },
  },
  {
    label: "通識",
    activeLabel: "通識課程",
    active: mode.value === "general",
    do: () => {
      if (mode.value !== "general") {
        router.push("/search/general");
      }
      clearAndSetAllFilters({});
    },
  },
  {
    label: "體育",
    activeLabel: "普通體育",
    active: mode.value === "pe",
    do: () => {
      if (mode.value !== "pe") {
        router.push("/search/pe");
      }
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
    active: mode.value === "nd",
    do: () => {
      if (mode.value !== "nd") {
        router.push("/search/nd");
      }
      // TODO: change filter to show only national defense courses
    },
  },
  {
    label: "學分學程",
    active: mode.value === "program",
    do: () => {
      if (mode.value !== "program") {
        router.push("/search/program");
      }
      clearAndSetAllFilters({});
    },
  },
  {
    label: "校際",
    activeLabel: "臺大系統課程",
    active: mode.value === "interschool",
    do: () => {
      if (mode.value !== "interschool") {
        router.push("/search/interschool");
      }
      // TODO: change filter to show only interschool courses
    },
  },
  {
    label: "英文三",
    active: mode.value === "english3",
    do: () => {
      // TODO: change filter to show only English III courses
      if (mode.value !== "english3") {
        router.push("/search/english3");
      }
    },
  },
  {
    label: "英文授課",
    active: mode.value === "emi",
    do: () => {
      if (mode.value !== "emi") {
        router.push("/search/emi");
      }
      clearAndSetAllFilters({
        english_teaching: true,
      });
    },
  },
]);

onMounted(() => {
  // if mode is not set, redirect to quick search
  if (!globalFilterInput.value) {
    globalFilterInput.value = getGlobalFilterInput();
  }

  if (!mode.value) {
    prefetchDefaultTermData();
  }
});
</script>
