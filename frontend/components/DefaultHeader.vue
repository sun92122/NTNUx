<template>
  <Menubar :model="items" :sticky="true" breakpoint="340px">
    <template #start>
      <Button
        class="p-button-rounded p-button-secondary me-2"
        as="router-link"
        to="/home"
        aria-label="Home"
      >
        <template #icon>
          <img src="/favicon.svg" alt="Home Icon" width="24" height="24" />
        </template>
      </Button>
    </template>

    <template #end>
      <div class="menubar-end">
        <ToggleSwitch
          v-model="darkMode"
          class="me-2"
          @change="toggleDarkMode"
          aria-label="Toggle Dark Mode"
          :dt="toggleSwitchDt"
          v-if="windowWidth > 600"
        >
          <template #handle>
            <i :class="{ 'pi pi-sun': !darkMode, 'pi pi-moon': darkMode }"></i>
          </template>
        </ToggleSwitch>
        <Button
          v-else
          :icon="darkMode ? 'pi pi-moon' : 'pi pi-sun'"
          :severity="darkMode ? 'secondary' : 'primary'"
          class="p-button-rounded p-button-secondary me-2"
          @click="
            () => {
              darkMode = !darkMode;
              toggleDarkMode();
            }
          "
          aria-label="Toggle Dark Mode"
        ></Button>
        <Button
          icon="pi pi-github"
          class="p-button-rounded p-button-secondary"
          as="a"
          href="https://github.com/sun92122/NTNUx"
          target="_blank"
          aria-label="Github"
        ></Button>
      </div>
    </template>
  </Menubar>
</template>

<script setup>
import { Menubar, Button, ToggleSwitch } from "primevue";

import { FilterMatchMode } from "@primevue/core/api";

onMounted(() => {
  updateMenubar.value = updateMenubarItems;
});

const { terms, currentTerm } = useCourses();

const { selectedCourses, selectedRows, windowWidth } = useSelectCourse();

const updateMenubar = useState("updateMenubar");
const loadTermData = useState("loadTermData");
const deptLists = useState("deptLists", () => ({}));
const deptList = useState("deptList");
const isShowSchedule = useState("isShowSchedule", () => false);

const darkMode = useState("darkMode", () => false);
const toggleDarkMode = () => {
  if (darkMode.value) {
    document.documentElement.classList.add("dark-mode-toggle");
  } else {
    document.documentElement.classList.remove("dark-mode-toggle");
  }
};

const toggleSwitchDt = ref({
  width: "3.5rem",
  height: "2rem",
  handle: {
    size: "1.5rem",
    checked: {
      color: "#FFFFFF",
      background: "#000000",
      hover: {
        color: "#FFFFFF",
        background: "#000000",
      },
    },
  },
  checked: {
    background: "#FFFFFF",
    hover: {
      background: "#FFFFFF",
    },
  },
});

const items = ref([
  {
    label: "課表",
    icon: "pi pi-fw pi-calendar",
    command: () => {
      isShowSchedule.value = true;
    },
  },
  {
    label: "選擇學期",
    icon: "pi pi-fw pi-book",
    items: [],
  },
]);

function updateMenubarItems() {
  const termLabelItem = items.value[1];

  if (!deptList.value) {
    deptList.value = getDeptList(useState("rowData").value);
    deptLists.value[currentTerm.value] = deptList.value;
  }

  // 更新學期選單
  termLabelItem.items = terms.value.map((term) => ({
    label: term,
    items: [1, 2, 3].map((subTerm) => ({
      label: ["1", "2", "暑期"][subTerm - 1],
      command: () => {
        currentTerm.value = `${term}-${subTerm}`;
        selectedRows.value = selectedCourses.value[currentTerm.value] || {};
        selectedCourses.value[currentTerm.value] = selectedRows.value;
        deptList.value =
          deptLists.value[currentTerm.value] ||
          getDeptList(useState("rowData").value);
        deptLists.value[currentTerm.value] = deptList.value;
        loadTermData.value();
        termLabelItem.label =
          windowWidth.value > 380
            ? `學期：${term}-${["1", "2", "暑期"][subTerm - 1]}`
            : `${term}-${["1", "2", "暑期"][subTerm - 1]}`;
      },
    })),
  }));
  // 更新學期顯示
  if (!currentTerm.value) {
    termLabelItem.label = "選擇學期";
    return;
  }
  termLabelItem.label =
    windowWidth.value > 380 ? `學期：${currentTerm.value}` : currentTerm.value;
}

