import { computed, watch } from "vue";
import { useState } from "#app";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/vue-table";

import { useCourseFilter, globalFilterFunction } from "./useCourseFilter";

export interface Course {
  year: string; // 學年 (y)
  term: string; // 學期 (t)
  id: string; // 開課序號 (s)
  name: string; // 課程名稱 (n)
  full_name: string; // 原始中文名稱 (cn)
  full_name_en: string; // 英文課程名稱 (en)
  course_code: string; // 課程代碼 (cc)
  course_group: string; // 課程組別 (cg)
  teacher: string; // 授課教師 (te)
  credits: number; // 學分 (cr)
  class_kind: string; // 開課種類（1：甲/2：乙/3：丙/4：丁/7：大碩博/8：碩博/9：大碩）(cl)
  department: string; // 開課單位 (d)
  department_code: string; // 開課單位代號 (dc)
  department_group: string; // 開課單位組別 (dg)
  grade: string; // 開課年級 (fs)

  count_enrolled: number; // 選課人數 (co)
  count_used_authorized: number; // 已使用授權碼數量 (au)
  count_enrolled_without_authorized: number; // 非授權碼選課人數 (ce)
  limit_enrollment: number; // 選課人數上限 (lh)
  limit_authorized: number; // 授權碼數量 (a)
  limit_system: number; // 系統各校開放名額 (l)

  time: string[]; // 時間（列表）(tl)
  location: string; // 地點（"/" 分隔）(lc)
  time_location: string[]; // 時間地點 (列表，原始資訊) (ti)
  time_location_list: string[]; // 時間地點（列表）(tll)
  time_location_slash: string; // 時間地點（"/" 分隔）(tls)

  intensive: boolean; // 密集課程（Y/None）(i)
  english_teaching: boolean; // 英文授課（是/None）(et)
  digital_course: boolean; // 數位課程（N/1）(rt)
  general_education: string; // 通識領域（"/" 分隔）(gc)
  credit_program: string[]; // 學分學程（"/" 分隔） (p)
  course_category: string; // 課程類別（通、選、必）(oc)
  restriction: string; // 限修說明 (r)
  gender_restriction: string; // 性別限修（F/M/None）(rg)
  comment: string; // 說明 (c)
}

type TermData = Course[];

interface AllTermsData {
  [term: string]: TermData;
}

