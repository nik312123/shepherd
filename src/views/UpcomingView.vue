<template>
    <div>
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: 'home'})"><a>Home</a></li>
                <li class="is-active"><a aria-current="page">Upcoming</a></li>
            </ul>
        </nav>
        <h1 class="title is-2">🗓 Upcoming</h1>
        <div>
            <article v-for="offset in 7" :key="offset">
                <UpcomingViewSectionDay :tomorrow="offset === 1" :start-date="getOffsetDate(offset)"/>
            </article>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import UpcomingViewSectionDay from '@/components/UpcomingViewSectionDay';

export default {
    name: 'UpcomingView',
    components: {PageHeader, UpcomingViewSectionDay},
    data: function() {
        return {
            curDate: null
        };
    },
    methods: {
        getOffsetDate: function(offset) {
            if(offset === 1) {
                this.curDate = new Date();
                this.curDate.setHours(0, 0, 0, 0);
            }
            const offsetDate = new Date(this.curDate);
            offsetDate.setDate(offsetDate.getDate() + offset);
            return offsetDate;
        }
    }
};
</script>

<style scoped>
.row {
    display: flex;
    justify-content: space-between;
}
</style>
