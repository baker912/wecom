<script setup lang="ts">
import CustomerProfileHeader from './CustomerProfileHeader.vue';
import ProfileCard from './ProfileCard.vue';
import TagSection from './TagSection.vue';
import ArchiveSection from './ArchiveSection.vue';
import ActivitySection from './ActivitySection.vue';
import BottomBar from './BottomBar.vue';
import { 
  mockCustomer, 
  mockTagGroups, 
  mockArchiveTabs, 
  mockActivityTabs, 
  mockActivities,
  mockProspects,
} from '../../mock/data';
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-32 pt-0">
    <CustomerProfileHeader />
    
    <main>
      <ProfileCard :customer="mockCustomer" />
      
      <div class="px-3 bg-gradient-to-b from-[#cbe0ff] to-gray-50 pt-0 pb-6 relative z-0">
        <TagSection :groups="mockTagGroups" />
        <ArchiveSection :tabs="mockArchiveTabs" :prospects="mockProspects" />
        <ActivitySection :tabs="mockActivityTabs" :activities="mockActivities" />
      </div>
    </main>

    <BottomBar />
  </div>
</template>