export function useCourseTable(term: string | null = null) {
  const defaultTerm = useState<string>(
    "defaultTerm",
    () => process.env.NTNUX_DEFAULT_TERM || "",
  );
  const currentTerm = useState<string>(
    "currentTerm",
    () => term || defaultTerm.value,
  );

  const dataAllTerms = useState<AllTermsData>("dataAllTerms", () => ({}));
  const denseDataAllTerms = useState<AllTermsData>(
    "denseDataAllTerms",
    () => ({}),
  );
  const updateTimeAllTerms = useState<Record<string, string>>(
    "updateTimeAllTerms",
    () => ({}),
  );
  const currentTermData = useState<TermData>("currentTermData", () => []);
  const currentTermDenseData = useState<TermData>(
    "currentTermDenseData",
    () => [],
  );
  const currentTermUpdateTime = computed<string>(() => {
    return updateTimeAllTerms.value[currentTerm.value] || "unknown";
  });

  const { refresh, refreshDenseData, refreshUpdateTime } = fetchTermData(
    currentTerm.value,
  );

  async function refreshAll() {
    await refresh();
    await refreshDenseData();
    await refreshUpdateTime();
    console.log(`Data for term ${currentTerm.value} refreshed.`);
  }

  // watch
  watch(currentTerm, async () => {
    console.log(`Current term changed to ${currentTerm.value}`);
    if (currentTerm.value && !dataAllTerms.value[currentTerm.value]) {
      await refreshAll();
    } else if (currentTerm.value && dataAllTerms.value[currentTerm.value]) {
      currentTermData.value = dataAllTerms.value[currentTerm.value] || [];
      currentTermDenseData.value =
        denseDataAllTerms.value[currentTerm.value] || [];
    }
  });

  // build table options
  const columnHelper = createColumnHelper<Course>();
  const columns = [
    columnHelper.display({
      id: "course",
    }),
    columnHelper.group({
      id: "info_for_filter",
      columns: [
        columnHelper.accessor("id", {}),
        columnHelper.accessor("name", {}),
        columnHelper.accessor("full_name_en", {}),
        columnHelper.accessor("course_code", {}),
        columnHelper.accessor("teacher", {}),
      ],
    }),
  ];
  const columnVisibliity = ref({
    info_for_filter: false,
  });
  const { filters, globalFilter } = useCourseFilter();
  const tableOptions = {
    data: computed(() => currentTermData.value),
    columns,
    state: {
      get columnFilters() {
        return filters.value;
      },
      get globalFilter() {
        return globalFilter.value;
      },
      get columnVisibility() {
        return columnVisibliity.value;
      },
    },
    onColumnFiltersChange: (updater: any) => {
      filters.value =
        typeof updater === "function" ? updater(filters.value) : updater;
    },
    onGlobalFilterChange: (updater: any) => {
      globalFilter.value =
        typeof updater === "function" ? updater(globalFilter.value) : updater;
    },
    onColumnVisibilityChange: (updater: any) => {
      columnVisibliity.value =
        typeof updater === "function"
          ? updater(columnVisibliity.value)
          : updater;
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: globalFilterFunction,
  };

  return {
    dataAllTerms,
    currentTerm,
    currentTermData,
    currentTermDenseData,
    currentTermUpdateTime,
    tableOptions,
    refreshAll,
  };
}

export function prefetchDefaultTermData(lazy: boolean = true) {
  const defaultTerm = useState<string>(
    "defaultTerm",
    () => process.env.NTNUX_DEFAULT_TERM || "",
  );
  const dataAllTerms = useState<AllTermsData>("dataAllTerms", () => ({}));
  if (defaultTerm.value && !dataAllTerms.value[defaultTerm.value]) {
    fetchTermData(defaultTerm.value, lazy).refresh();
  }
}

function fetchTermData(term: string, lazy: boolean = false) {
  const dataAllTerms = useState<AllTermsData>("dataAllTerms", () => ({}));
  const currentTermData = useState<TermData>("currentTermData", () => []);
  const denseDataAllTerms = useState<AllTermsData>(
    "denseDataAllTerms",
    () => ({}),
  );
  const currentTermDenseData = useState<TermData>(
    "currentTermDenseData",
    () => [],
  );
  const updateTimeAllTerms = useState<Record<string, string>>(
    "updateTimeAllTerms",
    () => ({}),
  );

  const { refresh } = useFetch<Course[]>(`/data/${term}.json`, {
    server: false, // only fetch on client side
    lazy: lazy, // lazy fetch if specified
    onResponse: ({ request, response, options }) => {
      const rawData = response._data;
      if (rawData) {
        const formattedData = rawData.map((item: any) =>
          formatCourseData(item),
        );
        currentTermData.value = formattedData;
        dataAllTerms.value[term] = formattedData;
      }
    },
  });
  // fetch for dense data
  const { refresh: refreshDenseData } = useLazyFetch<Course[]>(
    `/data/${term}/dense.json`,
    {
      server: false, // only fetch on client side
      onResponse: ({ request, response, options }) => {
        const rawData = response._data;
        if (rawData) {
          const formattedData = rawData; // already formatted in backend
          currentTermDenseData.value = formattedData;
          denseDataAllTerms.value[term] = formattedData;
        }
      },
    },
  );
  // lazy fetch for update time
  const { refresh: refreshUpdateTime } = useLazyFetch<{ last_update: string }>(
    `/data/${term}/last_update.json`,
    {
      server: false, // only fetch on client side
      onResponse: ({ request, response, options }) => {
        const data = response._data;
        updateTimeAllTerms.value[term] = data?.last_update || "unknown";
      },
    },
  );

  return {
    refresh,
    refreshDenseData,
    refreshUpdateTime,
  };
}

function formatCourseData(rawData: any): Course {
  return {
    year: rawData.y || "", // required
    term: rawData.t || "", // required
    id: rawData.s || "",
    name: rawData.n || "",
    full_name: rawData.cn || "",
    full_name_en: rawData.en || "",
    course_code: rawData.cc || "", // required
    course_group: rawData.cg || "",
    teacher: rawData.te || "",
    credits: rawData.cr ? Number(rawData.cr) : 0,
    class_kind: rawData.cl || "",
    department: rawData.d || "",
    department_code: rawData.dc || "",
    department_group: rawData.dg || "",
    grade: rawData.fs || "",

    count_enrolled: rawData.co ? Number(rawData.co) : 0,
    count_used_authorized: rawData.au ? Number(rawData.au) : 0,
    count_enrolled_without_authorized: rawData.ce ? Number(rawData.ce) : 0,
    limit_enrollment: rawData.lh ? Number(rawData.lh) : 0,
    limit_authorized: rawData.a ? Number(rawData.a) : 0,
    limit_system: rawData.l ? Number(rawData.l) : 0,

    time: Array.isArray(rawData.tl) ? rawData.tl : [],
    location: rawData.lc || "",
    time_location: Array.isArray(rawData.ti) ? rawData.ti : [],
    time_location_list: Array.isArray(rawData.tll) ? rawData.tll : [],
    time_location_slash: rawData.tls || "",

    intensive: rawData.i === "Y",
    english_teaching: rawData.et === "是",
    digital_course: rawData.rt === "1",
    general_education: rawData.gc || "",
    credit_program: rawData.p ? rawData.p.split("/") : [],
    course_category: rawData.oc || "",
    restriction: rawData.r || "",
    gender_restriction: rawData.rg || "",
    comment: rawData.c || "",
  };
}
