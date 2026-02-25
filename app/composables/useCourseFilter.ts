import { type ColumnFiltersState } from "@tanstack/vue-table";

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
    return (
      row.original.id.toLowerCase().includes(word) ||
      row.original.name.toLowerCase().includes(word) ||
      row.original.teacher.toLowerCase().includes(word) ||
      row.original.full_name_en.toLowerCase().includes(word) ||
      row.original.course_code.toLowerCase().includes(word)
    );
  });
}

export function addBooleanColumnFilter(columnId: string, value: boolean) {
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
