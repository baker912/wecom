<script setup lang="ts">
import Header from '../components/Header.vue';
import ProfileCard from '../components/ProfileCard.vue';
import TagSection from '../components/TagSection.vue';
import ArchiveSection from '../components/ArchiveSection.vue';
import ActivitySection from '../components/ActivitySection.vue';
import BottomBar from '../components/BottomBar.vue';
import { 
  mockCustomer, 
  mockTagGroups, 
  mockArchiveTabs, 
  mockActivityTabs, 
  mockActivities 
} from '../mock/data';
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-32 pt-0">
    <Header />
    
    <main>
      <ProfileCard :customer="mockCustomer" />
      
      <div class="px-3 bg-gradient-to-b from-[#cbe0ff] to-gray-50 pt-0 pb-6 relative z-0">
        <TagSection :groups="mockTagGroups" />
        <ArchiveSection :tabs="mockArchiveTabs" />
        <ActivitySection :tabs="mockActivityTabs" :activities="mockActivities" />
      </div>
    </main>

    <BottomBar />
  </div>
</template>
