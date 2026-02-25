<template>
  <div class="page-container w-full">
    <!-- search bar -->
    <CourseSearchBar />

    <!-- carousel of important announcements -->
    <CourseCarousel />
  </div>
</template>

<script lang="ts" setup>
import { CourseSearchBar, CourseCarousel } from "#components";
</script>
