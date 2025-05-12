<template>
  <div class="tabs-container">
    <Tabs v-model:value="searchMode" scrollable>
      <TabList>
        <Tab
          v-for="tab in searchModeList"
          :key="tab.value"
          :value="tab.value"
          @click="tab.command ? tab.command() : null"
        >
          {{
            searchMode == tab.value ? tab.activeLabel || tab.label : tab.label
          }}
        </Tab>
      </TabList>
    </Tabs>
  </div>

  <div class="container">
    <div class="search-container">
      <FloatLabel variant="in" class="search-bar">
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
    </div>

    <div class="grid-container">
      <DataTable
        :value="rowData"
        :paginator="true"
        :filters="filters"
        :global-filter-fields="['course_name', 'teacher', 'serial_no']"
        :showGridlines="true"
        :show-headers="false"
        :scrollable="true"
        scrollHeight="calc(100vh - 20rem)"
        :rows="50"
        :rowsPerPageOptions="[10, 20, 50, 100]"
        :loading="loading"
        @selection-change="onSelectionChanged"
      >
        <template #header>
          <span>課程資訊</span>
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
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row"; // optional
import { FilterMatchMode } from "@primevue/core/api";

import Dialog from "primevue/dialog";
import Button from "primevue/button";

import Tabs from "primevue/tabs";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";

import FloatLabel from "primevue/floatlabel";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";

const terms = useState("terms", () => []); // 存儲學期資料
const currentTerm = useState("currentTerm", () => null); // 當前學期
const loadTermData = useState("loadTermData");
const updateMenubar = useState("updateMenubar"); // 更新選單欄的狀態

onMounted(async () => {
  const termResp = await fetch("data/terms.json");
  terms.value = await termResp.json();
  currentTerm.value = terms.value[0]; // 預設當前學期為第一個學期
  loadTermData.value = reloadCurrentTerm; // 將載入學期資料的函數存儲到狀態中

  loadTermData.value(); // 載入學期資料
});

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
});

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
    filter_field: ["course_name", "teacher", "serial_no"],
  },
  {
    label: "通識",
    value: "general",
    command: () => {
      filterMutatou({ option_code: "通" });
    },
    filter_field: ["course_name"],
  },
  { label: "共同", value: "common" },
  { label: "國防", value: "military" },
  { label: "體育", value: "physical" },
  {
    label: "校際",
    value: "interschool",
    command: () => {
      filterMutatou({ dept_chiabbr: "校際" });
    },
  },
  { label: "學分學程", value: "program" },
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
];

function filterMutatou(updateValue) {
  const filter = filters.value;
  for (const key in filter) {
    if (key === "global") {
      continue; // Skip global filter
    }
    if (key in updateValue) {
      filter[key].value = updateValue[key];
    } else {
      filter[key].value = null;
    }
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
  const timeLocation = [];
  for (const [key, _] of Object.entries(time)) {
    const [day, period] = key.split(" ");
    timeLocation.push(`${day} ${period}`);
  }
  return timeLocation.join("/");
}

function locationFormatter(location) {
  // all same => A, else => A/B/...
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

function onSelectionChanged(event) {
  if (gridApi.value) {
    selectedRows.value = gridApi.value.getSelectedRows(); // 更新選中的行數據
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC:wght@300;400;700&display=swap");

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tabs-container {
  margin: 0.5rem auto 1rem auto;
  width: clamp(0px, 100%, 650px);

  @media screen and (min-width: 650px) {
    .p-tablist-tab-list {
      justify-content: center;
    }
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
  width: 100%;
  max-width: 48rem;
  --p-inputtext-border-radius: 25px;
}

.p-datatable-header {
  border-radius: 0.5rem 0.5rem 0 0;
}

.p-datatable-table-container {
  scrollbar-width: none;
}

.custom-row-style {
  --ag-odd-row-background-color: color-mix(
    in srgb,
    var(--ag-background-color),
    #c0c0c0 10%
  );
  div,
  a,
  input {
    white-space: pre-line;
    line-height: normal;
    align-content: center;
  }
  a {
    color: var(--ag-header-foreground-color);
  }
}

[class*="ag-theme-"] {
  font-family: "LXGW WenKai Mono TC", monospace;
}

.ag-header-row {
  white-space: pre-line;
  font-weight: bold;
}

.ag-checkbox-input-wrapper {
  display: flex;
}
</style>
