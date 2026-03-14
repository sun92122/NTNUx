import type { Course } from "@/composables/useCourseTable";
import { jsonLzDecode, jsonLzEncode } from "@/composables/useTools";

export type FavoriteCourses = string[];

export const favoriteCourses = ref<FavoriteCourses>([]);

export function loadFavoriteCourses() {
  if (!import.meta.client) return;
  const stored = localStorage.getItem("ntnux-user-favorite");
  if (stored) {
    try {
      const decoded = jsonLzDecode(stored);
      if (typeof decoded === "object" && decoded !== null) {
        favoriteCourses.value = decoded as FavoriteCourses;
      }
    } catch (e) {
      console.error("Failed to load favorite courses:", e);
      localStorage.removeItem("ntnux-user-favorite");
    }
  }
}

export function saveFavoriteCourses() {
  if (!import.meta.client) return;
  try {
    const encoded = jsonLzEncode(favoriteCourses.value);
    localStorage.setItem("ntnux-user-favorite", encoded);
  } catch (e) {
    console.error("Failed to save favorite courses:", e);
  }
}

export function addFavoriteCourse(course: Course) {
  favoriteCourses.value.push(course.course_code);
  saveFavoriteCourses();
}

export function removeFavoriteCourse(course: Course) {
  favoriteCourses.value = favoriteCourses.value.filter(
    (code) => code !== course.course_code,
  );
  saveFavoriteCourses();
}

export function toggleFavoriteCourse(course: Course) {
  toggleFavoriteCourseByCode(course.course_code);
}

export function toggleFavoriteCourseByCode(course_code: string) {
  const index = favoriteCourses.value.findIndex((code) => code === course_code);
  if (index !== -1) {
    favoriteCourses.value.splice(index, 1);
  } else {
    favoriteCourses.value.push(course_code);
  }
  saveFavoriteCourses();
}
