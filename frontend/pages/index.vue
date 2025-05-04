<template>
  <!-- 選擇當前學期 -->
  <div style="margin-bottom: 10px">
    <label for="term">選擇學期: </label>
    <select id="term" v-model="currentTerm" @change="onTermChange">
      <option v-for="term in terms" :key="term" :value="term">
        {{ term }}
      </option>
    </select>
  </div>

  <span class="button-group">
    <button @click="locationGongguan()">上課地點：公館</button>
  </span>

  <AgGridVue
    style="width: 100%; height: 500px"
    :class="`ag-theme-${darkMode ? 'quartz-dark' : 'quartz'}`"
    :localeText="AG_GRID_LOCALE_TW"
    :columnDefs="colDefs"
    :rowHeight="64"
    :defaultColDef="defaultColDef"
    :rowData="rowData"
    :pagination="false"
    :rowSelection="rowSelection"
    :grid-options="gridOptions"
    :autoSizeStrategy="autoSizeStrategy"
    :enableCellTextSelection="true"
    @selection-changed="onSelectionChanged"
    @grid-ready="onGridReady"
  >
  </AgGridVue>

  <!-- 顯示已完成載入數量 -->
  <div style="margin-top: 10px">
    <p>已完成載入 {{ rowData.length }} 筆資料</p>
  </div>

  <div>
    <h2>Selected Rows</h2>
    <ul>
      <li v-for="row in selectedRows" :key="row.serial_no">
        {{ row.serial_no }} -
        <text v-html="row.chn_name.replace('</br>', ' ')"></text>
      </li>
    </ul>
  </div>

  <Button @click="isShowSchedule = true">打開課表</Button>

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
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AG_GRID_LOCALE_TW } from "@ag-grid-community/locale";
import { FloatingSchedule } from "#components";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

onMounted(async () => {
  const termResp = await fetch("data/terms.json");
  terms.value = await termResp.json();
  currentTerm.value = terms.value[0]; // 預設當前學期為第一個學期

  reloadCurrentTerm(); // 載入當前學期資料
});

const darkMode = useState("darkMode");

const gridApi = shallowRef(null);

const terms = ref([]);
const currentTerm = ref();

const isShowSchedule = ref(false); // 控制課表顯示的變數

// Row Data: The data to be displayed.
const rowDatas = ref({});
const rowData = ref([]);

const selectedRows = ref([]); // 用於存儲選中的行數據

// Column Definitions: Defines the columns to be displayed.
const colDefs = ref([
  {
    field: "serial_no",
    headerName: "開課\n序號",
    filter: "agTextColumnFilter",
    sortable: false,
    maxWidth: 80,
  },
  {
    field: "course_code",
    headerName: "科目\n代碼",
    filter: "agTextColumnFilter",
maxWidth: 100,
  },
  {
    field: "chn_name",
    headerName: "課程名稱",
valueGetter: urlValueGetter,
    cellRenderer: (params) => {
      return `<a href="${params.value.url}" target="_blank">${params.value.name}</a>`;
    },
    filter: "agTextColumnFilter",
    filterValueGetter: (params) => {
      return params.data.chn_name.replace(/<\/br>/g, "\n");
    },
    maxWidth: 200,
    autoHeight: true,
    wrapText: true,
  },
  {
    field: "teacher",
    headerName: "教師",
    valueFormatter: (params) => {
      return params.value.replace("", "温");
    },
    filter: "agTextColumnFilter",
filterValueGetter: (params) => {
      return params.data.teacher.replace("", "温");
    },
    maxWidth: 100,
    autoHeight: true,
  },
  {
    field: "dept_chiabbr",
    headerName: "開課單位",
        filter: "agTextColumnFilter",
maxWidth: 150,
  },
  {
    field: "time_loc",
    headerName: "時間地點",
valueGetter: timeLocValueGetter,
    filter: "agTextColumnFilter",
  maxWidth: 200,
    autoHeight: true,
    wrapText: true,
    cellStyle: { "font-size": "small" },
  },
  {
    field: "credit",
    headerName: "學分",
    valueFormatter: (params) => Math.floor(params.value),
        filter: "agNumberColumnFilter",
maxWidth: 80,
  },
  {
    headerName: "URL",
    valueGetter: urlValueGetter,
    cellRenderer: (params) => {
      return `<a href="${params.value}" target="_blank">連結</a>`;
    },
    filter: false,
  },
]);

const defaultColDef = ref({
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
  flex: 1,
  minWidth: 50,
});

const rowSelection = {
  mode: "multiRow",
  checkboxes: true,
  headerCheckbox: false,
  enableSelectionWithoutKeys: true,
};

const autoSizeStrategy = ref({
  type: "fitCellContents",
  colIds: ["serial_no", "course_code", "dept_chiabbr", "credit"],
});

const onGridReady = (params) => {
  gridApi.value = params.api;
};

const fetchData = async (i) => {
  // Fetch data from the server
  const response = await fetch(
    "data/" + currentTerm.value + "_" + i + ".min.json"
  );
  return response.json();
};

const reloadCurrentTerm = async () => {
  // check if the current term data in rowDatas
  if (rowDatas.value[currentTerm.value]) {
    rowData.value = rowDatas.value[currentTerm.value]; // 直接使用已載入的資料
    return;
  }

  rowData.value = []; // 清空資料
  selectedRows.value = []; // 清空選取的資料

  // 重新載入資料
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

  rowDatas.value[currentTerm.value] = rowData.value; // 儲存當前學期資料
};

function urlValueGetter(params) {
  const data = params.data;
  return {
    name: data.chn_name.replace(/<\/br>/g, "\n"),
    url: `https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/SyllabusCtrl?year=${data.acadm_year}&term=${data.acadm_term}&courseCode=${data.course_code}&courseGroup=${data.course_group}&deptCode=${data.dept_code}&formS=${data.form_s}&classes1=${data.classes}&deptGroup=${data.dept_group_name}`,
  };
}

function timeLocValueGetter(params) {
  const data = params.data.time_loc;
  if (typeof data === "object") {
    return Object.entries(data)
      .map(([key, value]) => `${key} ${value}`)
      .join("\n");
  } else if (typeof data === "string") {
    return data.replace(/<\/br>/g, "\n");
  }
  return data;
}

function locationGongguan(params) {
  if (gridApi.value) {
    gridApi.value
      .setColumnFilterModel("time_inf", {
        type: "contains",
        filter: "公館",
      })
      .then(() => {
        gridApi.value.onFilterChanged();
      });
  }
}

function onSelectionChanged(event) {
  if (gridApi.value) {
    selectedRows.value = gridApi.value.getSelectedRows(); // 更新選中的行數據
  }
}

function onTermChange(event) {
  reloadCurrentTerm(); // 重新載入當前學期資料
}

const gridOptions = ref({
  rowClass: "custom-row-style",
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC:wght@300;400;700&display=swap");

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
  font-size: "normal";
}

.ag-header-row {
  white-space: pre-line;
  font-weight: bold;
}

.ag-checkbox-input-wrapper {
  display: flex;
}
</style>
