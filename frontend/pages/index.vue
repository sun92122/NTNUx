<template>
  <div class="tabs-container">
    <Tabs v-model:value="searchMode" scrollable>
      <TabList>
        <Tab
          v-for="tab in Object.values(searchModeList)"
          :key="tab.value"
          :value="tab.value"
          @click="tab.command ? tab.command() : null"
          :class="tab.label ? '' : 'tab-disabled'"
        >
          {{
            searchMode == tab.value ? tab.activeLabel || tab.label : tab.label
          }}
        </Tab>
      </TabList>
    </Tabs>
  </div>

  <div class="container">
    <div class="search-container search-bar">
      <FloatLabel
        variant="in"
        :class="[
          'search-input',
          subFilterValue.filter_field
            ? 'multi-search-input-main-filter'
            : 'single-search-input',
        ]"
        @click="isShowAdvancedSearch ? openAdvancedSearch() : null"
      >
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            v-if="searchMode != 'advanced'"
            id="globalFilter"
            v-model="filters['global'].value"
            :autocapitalize="false"
            size="large"
            :style="{ width: '100%' }"
          />
          <InputText
            v-else
            id="globalFilter"
            value=""
            readonly
            :autocapitalize="false"
            size="large"
            :style="{ width: '100%', cursor: 'pointer' }"
            @click="openAdvancedSearch"
          />
        </IconField>
        <label for="globalFilter" v-if="searchMode != 'advanced'"
          >課程名稱/教師/開課序號</label
        >
        <label for="globalFilter" v-else>{{
          advancedSearchDisplayValue || "點擊進行進階搜尋"
        }}</label>
      </FloatLabel>
      <div
        v-if="subFilterValue.filter_field"
        class="search-input multi-search-input-sub-filter"
      >
        <MultiSelect
          id="sub-filter"
          v-model="subFilterValue.value"
          :options="subFilterValue.select_list"
          :optionLabel="'label'"
          :optionValue="'value'"
          :style="{ width: '100%' }"
          :showClear="true"
          :showToggleAll="false"
          :showFilter="true"
          :placeholder="subFilterValue.label"
          display="chip"
          @change="
            (e) => {
              filters[subFilterValue.filter_field].constraints = e.value || [
                { value: null, matchMode: FilterMatchMode.CONTAINS },
              ];
            }
          "
        />
      </div>
    </div>

    <div class="grid-container">
      <DataTable
        :value="rowData"
        :paginator="true"
        :filters="filters"
        :global-filter-fields="
          searchMode.filter_field || defultGlobalFilterFields
        "
        :showGridlines="false"
        :show-headers="false"
        :scrollable="true"
        scrollHeight="calc(100vh - 22rem)"
        :rows="50"
        :rowsPerPageOptions="[10, 20, 50, 100]"
        :loading="loading"
        :style="{
          border: '1px solid var(--p-datatable-border-color)',
          borderRadius: '0.5rem',
        }"
      >
        <template #header>
          <span>課程資訊</span>
        </template>

        <template #loading>
          <Skeleton
            width="100%"
            height="100%"
            :shape="'rectangle'"
            :border-radius="'0.5rem'"
          />
        </template>

        <template #empty>
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-2" />
            <span>沒有符合條件的課程</span>
          </div>
        </template>

        <!-- <template #header> </template> -->
        <Column :sortable="false">
          <template #body="{ data }">
            <CourseCell :course="data" />
          </template>
        </Column>

        <!-- Selecte button -->
        <Column
          :headerStyle="{ width: '5rem', textAlign: 'center' }"
          :bodyStyle="{ textAlign: 'center' }"
          :sortable="false"
          :style="{ width: '5rem', textAlign: 'center', paddingRight: '1rem' }"
          :header="''"
        >
          <template #body="{ data }">
            <Button
              :label="selectedRows[data.serial_no] ? '取消' : '加入'"
              :severity="selectedRows[data.serial_no] ? 'warn' : 'secondary'"
              @click="selectCourse(data)"
            ></Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";

import { useCourses } from "~/composables/useCourses";

import {
  DataTable,
  Column,
  Skeleton,
  Button,
  InputText,
  MultiSelect,
  FloatLabel,
  IconField,
  InputIcon,
  Tabs,
  Tab,
  TabList,
} from "primevue";
import { CourseCell } from "#components";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const {
  terms,
  currentTerm,
  rowData,
  loading,
  reloadCurrentTerm,
  initTermData,
  defultGlobalFilterFields,
} = useCourses();

