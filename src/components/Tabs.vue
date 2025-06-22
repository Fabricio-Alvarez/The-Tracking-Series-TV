<template>
  <div class="tabs">
    <div
      v-for="tab in tabs"
      :key="tab.id"
      class="tab"
      :class="{ active: activeTab === tab.id }"
      @click="$emit('tab-change', tab.id)"
    >
      <ion-icon :name="tab.icon"></ion-icon>
      <span>{{ tab.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string
  label: string
  icon: string
}

interface Props {
  tabs: Tab[]
  activeTab: string
}

defineProps<Props>()

defineEmits<{
  'tab-change': [tabId: string]
}>()
</script>

<style scoped>
/* Tabs internas */
.tabs {
  display: flex;
  background-color: #1e1e1e;
  padding: 0 16px;
  border-bottom: 1px solid #333;
}

.tab {
  display: flex;
  align-items: center;
  padding: 16px 0;
  margin-right: 24px;
  color: #aaa;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab:hover {
  color: #ccc;
}

.tab ion-icon {
  font-size: 20px;
  margin-right: 6px;
}

.tab.active {
  color: #fff;
  font-weight: 600;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #6c7ae0;
}

/* Responsive */
@media (min-width: 1440px) {
  .tabs {
    padding: 0 20px;
  }
}
</style>
