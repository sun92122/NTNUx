<template>
  <div class="tabs-container">
    <Tabs v-model:value="searchMode" scrollable @update:value="resetPage">
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
          subFilterValue.select_list || subFilterValue.grouped_select_list
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
        <label
          class="global-filter-label"
          for="globalFilter"
          v-if="searchMode != 'advanced'"
          >課程名稱/教師/開課序號</label
        >
        <label
          class="global-filter-label advanced-search-label"
          for="globalFilter"
          v-else
          >{{ advancedSearchDisplayValue || "點擊進行進階搜尋" }}</label
        >
      </FloatLabel>
      <div
        v-if="subFilterValue.select_list"
        class="search-input multi-search-input-sub-filter"
      >
        <MultiSelect
          ref="subFilterRef"
          id="sub-filter"
          v-model="subFilterValue.value"
          :options="subFilterValue.select_list"
          :optionLabel="'label'"
          :optionValue="'value'"
          :showClear="true"
          :showToggleAll="false"
          :filter="true"
          :placeholder="subFilterValue.label"
          display="chip"
          :style="{ width: '100%' }"
          @change="
            (e) => {
              filters[subFilterValue.filter_field].constraints = e.value || [
                { value: null, matchMode: FilterMatchMode.CONTAINS },
              ];
            }
          "
        />
      </div>
      <div
        v-if="subFilterValue.grouped_select_list"
        class="search-input multi-search-input-sub-filter"
      >
        <TreeSelect
          ref="subFilterRef"
          id="sub-filter-grouped"
          v-model="subFilterValue.value"
          :options="subFilterValue.grouped_select_list"
          selectionMode="checkbox"
          filter
          filterMode="strict"
          :showClear="true"
          :placeholder="subFilterValue.label"
          :style="{ width: '100%' }"
          @change="selectDeptToFilter()"
        />
      </div>
    </div>

    <div class="grid-container">
      <DataTable
        ref="scrollTableRef"
        :value="rowData"
        :paginator="true"
        :filters="filters"
        :global-filter-fields="
          searchMode.filter_field || defaultGlobalFilterFields
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
        @page="scroll(-Infinity)"
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
          :headerStyle="{
            width: 'clamp(5rem, 10vw, 10rem)',
            textAlign: 'center',
          }"
          :bodyStyle="{ textAlign: 'center' }"
          :sortable="false"
          :style="{
            width: 'clamp(5rem, 10vw, 10rem)',
            textAlign: 'center',
            paddingRight: '1rem',
          }"
          :header="''"
        >
          <template #body="{ data }">
            <div
              style="
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                justify-content: center;
              "
            >
              <Button
                :icon="
                  checkSelectCode(data.course_code)
                    ? 'pi pi-heart-fill'
                    : 'pi pi-heart'
                "
                :severity="
                  checkSelectCode(data.course_code) ? 'danger' : 'secondary'
                "
                variant="text"
                @click="selectCodeHandler(data.course_code, data.course_name)"
                rounded
              ></Button>
              <Button
                :label="checkSelectedCourse(data.serial_no) ? '取消' : '加入'"
                :severity="
                  checkSelectedCourse(data.serial_no) ? 'warn' : 'secondary'
                "
                @click="selectCourse(data)"
              ></Button>
            </div>
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
import { useSelectCourse } from "~/composables/useSelectCourse";

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
  TreeSelect,
} from "primevue";
import { CourseCell } from "#components";

const router = useRouter();
const route = useRoute();

const {
  terms,
  currentTerm,
  rowData,
  tempDatas,
  loading,
  programSet,
  reloadCurrentTerm,
  defaultGlobalFilterFields,
  initTermData,
  courseFormatter,
} = useCourses();

const {
  selectedCourses,
  selectedRows,
  selectCode,
  toast,
  windowWidth,
  selectCourse,
  selectCourseWithTerm,
  checkSelectedCourse,
  selectCodeHandler,
  checkSelectCode,
} = useSelectCourse();

const updateMenubar = useState("updateMenubar");
const deptList = useState("deptList");
const isShowSchedule = useState("isShowSchedule", () => false);
const isShowAdvancedSearch = useState("isShowAdvancedSearch", () => false);
const subFilterRef = ref(null);

const advancedSearchDisplayValue = useState(
  "advancedSearchDisplayValue",
  () => "點擊進行進階搜尋"
);

const scrollTableRef = ref(null);

const advancedSearchRebuild = useState("advancedSearchRebuildFunction");

