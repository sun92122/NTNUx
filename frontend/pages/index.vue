<template>
  <div class="tabs-container">
    <Tabs value="quick" scrollable>
      <TabList>
        <Tab
          v-for="tab in [
            { label: '快速搜尋', value: 'quick' },
            { label: '通識', value: 'general' },
            { label: '共同', value: 'common' },
            { label: '國防', value: '國防' },
            { label: '體育', value: 'physical' },
            { label: '校際', value: 'interschool' },
            { label: '學分學程', value: 'program' },
            { label: '英文授課', value: 'EMI' },
            { label: '英文三', value: 'english' },
          ]"
          :key="tab.value"
          :label="tab.label"
          :value="tab.value"
        >
          {{ tab.label }}
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
        scrollHeight="80vh"
        :rows="50"
        :rowsPerPageOptions="[10, 20, 50, 100]"
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

const config = useRuntimeConfig();
const isCloudflare = config.public.isCloudflare; // 判斷是否為 Cloudflare 環境

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

const gridApi = shallowRef(null);

const filters = ref({
  global: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS,
  },
});

const isShowSchedule = ref(false); // 控制課表顯示的變數

// Row Data: The data to be displayed.
const rowDatas = ref({});
const rowData = ref([]);

const selectedRows = ref([]); // 用於存儲選中的行數據

const fetchData = async (i) => {
  // Fetch data from the server
  const response = await fetch(
    "data/" + currentTerm.value + "_" + i + ".min.json"
  );
  return response.json();
};

const fetchDataCloudflare = async () => {
  // Fetch data from the server
  const response = await fetch("data/" + currentTerm.value + ".min.json");
  return response.json();
};

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

const reloadCurrentTerm = async () => {
  // check if the current term data in rowDatas
  if (rowDatas.value[currentTerm.value]) {
    rowData.value = rowDatas.value[currentTerm.value]; // 直接使用已載入的資料
    return;
  }

  rowData.value = []; // 清空資料
  selectedRows.value = []; // 清空選取的資料

  // 重新載入資料
  if (isCloudflare) {
    rowData.value = await fetchDataCloudflare(); // 直接載入當前學期資料
  } else {
    const term_info = await fetchData(0);
    const maxPageNum = term_info.total;

    const fetchPromises = [];
    for (let i = 1; i <= maxPageNum; i++) {
      fetchPromises.push(fetchData(i));
    }

    // 並行下載所有分頁資料
    const pages = await Promise.all(fetchPromises);

    // 合併結果
    for (const page of pages) {
      rowData.value = rowData.value.concat(page);
    }
  }

  // 格式化資料
  rowData.value = rowData.value.map((data) => {
    return {
      ...data,
      course_name: data.chn_name.replace(/<\/br>.*/g, ""),
      time: timeFormatter(data.time_loc),
      location: locationFormatter(data.time_loc),
      teacher: teacherNameFormatter(data.teacher),
    };
  });

  rowDatas.value[currentTerm.value] = rowData.value; // 儲存當前學期資料

  updateMenubar.value(); // 更新選單欄的狀態
};

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
