<template>
  <AgGridVue
    :rowData="rowData"
    :columnDefs="colDefs"
    style="height: 500px"
    class="ag-theme-quartz"
    :localeText="AG_GRID_LOCALE_TW"
  >
  </AgGridVue>
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
  setup() {
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
      {
        field: "credit",
        headerName: "學分",
        valueFormatter: (params) => Math.floor(params.value),
        width: 80,
      },
    ]);

    onMounted(async () => {
      rowData.value = [];
      // 0-45
      for (let i = 0; i < 46; i++) {
        const data = await fetchData(i);
        rowData.value = rowData.value.concat(data);
      }
    });

    const fetchData = async (i) => {
      // Fetch data from the server
      const response = await fetch("response_content_" + i + ".min.json");
      // const response = await fetch("https://www.ag-grid.com/example-assets/space-mission-data.json");
      return response.json();
    };

    return {
      rowData,
      colDefs,
      AG_GRID_LOCALE_TW,
    };
  },
};
</script>
