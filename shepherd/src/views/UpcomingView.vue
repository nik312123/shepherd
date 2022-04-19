<template>
  <div>
    <header-bar></header-bar>
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <ul>
        <li @click="$router.push('/home')"><a>Home</a></li>
        <li class="is-active"><a aria-current="page">Upcoming</a></li>
      </ul>
    </nav>
    <h1 class="title is-2">🗓 Upcoming</h1>
    <div>
      <article v-for="idx in 7" :key="idx">
      <upcoming-view-day-section :offset="idx"></upcoming-view-day-section>
      </article>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
import UpcomingViewDaySection from "@/components/UpcomingViewDaySection";

export default {
  name: "UpcomingView",
  components: {HeaderBar, UpcomingViewDaySection},
};
</script>

<style scoped>

</style>
