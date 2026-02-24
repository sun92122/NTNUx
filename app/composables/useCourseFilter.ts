import { type ColumnFiltersState } from "@tanstack/vue-table";

export function useCourseFilter() {
  const filters = useState<ColumnFiltersState>("courseTableFilters", () => []);
  const globalFilter = useState<string>("courseTableGlobalFilter", () => "");
  return {
    filters,
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