const updateMenubar = useState("updateMenubar");
const selectedCourses = useState("selectedCourses", () => ({}));
const selectedRows = useState("selectedRows", () => ({}));
const isShowAdvancedSearch = useState("isShowAdvancedSearch", () => false);
const windowWidth = useState("windowWidth", () => window.innerWidth);

const advancedSearchDisplayValue = useState(
  "advancedSearchDisplayValue",
  () => "點擊進行進階搜尋"
);

// 搜尋模式與子篩選器
const searchMode = ref("");
const searchText = null;
const subFilterValue = ref({
  value: null,
  filter_field: null,
  select_list: [],
  label: null,
});

const filters = useState("filters", () => ({
  global: {
    value: searchText,
    matchMode: FilterMatchMode.CONTAINS,
  },
  option_code: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  course_name: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  chn_name: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  dept_chiabbr: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  eng_teach: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  generalCore: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  dept_code: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  time_inf: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  time_loc: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  comment: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  credit: {
    operator: FilterOperator.OR,
    constraints: [],
  },
}));

const searchModeList = ref({
  quick: {
    label: "快速搜尋",
    value: "quick",
    command: () => filterMutatou({}),
  },
  advanced: {
    label: "進階搜尋",
    value: "advanced",
    command: () => {
      isShowAdvancedSearch.value = true;
      filterMutatou({ global: null });
      rebuildAdvancedSearchFilters();
    },
  },
  general: {
    label: "通識",
    value: "general",
    command: () =>
      filterMutatou(
        {
          option_code: {
            operator: FilterOperator.OR,
            constraints: [{ value: "通", matchMode: FilterMatchMode.EQUALS }],
          },
        },
        {
          label: "選擇通識領域",
          select_list: Object.entries({
            人文藝術: "A1UG",
            社會科學: "A2UG",
            自然科學: "A3UG",
            邏輯運算: "A4UG",
            學院共同課程: "B1UG",
            跨域專業探索課程: "B2UG",
            大學入門: "B3UG",
            專題探究: "C1UG",
            MOOCs: "C2UG",
          }).map(([label, value]) => ({
            label,
            value: { value, matchMode: FilterMatchMode.CONTAINS },
          })),
          filter_field: "generalCore",
        }
      ),
  },
  physical: {
    label: "體育",
    activeLabel: "普通體育",
    value: "physical",
    command: () =>
      filterMutatou({
        dept_chiabbr: {
          operator: FilterOperator.OR,
          constraints: [{ value: "體育", matchMode: FilterMatchMode.CONTAINS }],
        },
      }),
  },
  defense: {
    label: "國防",
    activeLabel: "全民國防教育",
    value: "defense",
    command: () =>
      filterMutatou({
        chn_name: {
          operator: FilterOperator.OR,
          constraints: [
            { value: "全民國防", matchMode: FilterMatchMode.CONTAINS },
          ],
        },
      }),
  },
  interschool: {
    label: "校際",
    activeLabel: "臺大系統校際課程",
    value: "interschool",
    command: () =>
      filterMutatou(
        {
          dept_chiabbr: {
            operator: FilterOperator.OR,
            constraints: [
              { value: "校際", matchMode: FilterMatchMode.CONTAINS },
            ],
          },
        },
        {
          label: "選擇開課學校",
          select_list: Object.entries({
            國立臺灣大學: "AA",
            國立臺灣科技大學: "AB",
          }).map(([label, value]) => ({
            label,
            value: { value, matchMode: FilterMatchMode.ENDS_WITH },
          })),
          filter_field: "dept_code",
        }
      ),
  },
  program: {
    label: "學分學程",
    value: "program",
    command: () =>
      filterMutatou({
        chn_name: {
          operator: FilterOperator.OR,
          constraints: [
            { value: "學分學程", matchMode: FilterMatchMode.CONTAINS },
          ],
        },
      }),
  },
  english: {
    label: "英文三",
    value: "english",
    command: () =>
      filterMutatou({
        course_name: {
          operator: FilterOperator.OR,
          constraints: [
            { value: "英文（三）", matchMode: FilterMatchMode.CONTAINS },
          ],
        },
      }),
  },
  emi: {
    label: "英文授課",
    value: "emi",
    command: () =>
      filterMutatou({
        eng_teach: {
          operator: FilterOperator.OR,
          constraints: [{ value: "是", matchMode: FilterMatchMode.EQUALS }],
        },
      }),
  },
  "": {
    label: "",
    value: "quick",
    command: () => filterMutatou({}),
  },
});