// 搜尋模式與子篩選器
const searchMode = ref("");
const searchText = null;
const subFilterValue = ref({
  value: null,
  filter_field: null,
  select_list: null,
  grouped_select_list: null,
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
  timeListStr: {
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
  programs: {
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
  dept: {
    label: "系所",
    value: "dept",
    command: () =>
      filterMutatou(
        {
          dept_chiabbr: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
          },
        },
        {
          label: "選擇開課單位",
          grouped_select_list: deptList.value || {},
          filter_field: "dept_code",
        }
      ),
  },
  advanced: {
    label: "進階搜尋",
    value: "advanced",
    command: () => {
      isShowAdvancedSearch.value = true;
      filterMutatou({});
      filters.value["global"].value = null;
      if (advancedSearchRebuild && advancedSearchRebuild.value) {
        advancedSearchRebuild.value();
      }
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
      filterMutatou(
        {
          chn_name: {
            operator: FilterOperator.OR,
            constraints: [
              { value: "學分學程", matchMode: FilterMatchMode.CONTAINS },
            ],
          },
        },
        {
          label: "選擇學分學程",
          select_list: [...programSet.value].sort().map((program) => ({
            label: program,
            value: {
              value: program,
              matchMode: FilterMatchMode.CONTAINS,
            },
          })),
          filter_field: "programs",
        }
      ),
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

function resetPage() {
  if (scrollTableRef.value) {
    scrollTableRef.value.d_first = 0;
  }
}

function scroll(deltaY) {
  if (
    isShowAdvancedSearch.value ||
    isShowSchedule.value ||
    (subFilterRef.value && subFilterRef.value.overlayVisible)
  ) {
    return 0;
  }

  const scrollable = scrollTableRef.value?.$el.querySelector(
    ".p-datatable-table-container"
  );
  if (scrollable) {
    scrollable.scrollTop = Math.max(
      0,
      Math.min(
        scrollable.scrollTop + deltaY,
        scrollable.scrollHeight - scrollable.clientHeight
      )
    );
    if (
      scrollable.scrollTop <
        scrollable.scrollHeight - scrollable.clientHeight &&
      scrollable.scrollTop > 0
    ) {
      return 1;
    }
  }
  return 0;
}

onMounted(async () => {
  const onWheel = (e) => {
    if (scroll(e.deltaY)) {
      e.preventDefault();
    }
  };

  const onKey = (e) => {
    if (e.key === "Home") {
      scroll(-Infinity);
    }
    if (e.key === "End") {
      scroll(Infinity);
    }
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKey);

  onBeforeUnmount(() => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
  });

  await initTermData(route);
  updateMenubar.value();

  searchMode.value = route.query.m?.toLowerCase() || "quick";
  if (route.query.s) {
    filters.value.global.value = route.query.s;
  } else {
    filters.value.global.value = null;
  }
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
      select_list: subFilter.select_list || null,
      grouped_select_list: subFilter.grouped_select_list || null,
      label: subFilter.label,
    };
  } else {
    subFilterValue.value.select_list = null;
    subFilterValue.value.grouped_select_list = null;
  }
}

function openAdvancedSearch() {
  isShowAdvancedSearch.value = true;
}

function selectDeptToFilter() {
  const dept = subFilterValue.value.value;
  if (!dept || Object.keys(dept).length === 0) {
    filters.value[subFilterValue.value.filter_field].constraints = [
      { value: null, matchMode: FilterMatchMode.CONTAINS },
    ];
    return;
  }
  const deptList = subFilterValue.value.grouped_select_list;
  filters.value[subFilterValue.value.filter_field].constraints = Object.entries(
    dept
  ).map(([key, value]) => {
    if (!value.checked) {
      return { value: null, matchMode: FilterMatchMode.CONTAINS };
    }
    const keyParts = key.split("-");
    if (keyParts.length === 1) {
      return deptList[key].data;
    }
    if (keyParts.length === 2) {
      return deptList[keyParts[0]].children[keyParts[1]].data;
    }
    {
      return deptList[keyParts[0]].children[keyParts[1]].children[keyParts[2]]
        .data;
    }
  });
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
  .p-multiselect-label-container,
  .p-treeselect-label-container {
    align-content: center;
  }
  .p-treeselect-label {
    display: block;
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
  .p-multiselect,
  .p-treeselect {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .p-treeselect,
  .p-treeselect-dropdown {
    border-end-end-radius: 25px;
    border-start-end-radius: 25px;
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
    .p-multiselect,
    .p-treeselect {
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
  -webkit-overflow-scrolling: touch;
}

.advanced-search-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;

  --p-floatlabel-in-active-top: 50% !important;
  --p-floatlabel-over-active-top: 0 !important;
  font-size: inherit !important;
  transform: translateY(-50%) !important;
}
</style>
