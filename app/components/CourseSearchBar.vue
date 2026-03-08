<!-- 
query: {
  y: string; // year-term, undefined if default term is used
  s: string; // search input
  d: string; // dept filter, e.g. "CS,EE"
  g: string; // general education filter, e.g. "A,B,C"
  p: string; // program filter, e.g. "prog1,prog2"
}
-->

<template>
  <div class="search-bar-container w-full flex flex-col justify-center">
    <div
      class="breadcrumb-container max-w-full h-fit m-auto max-md:my-1.5 px-2 flex items-center gap-2 hide-scrollbar overflow-x-scroll"
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
        @click="breadcrumb.do?.()"
      />
    </div>
    <div
      class="relative search-bar max-w-3xl w-4/5 max-md:w-full m-auto max-md:flex-col max-md:items-center"
    >
      <UFieldGroup
        class="flex items-center max-md:flex-col max-md:items-stretch justify-between"
        :class="[
          'w-full md:h-16 md:rounded-full overflow-hidden shadow-xs shadow-gray-400',
          'max-md:rounded-none max-md:h-fit max-md:shadow-none max-md:border-t-[1.5px] max-md:border-b-[1.5px] max-md:border-gray-200 max-md:dark:border-gray-700',
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
          class="text-base border-gray-300 search-input w-full md:not-last:max-w-[calc(50%-1px)] max-md:h-16"
          @blur="
            () => {
              globalFilterInput = globalFilterInput.trim();
              updateGlobalFilter();
            }
          "
        >
          <label
            :class="[
              'pointer-events-none absolute left-8', // has text
              !globalFilterInput?.length
                ? 'top-1/2 -translate-y-1/2 object-left text-base text-dimmed ' +
                  'peer-focus:top-1/2 peer-focus:-translate-y-1/1 peer-focus:object-left peer-focus:text-xs peer-focus:text-primary' // no text + focus
                : 'top-1/2 -translate-y-1/1 text-xs text-primary object-left',
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
        <div
          v-if="['dept', 'general', 'program'].includes(mode)"
          class="h-[80%] max-md:h-0.5 w-px max-md:w-full bg-gray-300 dark:bg-gray-700"
        ></div>
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
          :content="{
            avoidCollisions: true,
          }"
          :autofocus="false"
          class="search-input w-full md:max-w-[calc(50%-1px)] max-md:h-16 text-base hover:bg-elevated ring-0 p-0"
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
              class="cursor-pointer text-base border-gray-300 w-full px-8 pb-3 pt-8 peer"
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
      class="advanced-search-control max-w-3xl w-4/5 max-md:w-full m-auto px-2 flex items-center gap-2 hide-scrollbar overflow-x-scroll my-4"
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
          :color="
            currentTerm
              ? currentTerm === defaultTerm
                ? 'primary'
                : 'warning'
              : 'neutral'
          "
          variant="subtle"
          size="lg"
          icon="tabler:calendar"
        />
      </UDropdownMenu>

      <UButton
        v-if="route.path?.includes('/search') && !isFilterEmpty"
        label="清除所有篩選"
        color="error"
        variant="subtle"
        size="lg"
        icon="tabler:filter-off"
        class="cursor-pointer"
        @click="
          () => {
            if (dropdownModel && dropdownModel.length > 0) {
              dropdownModel = [];
            }
            globalFilterInput = '';
            updateGlobalFilter(true).then(reflash);
          }
        "
      />
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
import { jsonLzDecode } from "~/composables/useTools";

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

async function updateGlobalFilter(force: boolean = false) {
  if (getGlobalFilterInput() === globalFilterInput.value && !force) {
    return;
  }
  updateGlobalFilterByInput(globalFilterInput.value);
  await updateRouterQuery(
    route.path.includes("/search") ? route.path : "/search/quick",
    {
      s: globalFilterInput.value.replace(" ", "+") || undefined,
    },
  );
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
            updateRouterQuery(undefined, route.query).then(reflash);
          },
        },
        {
          label: `${year}-2`,
          value: `${year}-2`,
          onSelect() {
            currentTerm.value = `${year}-2`;
            updateRouterQuery(undefined, route.query).then(reflash);
          },
        },
        {
          label: `${year}-暑期`,
          value: `${year}-3`,
          onSelect() {
            currentTerm.value = `${year}-3`;
            updateRouterQuery(undefined, route.query).then(reflash);
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
      updateRouterQuery("/search/quick");
      clearAndSetAllFilters({});
    },
  },
  {
    label: "系所",
    activeLabel: "系所課程",
    active: mode.value === "dept",
    do: () => {
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
      updateRouterQuery("/search/pe");
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
      updateRouterQuery("/search/nd");
      clearAndSetAllFilters({
        name: "全民國防教育軍事訓練",
      });
    },
  },
  {
    label: "學分學程",
    active: mode.value === "program",
    do: () => {
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
      updateRouterQuery("/search/interschool");
      clearAndSetAllFilters({
        department_code: ["9UAA", "9MAA", "9DAA", "9UAB", "9MAB"],
      });
    },
  },
  {
    label: "英文三",
    active: mode.value === "english3",
    do: () => {
      updateRouterQuery("/search/english3");
      clearAndSetAllFilters({
        name: "英文（三）",
      });
    },
  },
  {
    label: "英文授課",
    active: mode.value === "emi",
    do: () => {
      updateRouterQuery("/search/emi");
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
    updateRouterQuery("/search/dept", {
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
    updateRouterQuery("/search/general", {
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
    updateRouterQuery("/search/program", {
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

async function updateRouterQuery(
  path: string | undefined = undefined,
  query: Record<string, any> = {},
  force: boolean = false,
) {
  const newPath = path || route.path;
  const newQuery = force
    ? query
    : {
        // preserve existing query except s, which is the search input
        s: route.query.s,
        ...query,
        y:
          defaultTerm.value !== currentTerm.value
            ? currentTerm.value
            : undefined,
      };
  if (
    route.path == newPath &&
    JSON.stringify(route.query) === JSON.stringify(newQuery)
  ) {
    return;
  }
  await navigateTo({
    path: newPath,
    query: newQuery,
  });
}
function reflash() {
  modeBreadcrumbs.value.forEach((breadcrumb) => {
    if (breadcrumb.active) {
      breadcrumb.do && breadcrumb.do();
    }
  });
}
const isFilterEmpty = computed(() => {
  const {
    y: _, // current term is not considered as a filter
    ...filtersQuery
  } = route.query;
  return Object.values(filtersQuery || {}).filter((v) => !!v).length === 0;
});

onMounted(() => {
  if (route.query.y && typeof route.query.y === "string") {
    currentTerm.value = route.query.y;
  }
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

  reflash();
});
</script>