function getDeptList(data) {
  const collegeMap = {
    "": "其他",
    E: "教育學院",
    L: "文學院",
    S: "理學院",
    T: "藝術學院",
    H: "科技學院",
    A: "運休學院",
    I: "國社學院",
    M: "音樂學院",
    O: "管理學院",
    C: "產創學院",
    Z: "學程",
  };
  const deptSet = {};
  data.forEach((course) => {
    const deptCode = course.dept_code;
    const deptChiaAbbr = `${deptCode} ${course.dept_chiabbr}`;

    // 非英文開頭或長度不是1或4碼，歸類為 other
    if (
      !/^[A-Za-z]/.test(deptCode) ||
      (deptCode.length !== 1 && deptCode.length !== 4)
    ) {
      if (!deptSet[""]) {
        deptSet[""] = {};
      }
      deptSet[""][deptCode] = deptChiaAbbr;
      return;
    }

    if (!deptSet[deptCode[0]]) {
      deptSet[deptCode[0]] = {};
    }

    if (deptCode.length === 1) {
      // 學院
      deptSet[deptCode[0]][deptCode] = deptChiaAbbr;
    } else {
      // 系所
      const subDeptCode = deptCode.slice(2);
      if (!deptSet[deptCode[0]][subDeptCode]) {
        deptSet[deptCode[0]][subDeptCode] = {};
      }
      deptSet[deptCode[0]][subDeptCode][deptCode] = deptChiaAbbr;
    }
  });

  return Object.entries(collegeMap).map(([collegeID, collegeName], id) => ({
    key: id,
    label: collegeName,
    data: {
      value: null,
      matchMode: FilterMatchMode.EQUALS,
    },
    children: Object.entries(deptSet[collegeID] || {}).map(
      ([deptCode, deptName], subId) =>
        typeof deptName === "string"
          ? {
              key: `${id}-${subId}`,
              label: deptName,
              data: {
                value: deptCode,
                matchMode: FilterMatchMode.EQUALS,
              },
            }
          : Object.keys(deptName).length === 1
          ? {
              key: `${id}-${subId}`,
              label: deptName[Object.keys(deptName)[0]],
              data: {
                value: Object.keys(deptName)[0],
                matchMode: FilterMatchMode.EQUALS,
              },
            }
          : {
              key: `${id}-${subId}`,
              label: `${deptCode.slice(0)} ${deptName[
                Object.keys(deptName)[0]
              ].slice(5, deptName[Object.keys(deptName)[0]].indexOf("（"))}`,
              data: {
                value: deptCode.slice(0),
                matchMode: FilterMatchMode.ENDS_WITH,
              },
              children: Object.entries(deptName).map(
                ([subDeptCode, subDeptName], subSubId) => ({
                  key: `${id}-${subId}-${subSubId}`,
                  label: subDeptName,
                  data: {
                    value: subDeptCode,
                    matchMode: FilterMatchMode.EQUALS,
                  },
                })
              ),
            }
    ),
  }));
}
</script>

<style scoped lang="scss">
.menubar-end {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>

<style lang="scss">
.p-menubar-submenu {
  z-index: 1000 !important;
  min-width: 10rem;
}

.p-button-icon-only {
  text-decoration: none;
}

@media screen and (max-width: 400px) {
  .p-menubar-submenu {
    min-width: 8rem;
  }
}
</style>
