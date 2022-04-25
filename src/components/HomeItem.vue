<template>
    <div class="card">
        <header @click="goToView" class="card-header">
            <p class="card-header-title">
                {{ title }}
            </p>
            <span v-if="count > 0" class="tag is-small">{{ count }}</span>
        </header>
    </div>
</template>

<script>
import router from '@/router';
import ViewView from '@/views/ViewView';

export default {
    name: 'HomeItem',
    props: {
        title: String,
        viewName: String,
        count: Number,
        id: String
    },
    methods: {
        goTo: function() {
            if(this.viewName === ViewView.name) {
                router.push({name: ViewView.name, params: {id: this.id}});
            }
            else {
                router.push({name: this.viewName});
            }
        }
    }
};
</script>

<style scoped>
.card {
    background-color: #344155;
    border-radius: 10px;
    margin-bottom: 20px;
    cursor: pointer;
}

.card:hover {
    background-color: #5B6A81;
}

.card-header-title {
    color: #F8FAFC;
    font-size: 1.3em;
    user-select: none;
}

.tag {
    margin: auto 15px auto auto;
    border-radius: 99999px;
    background-color: #5B6A81;
    color: #F8FAFC;
    font-weight: 800;
}
</style>
