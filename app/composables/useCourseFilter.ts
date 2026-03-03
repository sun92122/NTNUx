import type { ColumnFiltersState, Row } from "@tanstack/vue-table";

export function useCourseFilter() {
  const filters = useState<Record<string, any>>(
    "courseTableFilters",
    () => ({}),
  );
  const columnFilters = computed<ColumnFiltersState>(() => {
    return Object.entries(filters.value).map(([id, value]) => ({
      id,
      value,
    }));
  });
  const globalFilter = useState<string>("courseTableGlobalFilter", () => "");
  return {
    filters,
    columnFilters,
    globalFilter,
  };
}

export function updateGlobalFilterByParameter(parameter: string) {
  const globalFilter = useState<string>("courseTableGlobalFilter", () => "");
  // split by '+', join by space, and set to globalFilter
  globalFilter.value = parameter.split("+").join(" ");
}

export function updateGlobalFilterByInput(input: string) {
  const globalFilter = useState<string>("courseTableGlobalFilter", () => "");
  globalFilter.value = input;
}

export function getGlobalFilterInput() {
  const globalFilter = useState<string>("courseTableGlobalFilter", () => "");
  return globalFilter.value;
}

export function globalFilterFunction(
  row: any,
  columnId: string,
  filterValue: string,
) {
  // split by space, if any of the words is included in "some" of the columns, return true
  // some: id, name, teacher, full_name_en, course_code
  const words = filterValue.toLowerCase().split(" ");
  return words.some((word) => {
    if (word.startsWith("$")) {
      const [col, s] = word.slice(1)?.split(":") || [];
      if (col && s) {
        return row.original[col]?.toLowerCase().includes(s);
      }
    }
    return (
      row.original.id.toLowerCase().includes(word) ||
      row.original.name.toLowerCase().includes(word) ||
      row.original.teacher.toLowerCase().includes(word) ||
      row.original.full_name_en.toLowerCase().includes(word) ||
      row.original.course_code.toLowerCase().includes(word)
    );
  });
}

const deptCodeToClassMap: Record<string, string[]> = {
  U: ["7", "9"],
  M: ["7", "8", "9"],
  D: ["7", "8"],
} as const;
export function deptFilterFunction(
  row: any,
  columnId: string,
  filterValue: string[],
) {
  const fuzzyClassKind = useState<Boolean>(
    "courseTableFuzzyClassKind",
    () => true,
  );
  // if filterValue is empty, return true
  if (filterValue.length === 0) {
    return true;
  }
  // if row.original.dept is in filterValue.value, return true
  return filterValue.some((item) => {
    return (
      item === row.original.department_code ||
      (fuzzyClassKind.value &&
        item.length > 2 &&
        item[0] !== "Z" &&
        row.original.department_code.length > 2 &&
        item.slice(-2) === row.original.department_code.slice(-2) &&
        (deptCodeToClassMap[item.slice(-3, -2)] || []).includes(
          row.original.class_kind,
        ))
    );
  });
}

// filter: array of string, row value: string with "/" separator
// return true if any of the filter values is included in the row value
// if 'all' is included in the filter value, and the row value is not empty, return true
export function arrayContainsStringFilterFunction(
  row: Row<any>,
  columnId: string,
  filterValue: string[],
) {
  // if filterValue is empty, return true
  if (filterValue.length === 0) {
    return true;
  }

  const rowValue = row.getValue(columnId);

  if (typeof rowValue !== "string") {
    return false;
  }

  return filterValue.some((item) => {
    if (item === "all" && rowValue !== "") {
      return true;
    }
    return rowValue.split("/").includes(item);
  });
}

export function addColumnFilter(
  columnId: string,
  value: boolean | string | number | string[],
) {
  const filters = useState<Record<string, any>>(
    "courseTableFilters",
    () => ({}),
  );
  filters.value[columnId] = value;
}

export function removeColumnFilter(columnId: string) {
  const filters = useState<Record<string, any>>(
    "courseTableFilters",
    () => ({}),
  );
  delete filters.value[columnId];
}

export function clearAndSetAllFilters(filters: Record<string, any>) {
  const allFilters = useState<Record<string, any>>(
    "courseTableFilters",
    () => ({}),
  );
  allFilters.value = filters;
}