onMounted(async () => {
  await initTermData(route);
  updateMenubar.value();

  searchMode.value = route.query.m?.toLowerCase() || "quick";
  if (searchModeList.value[searchMode.value]) {
    searchModeList.value[searchMode.value]?.command();
  } else {
    searchMode.value = "quick";
  }

  if (!selectedCourses.value[currentTerm.value]) {
    selectedCourses.value[currentTerm.value] = {};
  }
  selectedRows.value = selectedCourses.value[currentTerm.value];
});

watch(
  () => searchMode.value,
  (newValue) => {
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        m: newValue,
        s: filters.value.global.value || null,
      },
    });
  }
);

function filterMutatou(updateValue, subFilter = null) {
  for (const key in filters.value) {
    if (key === "global") continue;
    if (key in updateValue) {
      filters.value[key] = updateValue[key];
    } else {
      filters.value[key].constraints &&= [];
    }
  }

  if (subFilter) {
    subFilterValue.value = {
      ...subFilterValue.value,
      value: null,
      filter_field: subFilter.filter_field,
      select_list: subFilter.select_list,
      label: subFilter.label,
    };
  } else {
    subFilterValue.value.filter_field = null;
  }
}

function openAdvancedSearch() {
  isShowAdvancedSearch.value = true;
}

function selectCourse(course) {
  const selected = selectedRows.value;
  if (selected[course.serial_no]) {
    delete selected[course.serial_no];
    toast.add({
      severity: "info",
      summary: "已取消選課",
      detail: `${course.serial_no} ${course.course_name}`,
      life: 3000,
      group: windowWidth.value < 768 ? "bottom" : null,
    });
  } else {
    selected[course.serial_no] = course;
    toast.add({
      severity: "success",
      summary: "已選課",
      detail: `${course.serial_no} ${course.course_name}`,
      life: 3000,
      group: windowWidth.value < 768 ? "bottom" : null,
    });
  }
}

function rebuildAdvancedSearchFilters() {
  const advancedSearchFilters = useState("advancedSearchFilters");
  for (const filterKey in advancedSearchFilters.value) {
    const filter = advancedSearchFilters.value[filterKey][0];
    if (filter.onChange) {
      filter.onChange(filter.value);
    }
  }
}
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tabs-container {
  margin: 0.5rem auto 1rem;
  width: clamp(0px, 100%, 760px);

  @media screen and (min-width: 760px) {
    .p-tablist-tab-list {
      justify-content: center;
    }
  }

  .tab-disabled {
    border-color: inherit;
  }
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
}

.grid-container {
  margin-top: 0.5rem;
  width: 100vw;
  padding: 0;
  --p-datatable-body-cell-padding: 0.75rem 0;

  .p-datatable-table-container,
  .p-datatable-table {
    min-height: 50vh;
  }

  .p-datatable-mask {
    border-radius: 0.5rem;
  }
}

@media screen and (min-width: 768px) {
  .grid-container {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
  }

  @media (min-width: 992px) {
    .grid-container {
      width: clamp(992px, 88%, 1632px);
    }
  }
}

.search-bar {
  .p-component {
    height: 48px;
  }
  .p-multiselect-chip {
    height: auto;
  }
  .p-multiselect-label-container {
    align-content: center;
  }
  width: 100%;
  max-width: 48rem;

  --p-floatlabel-focus-color: var(--p-floatlabel-color);
}

.search-input {
  width: 100%;
  --p-inputtext-border-radius: 25px;
  --p-multiselect-border-radius: 25px;
}

.multi-search-input-main-filter {
  .p-component {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.multi-search-input-sub-filter {
  .p-multiselect {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

@media screen and (min-width: 768px) {
  .multi-search-input-main-filter,
  .multi-search-input-sub-filter {
    width: 50%;
  }
  .single-search-input {
    width: 100%;
  }
}

@media screen and (max-width: 670px) {
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  .multi-search-input-main-filter {
    .p-component {
      border-radius: 1rem 1rem 0 0;
    }
  }
  .multi-search-input-sub-filter {
    .p-multiselect {
      border-left: 1px solid var(--p-multiselect-border-color);
      border-radius: 0 0 1rem 1rem;
    }
  }
}

.p-datatable-header {
  border-radius: 0.5rem 0.5rem 0 0;
}

.p-datatable-table-container {
  scrollbar-width: none;
}
</style>
