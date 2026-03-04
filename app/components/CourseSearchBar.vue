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
      class="relative search-bar max-w-3xl w-2/3 max-md:w-full m-auto max-md:flex-col max-md:items-center"
    >
      <UFieldGroup
        class="flex items-center max-md:flex-col max-md:items-stretch"
        :class="[
          'w-full md:h-16 md:rounded-full overflow-hidden shadow-xs shadow-gray-400',
          'max-md:rounded-none max-md:h-fit max-md:shadow-none max-md:border-b-2 max-md:border-t-2 max-md:border-gray-200',
        ]"
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
          :ui="{
            base: 'px-8 pb-3 pt-8 peer',
          }"
          class="text-base border-gray-300 search-input w-full h-full max-md:h-16"
          @blur="globalFilterInput = globalFilterInput.trim()"
        >
          <label
            :class="[
              'pointer-events-none absolute left-8 top-1/2 -translate-y-1/1 text-xs text-primary', // has text
              'peer-focus:top-1/2 peer-focus:-translate-y-1/1 peer-focus:text-xs peer-focus:text-primary', // focus
              'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:object-left peer-placeholder-shown:text-base peer-placeholder-shown:text-dimmed', // placeholder
              'transition-all duration-200 ease-in-out',
            ]"
          >
            <span class="inline-flex">關鍵字搜尋</span>
          </label>
          <label
            :class="[
              'pointer-events-none absolute left-8 top-8 text-base text-dimmed collapse', // has text
              'peer-placeholder-shown:peer-focus:visible', // focus + placeholder
              'transition-all duration-50 ease-in-out',
            ]"
          >
            <span class="inline-flex">搜尋課程名稱、教師、課程號碼</span>
          </label>
        </UInput>

        <!-- Extra search -->
        <USeparator
          v-if="['dept', 'general', 'program'].includes(mode)"
          :orientation="windowWidth < 768 ? 'horizontal' : 'vertical'"
          class="h-[80%] w-4 max-md:w-full max-md:h-1"
        />
        <USelectMenu
          v-if="['dept', 'general', 'program'].includes(mode)"
          :items="
            mode === 'dept'
              ? deptDropdownOptions.items.value
              : mode === 'general'
                ? generalDropdownOptions.items.value
                : mode === 'program'
                  ? programDropdownOptions.items.value
                  : []
          "
          v-model="dropdownModel"
          placeholder=""
          multiple
          trailingIcon=""
          :filterFields="['label', 'value']"
          class="search-input w-full md:max-w-1/2 h-full max-md:h-16 text-base hover:bg-elevated ring-0 p-0"
          @update:model-value="
            mode === 'dept'
              ? deptDropdownOptions.updateHandler()
              : mode === 'general'
                ? generalDropdownOptions.updateHandler()
                : mode === 'program'
                  ? programDropdownOptions.updateHandler()
                  : () => {}
          "
        >
          <template #default="{ modelValue }">
            <UButton
              color="neutral"
              variant="ghost"
              label=""
              class="text-base border-gray-300 w-full px-8 pb-3 pt-8 peer"
            >
              <div class="h-5"></div>
              <label
                :class="[
                  'pointer-events-none absolute left-8 md:left-2 top-1/2',
                  'object-left text-dimmed text-base', // placeholder
                  'transition-all duration-200 ease-in-out',
                  modelValue && modelValue.length > 0
                    ? 'text-primary -translate-y-1/1 text-xs' // labelfloat
                    : '-translate-y-1/2', // placeholder
                ]"
              >
                <span class="inline-flex">{{
                  {
                    dept: "篩選開課單位",
                    general: "篩選通識領域",
                    program: "篩選學分學程",
                  }[mode] || "篩選"
                }}</span>
              </label>
              <label
                :class="[
                  'pointer-events-none absolute left-8 md:left-2 top-8 text-base collapse object-left', // no text
                  modelValue && modelValue.length > 0
                    ? 'visible text-default' // has text
                    : '',
                ]"
              >
                <span class="inline-flex">{{
                  modelValue && modelValue.length > 0
                    ? modelValue.length < 5
                      ? modelValue.map((item: any) => item.label).join(", ")
                      : modelValue
                          .slice(0, 3)
                          .map((item: any) => item.label)
                          .join(", ") + ` +${modelValue.length - 3} more`
                    : {
                        dept: "篩選開課單位",
                        general: "篩選通識領域",
                        program: "篩選學分學程",
                      }[mode] || "篩選"
                }}</span>
              </label>
            </UButton>
          </template>

          <template #item-leading="{ item }">
            <UBadge
              v-if="item"
              class="font-bold rounded-full! w-10 justify-center"
              color="secondary"
              variant="soft"
              :label="(item as any)?.value"
            />
          </template>
        </USelectMenu>
      </UFieldGroup>
      <!-- search button -->
      <div
        class="absolute right-0 top-0 h-full w-16 flex items-center justify-center pr-2.5 z-10"
        :class="
          ['dept', 'general', 'program'].includes(mode) ? 'max-md:h-1/2' : ''
        "
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
      class="advanced-search-control max-w-3xl min-w-2/5 max-md:w-full m-auto px-2 flex items-center gap-2 hide-scrollbar overflow-x-scroll my-4"
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
import type { BreadcrumbItem, SelectMenuItem } from "@nuxt/ui";
import {
  useCourseFilter,
  getGlobalFilterInput,
  updateGlobalFilterByInput,
  addColumnFilter,
  removeColumnFilter,
  clearAndSetAllFilters,
} from "~/composables/useCourseFilter";
import {
  prefetchDefaultTermData,
  getTable,
} from "~/composables/useCourseTable";
import { jsonLzDecode, routerPushWithQuery } from "~/composables/useTools";

