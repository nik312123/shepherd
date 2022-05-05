<template>
    <div class="note-list-item">
        <div @click="goToNote" class="card" ref="singlenote">
            <div v-if="note.reminderDateTime" class="card-content date">
                <div class="date-elements">
                    <p>{{ note.reminderDateTime.toDate().toLocaleDateString('en-US', {month: 'short'}) }}</p>
                    <p class="date-day">{{ note.reminderDateTime.toDate().getDate() }}</p>
                </div>
            </div>
            <div :class="'note-info ' + (note.reminderDateTime ? 'has-reminder' : '')">
                <div class="row">
                    <p class="note-title">
                        {{ note.title }}
                    </p>
                    <TagList :tag-map="note.tags" ref="tagList"/>
                </div>
                <div>
                    <div class="note-body">
                        {{ note.body }}
                        <br>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TagList from '@/components/TagList';

export default {
    name: 'NoteListItem',
    components: {TagList},
    props: {
        note: Object,
        viewName: String,
        viewId: String
    },
    data: function() {
        return {
            titleStyle: ''
        };
    },
    methods: {
        goToNote: function() {
            this.$router.push({
                name: 'NoteView',
                params: {
                    id: this.note.id,
                    from: this.$route.name,
                    viewName: this.viewName,
                    viewId: this.viewId,
                    defaultTab: 'preview'
                }
            });
        }
    }
};
</script>

<style scoped>
.note-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #F8FAFC;
    font-size: 20px;
    font-weight: 800;
    margin-left: 10px;
}

.note-info {
    width: 100%;
}

.note-info.has-reminder {
    width: calc(100% - 60px);
}

.card {
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    background-color: #344155;
    border-radius: 10px;
    user-select: none;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    display: inline-flex;
    flex-direction: row;
    width: 100%;
    height: 70px;
}

.content {
    color: #F8FAFC;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 700;
    position: absolute;
    bottom: 5px;
    width: 500px;
}

.card-header {
    box-shadow: 0 0 0 0;
    padding: 0;
    margin: 0;
}

.card-content {
    padding-top: 0;
    padding-bottom: 10px;
}

.card-header-icon {
    padding: 0 10px 0 0;
}

.date {
    color: white;
    width: 60px;
    background-color: #1F2531;
    font-size: 1em;
    text-align: center;
    justify-content: center;
    align-content: center;
    padding: 4px 0 0;
    border: 4px solid #354155;
    border-radius: 10px;
}

.date-day {
    font-size: 1.25em;
    font-weight: bold;
}

.note-body {
    color: #F8FAFC;
    margin-top: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 10px;
    font-weight: 600;
}

.row {
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: space-between;
}
</style>
