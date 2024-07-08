<template>
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

    const selectedRows = ref([]);

    return {
      rowData,
      colDefs,
      selectedRows,
      AG_GRID_LOCALE_TW,
    };
  },
};
</script>
