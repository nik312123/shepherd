<template>
    <div>
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: homeViewName})"><a>Home</a></li>
                <li class="is-active"><a aria-current="page">Upcoming</a></li>
            </ul>
        </nav>
        <h1 class="title is-2">🗓 This Week</h1>
        <div>
            <article v-for="idx in 7" :key="idx">
                <UpcomingViewSectionDay :offset="idx"/>
            </article>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import UpcomingViewSectionDay from '@/components/UpcomingViewSectionDay';
import HomeView from '@/views/HomeView';

export default {
    name: 'UpcomingView',
    components: {PageHeader, UpcomingViewSectionDay},
    data: function() {
        return {
            homeViewName: HomeView.name
        };
    }
};
</script>
