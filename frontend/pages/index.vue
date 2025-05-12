<template>
  <div class="tabs-container">
    <Tabs v-model:value="searchMode" scrollable>
      <TabList>
        <Tab
          v-for="tab in searchModeList"
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
      >
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            id="globalFilter"
            v-model="filters['global'].value"
            :autocapitalize="false"
            size="large"
            :style="{ width: '100%' }"
          />
        </IconField>
        <label for="globalFilter">課程名稱/教師/開課序號</label>
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
        :showGridlines="true"
        :show-headers="false"
        :scrollable="true"
        scrollHeight="calc(100vh - 20rem)"
        :rows="50"
        :rowsPerPageOptions="[10, 20, 50, 100]"
        :loading="loading"
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
      </DataTable>
    </div>
  </div>

  <Dialog
    v-model:visible="isShowSchedule"
    maximizable
    modal
    header="Header"
    :style="{
      width: '50rem',
      height: '80vh',
    }"
    :content-style="{
      margin: '0 0 1rem',
    }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <FloatingSchedule :selectedRows="selectedRows" />
  </Dialog>
</template>

<script setup>
import { ref } from "vue";
import { FloatingSchedule, CourseCell } from "#components";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Skeleton from "primevue/skeleton";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";

import Dialog from "primevue/dialog";

import Tabs from "primevue/tabs";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";

import FloatLabel from "primevue/floatlabel";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";

const terms = useState("terms", () => []); // 存儲學期資料
const currentTerm = useState("currentTerm", () => null); // 當前學期
const loadTermData = useState("loadTermData");
const updateMenubar = useState("updateMenubar"); // 更新選單欄的狀態

onMounted(async () => {
  const termResp = await fetch("data/terms.json");
  const termRespData = await termResp.json();
  terms.value = termRespData.terms;
  currentTerm.value = terms.value[termRespData.defaultIndex];
  updateMenubar.value(); // 更新選單欄的狀態

  loadTermData.value = reloadCurrentTerm; // 將載入學期資料的函數存儲到狀態中

  loadTermData.value(); // 載入學期資料
});

const subFilterValue = ref({
  value: null,
  filter_field: null,
  select_list: [],
  label: null,
}); // 用於存儲子篩選器的值
const filters = ref({
  global: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS,
  },
  option_code: {
    value: null,
    matchMode: FilterMatchMode.EQUALS,
  },
  course_name: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS,
  },
  chn_name: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS,
  },
  dept_chiabbr: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS,
  },
  eng_teach: {
    value: null,
    matchMode: FilterMatchMode.EQUALS,
  },
  generalCore: {
    operator: FilterOperator.OR,
    constraints: [],
  },
  dept_code: {
    operator: FilterOperator.OR,
    constraints: [],
  },
});
const defultGlobalFilterFields = ["course_name", "teacher", "serial_no"]; // 預設的全域篩選欄位

const isShowSchedule = ref(false); // 控制課表顯示的變數
const loading = ref(true); // 控制載入狀態的變數

// Row Data: The data to be displayed.
const rowDatas = ref({});
const rowData = ref([]);

const selectedRows = ref([]); // 用於存儲選中的行數據

const searchMode = ref("quick"); // 用於存儲當前的搜尋模式
const searchModeList = [
  {
    label: "快速搜尋",
    value: "quick",
    command: () => {
      filterMutatou({});
    },
  },
  {
    label: "通識",
    value: "general",
    command: () => {
      filterMutatou(
        { option_code: "通" },
        {
          label: "選擇通識領域",
          select_list: [
            {
              label: "人文藝術",
              value: { value: "A1UG", matchMode: FilterMatchMode.CONTAINS },
            },
            {
              label: "社會科學",
              value: { value: "A2UG", matchMode: FilterMatchMode.CONTAINS },
            },
            {
              label: "自然科學",
              value: { value: "A3UG", matchMode: FilterMatchMode.CONTAINS },
            },
            {
              label: "邏輯運算",
              value: { value: "A4UG", matchMode: FilterMatchMode.CONTAINS },
            },
            {
              label: "學院共同課程",
              value: { value: "B1UG", matchMode: FilterMatchMode.CONTAINS },
            },
            {
              label: "跨域專業探索課程",
              value: { value: "B2UG", matchMode: FilterMatchMode.CONTAINS },
            },
            {
              label: "大學入門",
              value: { value: "B3UG", matchMode: FilterMatchMode.CONTAINS },
            },
            {
              label: "專題探究",
              value: { value: "C1UG", matchMode: FilterMatchMode.CONTAINS },
            },
            {
              label: "MOOCs",
              value: { value: "C2UG", matchMode: FilterMatchMode.CONTAINS },
            },
          ],
          filter_field: "generalCore",
        }
      );
    },
    filter_field: ["course_name"],
  },
  {
    label: "體育",
    activeLabel: "普通體育",
    value: "physical",
    command: () => {
      filterMutatou({ dept_chiabbr: "普通體育" });
    },
  },
  {
    label: "國防",
    activeLabel: "全民國防教育",
    value: "Defense",
    command: () => {
      filterMutatou({ chn_name: "全民國防" });
    },
  },
  {
    label: "校際",
    activeLabel: "臺大系統校際課程",
    value: "interschool",
    command: () => {
      filterMutatou(
        { dept_chiabbr: "校際" },
        {
          label: "選擇開課學校",
          select_list: [
            {
              label: "國立臺灣大學",
              value: { value: "AA", matchMode: FilterMatchMode.ENDS_WITH },
            },
            {
              label: "國立臺灣科技大學",
              value: { value: "AB", matchMode: FilterMatchMode.ENDS_WITH },
            },
          ],
          filter_field: "dept_code",
        }
      );
    },
  },
  {
    label: "學分學程",
    value: "program",
    command: () => {
      filterMutatou({ chn_name: "學分學程" });
    },
  },
  {
    label: "英文三",
    value: "english",
    command: () => {
      filterMutatou({ course_name: "英文（三）" });
    },
  },
  {
    label: "英文授課",
    value: "EMI",
    command: () => {
      filterMutatou({ eng_teach: "是" });
    },
  },
  {
    label: "",
    value: "quick",
    command: () => {
      filterMutatou({});
    },
  },
];

