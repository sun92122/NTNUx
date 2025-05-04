<template>
  <div id="app">
    <Menubar :model="items" :sticky="true">
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
</script>

<style scoped lang="scss">
.menubar-end {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
</style>

<style lang="scss">
body {
  background-color: var(--p-content-background);
}
</style>