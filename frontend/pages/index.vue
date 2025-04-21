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

  <AgGridVue
    style="width: 100%; height: 500px"
    class="ag-theme-quartz"
    :localeText="AG_GRID_LOCALE_TW"
    :columnDefs="colDefs"
    :rowData="rowData"
    :pagination="false"
    :rowSelection="rowSelection"
    @selection-changed="onSelectionChanged"
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
</template>

<script>
import { ref } from "vue";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { AG_GRID_LOCALE_TW } from "@ag-grid-community/locale";

export default {
  name: "App",
  components: {
    AgGridVue, // Add Vue Data Grid component
  },
  methods: {
    onSelectionChanged(event) {
      this.selectedRows = event.api.getSelectedRows();
    },
    onTermChange(event) {
      this.reloadCurrentTerm(); // 重新載入當前學期資料
    },
  },
  setup() {
    const terms = ref([]);
    const currentTerm = ref();

    const downloadDone = ref(false);

    // Row Data: The data to be displayed.
    const rowDatas = ref({});
    const rowData = ref([]);

    const selectedRows = ref([]); // 用於存儲選中的行數據

    // Column Definitions: Defines the columns to be displayed.
    const colDefs = ref([
      {
        field: "serial_no",
        headerName: "開課序號",
        width: 100,
      },
      {
        field: "chn_name",
        headerName: "課程名稱",
        cellRenderer: (params) => (params.value = params.value),
        cellStyle: { whiteSpace: "pre", wrapText: true, autoHeight: true },
      },
      { field: "dept_chiabbr", headerName: "開課單位", width: 120 },
      { field: "time_inf", headerName: "時間地點" },
      { field: "time", headerName: "時間" },
      {
        field: "credit",
        headerName: "學分",
        valueFormatter: (params) => Math.floor(params.value),
        width: 80,
      },
      {
        headerName: "URL",
        valueGetter: urlValueGetter,
        cellRenderer: (params) => {
          return `<a href="${params.value}" target="_blank">連結</a>`;
        },
      },
    ]);

    const rowSelection = {
      mode: "multiRow",
      checkboxes: true,
      headerCheckbox: false,
      enableSelectionWithoutKeys: true,
    };

    onMounted(async () => {
      const termResp = await fetch("data/terms.json");
      terms.value = await termResp.json();
      currentTerm.value = terms.value[0]; // 預設當前學期為第一個學期

      reloadCurrentTerm(); // 載入當前學期資料
    });

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
      downloadDone.value = false;
      for (const page of pages) {
        rowData.value = rowData.value.concat(page);
      }
      downloadDone.value = true;

      rowDatas.value[currentTerm.value] = rowData.value; // 儲存當前學期資料
    };

    function urlValueGetter(params) {
      const data = params.data;
      return (
        "https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/SyllabusCtrl?" +
        "year=" +
        data.acadm_year +
        "&term=" +
        data.acadm_term +
        "&courseCode=" +
        data.course_code +
        "&courseGroup=" +
        data.course_group +
        "&deptCode=" +
        data.dept_code +
        "&formS=" +
        data.form_s +
        "&classes1=" +
        data.classes +
        "&deptGroup=" +
        data.dept_group_name
      );
    }

    return {
      rowData,
      colDefs,
      selectedRows,
      AG_GRID_LOCALE_TW,
      rowSelection,
      terms,
      currentTerm,
      fetchData,
      reloadCurrentTerm,
    };
  },
};
</script>