function filterMutatou(updateValue, subFilter = null) {
  const filter = filters.value;
  for (const key in filter) {
    if (key === "global") {
      continue; // Skip global filter
    }
    if (key in updateValue) {
      filter[key].value = updateValue[key];
    } else {
      if (filter[key].value) {
        filter[key].value = null;
      }
      if (filter[key].constraints) {
        filter[key].constraints = [];
      }
    }
  }

  if (subFilter) {
    subFilterValue.value.value = null; // 清空子篩選器的值
    subFilterValue.value.filter_field = subFilter.filter_field;
    subFilterValue.value.select_list = subFilter.select_list;
    subFilterValue.value.label = subFilter.label;
  } else {
    subFilterValue.value.filter_field = null;
  }
}

async function fetchData(i) {
  // Fetch data from the server
  const res = await fetch(`data/${currentTerm.value}/${i}.min.json`);
  if (!res.ok) {
    return null; // Return null if no data
  }
  const data = await res.json();
  if (data.length === 0) {
    return null; // Return null if no data
  }
  return data.map((item) => {
    return {
      ...item,
      course_name: item.chn_name.replace(/<\/br>.*/g, ""),
      time: timeFormatter(item.time_loc),
      location: locationFormatter(item.time_loc),
      teacher: teacherNameFormatter(item.teacher),
      generalCore: item.generalCore.join("/"),
    };
  });
}

async function fetchAllData() {
  const fetchPromises = [];
  for (let i = 0; i < 10; i++) {
    fetchPromises.push(fetchData(i));
  }

  for await (const page of fetchPromises) {
    if (!page) {
      continue; // Skip if no data
    }
    rowData.value = rowData.value.concat(page);
    loading.value = false; // 停止載入資料
  }
}

function teacherNameFormatter(teacher) {
  return teacher.replace("", "温");
}

// .time_loc => { '一 1-2': 'A', '二 3-4': 'B' }
function timeFormatter(time) {
  if (typeof time === "string") {
    return time;
  }

  const timeLocation = [];
  for (const [key, _] of Object.entries(time)) {
    const [day, period] = key.split(" ");
    timeLocation.push(`${day} ${period}`);
  }
  return timeLocation.join("/");
}

// all same => A, else => A/B/...
function locationFormatter(location) {
  if (typeof location === "string") {
    return null;
  }

  const locations = [];
  for (const [_, value] of Object.entries(location)) {
    if (value !== "") {
      locations.push(value);
    }
  }
  const uniqueLocations = [...new Set(locations)];
  if (uniqueLocations.length === 1) {
    return uniqueLocations[0];
  }
  return locations.join("/");
}

async function reloadCurrentTerm() {
  loading.value = true; // 開始載入資料

  // check if the current term data in rowDatas
  if (rowDatas.value[currentTerm.value]) {
    rowData.value = rowDatas.value[currentTerm.value]; // 直接使用已載入的資料
    loading.value = false; // 停止載入資料
    return;
  }

  rowData.value = []; // 清空資料
  selectedRows.value = []; // 清空選取的資料

  // 重新載入資料

  await fetchAllData().then(() => {
    loading.value = false; // 停止載入資料
  });

  rowDatas.value[currentTerm.value] = rowData.value; // 儲存當前學期資料

  updateMenubar.value(); // 更新選單欄的狀態
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
  width: clamp(0px, 100%, 670px);

  @media screen and (min-width: 600px) {
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
  margin-top: 2rem;
  width: 100vw;
  padding: 0;
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
