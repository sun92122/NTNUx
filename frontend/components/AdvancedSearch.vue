<template>
  <div class="advanced-search-box">
    <div class="advanced-search-box-item">
      <p>上課時間</p>
      <TimeSelectionTable />
    </div>
    <div class="advanced-search-box-item">
      <div
        v-for="(filterValues, filterKey) in advancedSearchFilters"
        :key="filterKey"
      >
        <p>{{ filterKey }}</p>
        <div
          class="advanced-search-options"
          v-for="(filterValue, index) in filterValues"
          :key="index"
        >
          <Button
            v-for="(isSelected, option) in filterValue.value"
            :key="option"
            :severity="isSelected ? 'primary' : 'secondary'"
            :variant="isSelected ? 'contained' : 'outlined'"
            :label="String(option)"
            @click="
              () => {
                filterValue.value[option] = !isSelected;
                filterValue.onChange?.(filterValue.value);
              }
            "
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";

import { Button } from "primevue";

import { TimeSelectionTable } from "#components";

const filters = useState("filters");

const advancedSearchFilters = useState("advancedSearchFilters", () => ({
  上課地點: [
    {
      value: { 和平: false, 公館: false, 其他: false },
      onChange: (value) => {
        locationFilterHandler(value);
      },
    },
  ],
  上課形式: [
    {
      value: { 英文授課: false, 數位課程: false, 密集課程: false },
      onChange: (value) => {
        courseTypeFilterHandler(value);
      },
    },
  ],
  通識領域: [
    {
      value: {
        人文藝術: false,
        社會科學: false,
        自然科學: false,
        邏輯運算: false,
      },
      onChange: () => {
        generalFilterHandler();
      },
    },
    {
      value: { 學院共同課程: false, 跨域專業探索課程: false, 大學入門: false },
      onChange: () => {
        generalFilterHandler();
      },
    },
  ],
  學分數: [
    {
      value: { 1: false, 2: false, 3: false, 4: false, ">= 5": false },
      onChange: (value) => {
        creditFilterHandler(value);
      },
    },
  ],
}));

function updateFilters(updatefilter) {
  const updatedFilters = { ...filters.value, ...updatefilter };
  filters.value = updatedFilters;
}

function locationFilterHandler(location) {
  const hope = location.和平;
  const guan = location.公館;
  const other = location.其他;

  const locationFilter = {
    operator: "",
    constraints: [],
  };
  if (other) {
    locationFilter.operator = FilterOperator.AND;
    if (!hope) {
      locationFilter.constraints.push({
        value: "和平 ",
        matchMode: FilterMatchMode.NOT_CONTAINS,
      });
    }
    if (!guan) {
      locationFilter.constraints.push({
        value: "公館 ",
        matchMode: FilterMatchMode.NOT_CONTAINS,
      });
    }
  } else {
    locationFilter.operator = FilterOperator.OR;
    if (hope) {
      locationFilter.constraints.push({
        value: "和平 ",
        matchMode: FilterMatchMode.CONTAINS,
      });
    }
    if (guan) {
      locationFilter.constraints.push({
        value: "公館 ",
        matchMode: FilterMatchMode.CONTAINS,
      });
    }
  }

  updateFilters({
    time_inf: locationFilter,
  });
}

function courseTypeFilterHandler(courseType) {
  const english = courseType.英文授課;
  const digital = courseType.數位課程;
  const intensive = courseType.密集課程;

  if (english) {
    updateFilters({
      eng_teach: {
        operator: FilterOperator.OR,
        constraints: [{ value: "是", matchMode: FilterMatchMode.EQUALS }],
      },
    });
  } else {
    updateFilters({
      eng_teach: {
        operator: FilterOperator.OR,
        constraints: [],
      },
    });
  }

  if (digital) {
    updateFilters({
      comment: {
        operator: FilterOperator.OR,
        constraints: [
          { value: "◎數位課程", matchMode: FilterMatchMode.CONTAINS },
        ],
      },
    });
  } else {
    updateFilters({
      comment: {
        operator: FilterOperator.OR,
        constraints: [],
      },
    });
  }

  if (intensive) {
    updateFilters({
      time_inf: {
        operator: FilterOperator.OR,
        constraints: [
          { value: "◎密集課程", matchMode: FilterMatchMode.CONTAINS },
        ],
      },
    });
  } else {
    updateFilters({
      time_inf: {
        operator: FilterOperator.OR,
        constraints: [],
      },
    });
  }
}

function generalFilterHandler() {
  const generalFilter = {
    operator: FilterOperator.OR,
    constraints: [],
  };
  const generalMapping = {
    人文藝術: "A1UG",
    社會科學: "A2UG",
    自然科學: "A3UG",
    邏輯運算: "A4UG",
    學院共同課程: "B1UG",
    跨域專業探索課程: "B2UG",
    大學入門: "B3UG",
  };
  for (const [key, value] of Object.entries(generalMapping)) {
    if (
      advancedSearchFilters.value.通識領域[0].value[key] ||
      advancedSearchFilters.value.通識領域[1].value[key]
    ) {
      generalFilter.constraints.push({
        value: generalMapping[key],
        matchMode: FilterMatchMode.CONTAINS,
      });
    }
  }

  updateFilters({
    generalCore: generalFilter,
  });
}

function creditFilterHandler(credits) {
  const creditFilter = {
    operator: FilterOperator.OR,
    constraints: [],
  };
  if (credits["1"]) {
    creditFilter.constraints.push({
      value: "1",
      matchMode: FilterMatchMode.EQUALS,
    });
  }
  if (credits["2"]) {
    creditFilter.constraints.push({
      value: "2",
      matchMode: FilterMatchMode.EQUALS,
    });
  }
  if (credits["3"]) {
    creditFilter.constraints.push({
      value: "3",
      matchMode: FilterMatchMode.EQUALS,
    });
  }
  if (credits["4"]) {
    creditFilter.constraints.push({
      value: "4",
      matchMode: FilterMatchMode.EQUALS,
    });
  }
  if (credits[">= 5"]) {
    creditFilter.constraints.push({
      value: "5",
      matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
    });
  }

  updateFilters({
    credit: creditFilter,
  });
}
</script>

<style scoped lang="scss">
.advanced-search-box {
  padding: 0 1rem 1rem 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.advanced-search-box-item {
  flex: 1;
}

@media screen and (max-width: 770px) {
  .advanced-search-box {
    flex-direction: column;
  }
}

.advanced-search-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

p {
  margin: 0.5rem 0;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
