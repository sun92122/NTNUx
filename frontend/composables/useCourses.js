export function useCourses() {
  const terms = useState("terms", () => []);
  const currentTerm = useState("currentTerm", () => null);
  const loadTermData = useState("loadTermData");
  const rowDatas = useState("rowDatas", () => ({}));
  const rowData = useState("rowData", () => []);
  const loading = useState("loading", () => true);

  const defultGlobalFilterFields = ["course_name", "teacher", "serial_no"];

  const fetchData = async (i) => {
    const res = await fetch(`data/${currentTerm.value}/${i}.min.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length === 0) return null;

    return data.map((item) => ({
      ...item,
      course_name: item.chn_name.replace(/<\/br>.*/g, ""),
      time: timeFormatter(item.time_loc),
      location: locationFormatter(item.time_loc),
      teacher: teacherNameFormatter(item.teacher),
      generalCore: item.generalCore.join("/"),
    }));
  };

  const fetchAllData = async () => {
    const fetchPromises = [];
    for (let i = 0; i < 10; i++) {
      fetchPromises.push(fetchData(i));
    }

    for await (const page of fetchPromises) {
      if (!page) continue;
      rowData.value = rowData.value.concat(page);
      loading.value = false;
    }
  };

  const reloadCurrentTerm = async () => {
    loading.value = true;

    if (rowDatas.value[currentTerm.value]) {
      rowData.value = rowDatas.value[currentTerm.value];
      loading.value = false;
      return;
    }

    rowData.value = [];
    await fetchAllData();
    rowDatas.value[currentTerm.value] = rowData.value;
  };

  const initTermData = async (route) => {
    if (terms.value.length > 0) {
      loading.value = false;
      return;
    }
    const termResp = await fetch("/data/terms.json");
    const termRespData = await termResp.json();
    terms.value = termRespData.terms;

    currentTerm.value = route.query.term;
    if (!currentTerm.value || terms.value.indexOf(currentTerm.value) === -1) {
      currentTerm.value = terms.value[termRespData.defaultIndex];
    }

    loadTermData.value = reloadCurrentTerm;
    await reloadCurrentTerm();
  };

  return {
    terms,
    currentTerm,
    rowData,
    loading,
    reloadCurrentTerm,
    defultGlobalFilterFields,
    initTermData,
  };
}

function teacherNameFormatter(teacher) {
  return teacher.replace("", "温");
}

function timeFormatter(time) {
  if (typeof time === "string") return time;
  return Object.entries(time)
    .map(([k, _]) => k)
    .join("/");
}

function locationFormatter(location) {
  if (typeof location === "string") return null;
  const values = Object.values(location).filter((v) => v !== "");
  const unique = [...new Set(values)];
  return unique.length === 1 ? unique[0] : values.join("/");
}
