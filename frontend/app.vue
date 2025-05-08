<template>
  <div id="app">
    <Menubar :model="items" :sticky="true">
      <template>
        <Select
          v-model="currentTerm"
          :options="terms"
          @change="onTermChange"
          class="me-2"
          aria-label="Select Term"
        ></Select>
      </template>
      <template #end>
        <div class="menubar-end">
          <ToggleSwitch
            v-model="darkMode"
            class="me-2"
            @change="toggleDarkMode"
            aria-label="Toggle Dark Mode"
            :dt="toggleSwitchDt"
          >
            <template #handle>
              <i
                :class="{ 'pi pi-sun': !darkMode, 'pi pi-moon': darkMode }"
              ></i>
            </template>
          </ToggleSwitch>
          <Button
            icon="pi pi-github"
            class="p-button-rounded p-button-secondary"
            :url="'https://github.com/sun92122/NTNUx'"
            target="_blank"
            aria-label="Github"
          ></Button>
        </div>
      </template>
    </Menubar>
    <NuxtPage />
  </div>
</template>

<script setup>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import ToggleSwitch from "primevue/toggleswitch";

const updateMenubar = useState("updateMenubar");
onMounted(() => {
  updateMenubar.value = updateMenubarItems;
});

const currentTerm = useState("currentTerm", () => null);
const terms = useState("terms", () => []);
const loadTermData = useState("loadTermData");
const items = ref([
  {
    label: "首頁",
    icon: "pi pi-fw pi-home",
    route: "/",
  },
  {
    label: "課表",
    icon: "pi pi-fw pi-calendar",
    route: "/schedule",
  },
  {
    label: "關於",
    icon: "pi pi-fw pi-info-circle",
    route: "/about",
  },
  {
    label: "選擇學期",
    icon: "pi pi-fw pi-book",
    items: [],
  },
]);

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

function updateMenubarItems() {
  // 更新學期選單
  items.value[3].items = terms.value.map((term) => ({
    label: term,
    command: () => {
      currentTerm.value = term;
      loadTermData.value();
      items.value[3].label = `學期：${term}`; // 更新學期顯示
    },
  }));
  // 更新學期顯示
  if (!currentTerm.value) {
    items.value[3].label = "選擇學期";
    return;
  }
  items.value[3].label = `學期：${currentTerm.value}`;
}
</script>

<style scoped lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.menubar-end {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
</style>

<style lang="scss">
body {
  margin: 0;
  background-color: var(--p-content-background);
}

html {
  font-size: 14px;
}
</style>
