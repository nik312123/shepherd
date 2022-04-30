<template>
  <div>
    <PageHeader/>
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <ul>
        <li @click="$router.push({name: homeViewName})"><a>Home</a></li>
        <li class="is-active">
          <router-link :to="{name: allNotesViewName}" aria-current="page">All Notes</router-link>
        </li>
      </ul>
    </nav>
    <h1 class="title is-2">🗄 All Notes</h1>
    <div class="section">
      <article v-for="noteObj in notes" :key="noteObj.id">
        <NoteListItem :note="noteObj"/>
      </article>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import {auth, db} from '@/firebaseConfig';
import NoteListItem from '@/components/NoteListItem';
import HomeView from '@/views/HomeView';

const allNotesViewName = 'AllNotesView';

export default {
  name: allNotesViewName,
  components: {NoteListItem, PageHeader},
  data: function () {
    return {
      allNotesViewName: allNotesViewName,
      homeViewName: HomeView.name,
      notes: []
    };
  },
  firestore: function () {
    return {
      notes: db.collection('notes')
          .where('userId', '==', auth.currentUser.uid)
          .where('isTrash', '==', false)
          .orderBy('lastModifiedDateTime')
    };
  }
};
</script>