const windowWidth = useState("windowWidth", () => window?.innerWidth || 1200);
const config = useRuntimeConfig();
const termList = useState<string[]>("termList", () =>
  config.public.ntnuxTerms
    ? ((config.public.ntnuxTerms as String) || "")
        .split(",")
        .map((term: string) => term.trim())
    : [],
);
const defaultTerm = useState<string>(
  "defaultTerm",
  () => (config.public.ntnuxDefaultTerm as string) || "",
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
    navigateTo({
      path: "/search/quick",
      query: { s: globalFilterInput.value.replace(" ", "+") },
    });
  } else {
    router.push({
      query: {
        ...route.query,
        s: globalFilterInput.value.replace(" ", "+") || undefined,
      },
    });
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
        routerPushWithQuery(route, router, "/search/quick", {});
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
        routerPushWithQuery(route, router, "/search/dept", {});
      }
      clearAndSetAllFilters({});
      deptDropdownOptions.model.value = deptDropdownOptions.getFromQuery();
      deptDropdownOptions.updateHandler();
    },
  },
  {
    label: "通識",
    activeLabel: "通識課程",
    active: mode.value === "general",
    do: () => {
      if (mode.value !== "general") {
        routerPushWithQuery(route, router, "/search/general", {});
      }
      clearAndSetAllFilters({});
      generalDropdownOptions.model.value =
        generalDropdownOptions.getFromQuery();
      generalDropdownOptions.updateHandler();
    },
  },
  {
    label: "體育",
    activeLabel: "普通體育",
    active: mode.value === "pe",
    do: () => {
      if (mode.value !== "pe") {
        routerPushWithQuery(route, router, "/search/pe", {});
      }
      clearAndSetAllFilters({
        department_code: ["PE"],
      });
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
        routerPushWithQuery(route, router, "/search/nd", {});
      }
      clearAndSetAllFilters({
        name: "全民國防教育軍事訓練",
      });
    },
  },
  {
    label: "學分學程",
    active: mode.value === "program",
    do: () => {
      if (mode.value !== "program") {
        routerPushWithQuery(route, router, "/search/program", {});
      }
      clearAndSetAllFilters({});
      programDropdownOptions.model.value =
        programDropdownOptions.getFromQuery();
      programDropdownOptions.updateHandler();
    },
  },
  {
    label: "校際",
    activeLabel: "臺大系統課程",
    active: mode.value === "interschool",
    do: () => {
      if (mode.value !== "interschool") {
        routerPushWithQuery(route, router, "/search/interschool", {});
      }
      clearAndSetAllFilters({
        department_code: ["9UAA", "9MAA", "9DAA", "9UAB", "9MAB"],
      });
    },
  },
  {
    label: "英文三",
    active: mode.value === "english3",
    do: () => {
      if (mode.value !== "english3") {
        routerPushWithQuery(route, router, "/search/english3", {});
      }
      clearAndSetAllFilters({
        name: "英文（三）",
      });
    },
  },
  {
    label: "英文授課",
    active: mode.value === "emi",
    do: () => {
      if (mode.value !== "emi") {
        routerPushWithQuery(route, router, "/search/emi", {});
      }
      clearAndSetAllFilters({
        english_teaching: true,
      });
    },
  },
]);

const tableWatchVersion = useState("tableWatchVersion", () => 0);
const table = computed(() => getTable());

