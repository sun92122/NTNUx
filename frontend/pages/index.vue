<template>
  <!-- 選擇當前學期 -->
  <div style="margin-bottom: 10px">
    <label for="semester">選擇學期: </label>
    <select id="semester" v-model="currentSemester" @change="onSemesterChange">
      <option v-for="semester in semesters" :key="semester" :value="semester">
        {{ semester }}
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
    :rowSelection="'multiple'"
    :rowMultiSelectWithClick="true"
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
    onSemesterChange(event) {
      this.rowData = []; // 清空資料
      this.selectedRows = []; // 清空選取的資料

      // 重新載入資料
      this.fetchData(0).then((semester_info) => {
        const maxPageNum = semester_info.total;
        for (let i = 1; i <= maxPageNum; i++) {
          this.fetchData(i).then((data) => {
            this.rowData = this.rowData.concat(data);
          });
        }
      });
    },
  },
  setup() {
    const semesters = ref([]);
    const currentSemester = ref();

    // Row Data: The data to be displayed.
    const rowData = ref([]);

    // Column Definitions: Defines the columns to be displayed.
    const colDefs = ref([
      {
        field: "serial_no",
        headerName: "開課序號",
        checkboxSelection: true,
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
    ]);

    onMounted(async () => {
      const semesterResp = await fetch("data/semesters.json");
      semesters.value = await semesterResp.json();
      currentSemester.value = semesters.value[0]; // 預設當前學期為第一個學期

      rowData.value = [];

      // get max page number
      const semester_info = await fetchData(0);
      const maxPageNum = semester_info.total;

      for (let i = 1; i <= maxPageNum; i++) {
        const data = await fetchData(i);
        rowData.value = rowData.value.concat(data);
      }
    });

    const fetchData = async (i) => {
      // Fetch data from the server
      const response = await fetch(
        "data/" + currentSemester.value + "_" + i + ".min.json"
      );
      // const response = await fetch("https://www.ag-grid.com/example-assets/space-mission-data.json");
      return response.json();
    };

    const selectedRows = ref([]);

    return {
      rowData,
      colDefs,
      selectedRows,
      AG_GRID_LOCALE_TW,
      semesters,
      currentSemester,
      fetchData,
    };
  },
};
</script>
