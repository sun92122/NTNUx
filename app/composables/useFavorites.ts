import type { Course } from "@/composables/useCourseTable";
import { jsonLzDecode, jsonLzEncode } from "@/composables/useTools";

export interface FavoriteCourses {
  [course_code: string]: string;
}

export const favoriteCourses = ref<FavoriteCourses>({});

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
  favoriteCourses.value[course.course_code] = course.name;
  saveFavoriteCourses();
}

export function removeFavoriteCourse(course: Course) {
  delete favoriteCourses.value[course.course_code];
  saveFavoriteCourses();
}

export function toggleFavoriteCourse(course: Course) {
  if (favoriteCourses.value[course.course_code]) {
    removeFavoriteCourse(course);
  } else {
    addFavoriteCourse(course);
  }
}

export function toggleFavoriteCourseByCode(
  course_code: string,
  course_name: string,
) {
  if (favoriteCourses.value[course_code]) {
    delete favoriteCourses.value[course_code];
  } else {
    favoriteCourses.value[course_code] = course_name;
  }
  saveFavoriteCourses();
}