const deptDropdownOptions = {
  items: useState<SelectMenuItem[]>(
    "deptDropdownItems",
    () =>
      (jsonLzDecode(
        config.public.ntnuxDepartmentsLz as string,
      ) as SelectMenuItem[]) || [],
  ),
  model: ref<SelectMenuItem[]>([]),
  updateHandler: () => {
    if (deptDropdownOptions.model.value.length === 0) {
      removeColumnFilter("department_code");
    } else {
      addColumnFilter(
        "department_code",
        deptDropdownOptions.model.value.map((item: any) => item.value),
      );
    }
    // push to dept search page with query
    routerPushWithQuery(route, router, "/search/dept", {
      d:
        deptDropdownOptions.model.value
          ?.map((item: any) => item.value)
          ?.join(",") || undefined,
    });
  },
  getFromQuery() {
    const query = route.query.d;
    if (typeof query === "string") {
      return deptDropdownOptions.items.value.filter((item: any) =>
        query.split(",").includes(item.value),
      );
    }
    return [];
  },
};
const generalDropdownOptions = {
  items: useState<SelectMenuItem[]>(
    "generalDropdownItems",
    () =>
      (jsonLzDecode(
        config.public.ntnuxGeneralsLz as string,
      ) as SelectMenuItem[]) || [],
  ),
  model: ref<SelectMenuItem[]>([]),
  updateHandler: () => {
    if (generalDropdownOptions.model.value.length === 0) {
      addColumnFilter("general_education", ["all"]);
    } else {
      addColumnFilter(
        "general_education",
        generalDropdownOptions.model.value.map((item: any) => item.value),
      );
    }
    // push to general education search page with query
    routerPushWithQuery(route, router, "/search/general", {
      g:
        generalDropdownOptions.model.value
          ?.map((item: any) => item.value)
          ?.join(",") || undefined,
    });
  },
  getFromQuery() {
    const query = route.query.g;
    if (typeof query === "string") {
      return generalDropdownOptions.items.value.filter((item: any) =>
        query.split(",").includes(item.value),
      );
    }
    return [];
  },
};
const programDropdownOptions = {
  items: useState<SelectMenuItem[]>(
    "programDropdownItems",
    () =>
      (jsonLzDecode(
        config.public.ntnuxProgramsLz as string,
      ) as SelectMenuItem[]) || [],
  ),
  model: ref<SelectMenuItem[]>([]),
  updateHandler: () => {
    if (programDropdownOptions.model.value.length === 0) {
      addColumnFilter("credit_program", ["all"]);
    } else {
      addColumnFilter(
        "credit_program",
        programDropdownOptions.model.value.map((item: any) => item.value),
      );
    }
    // push to program search page with query
    routerPushWithQuery(route, router, "/search/program", {
      p:
        programDropdownOptions.model.value
          ?.map((item: any) => item.value)
          ?.join(",") || undefined,
    });
  },
  getFromQuery() {
    const query = route.query.p;
    if (typeof query === "string") {
      return programDropdownOptions.items.value.filter((item: any) =>
        query.split(",").includes(item.value),
      );
    }
    return [];
  },
};
const bufferModel = ref<any>(null);

const dropdownModel = computed({
  get() {
    if (mode.value === "dept") {
      return deptDropdownOptions.model.value;
    } else if (mode.value === "general") {
      return generalDropdownOptions.model.value;
    } else if (mode.value === "program") {
      return programDropdownOptions.model.value;
    }
    return bufferModel.value;
  },
  set(value) {
    if (mode.value === "dept") {
      deptDropdownOptions.model.value = value;
    } else if (mode.value === "general") {
      generalDropdownOptions.model.value = value;
    } else if (mode.value === "program") {
      programDropdownOptions.model.value = value;
    } else {
      bufferModel.value = value;
    }
  },
});

onMounted(() => {
  if (route.query.s && typeof route.query.s === "string") {
    globalFilterInput.value = route.query.s.replace(/\+/g, " ");
    updateGlobalFilterByInput(globalFilterInput.value);
  }
  if (!globalFilterInput.value) {
    globalFilterInput.value =
      getGlobalFilterInput() ||
      route.query.s?.toString().replace(/\+/g, " ") ||
      "";
  }
  if (globalFilterInput.value) {
    updateGlobalFilterByInput(globalFilterInput.value);
  }

  if (!mode.value) {
    prefetchDefaultTermData();
  }

  tableWatchVersion.value += 1;

  modeBreadcrumbs.value.forEach((breadcrumb) => {
    if (breadcrumb.active) {
      breadcrumb.do && breadcrumb.do();
    }
  });
});
</script>
