<!-- modifikasi src/views/HomePage.vue tambahkan keseluruhan style -->
<style scoped>
ion-card,
ion-accordion-group {
  width: 100%;
}

ion-fab {
  margin: 25px;
}

.limited-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

ion-card-title.limited-text {
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

ion-card-subtitle.limited-text {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.scrollable-container {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.accordion-container {
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.scrollable-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

<template>
  <!-- modifikasi src/views/HomePage.vue pada bagian ion-content dalam template -->
<ion-content :fullscreen="true">
	<!-- komponen paling atas dari ion-content -->
	<ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
    @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
  
  <!-- komponen utama di antara 2 komponen ini -->
   <!-- bagian refresher -->

<!-- active heros -->
<div class="scrollable-container">
  <ion-list>
    <ion-item-sliding v-for="hero in activeHeros" :key="hero.id" :ref="(el) => setItemRef(el, hero.id!)">
      <ion-item-options side="start" @ionSwipe="handleDelete(hero)">
        <ion-item-option color="danger" expandable @click="handleDelete(hero)">
          <ion-icon slot="icon-only" :icon="trash" size="large"></ion-icon>
        </ion-item-option>
      </ion-item-options>

      <ion-item>
        <ion-card>
          <ion-card-header>
            <ion-card-title class="ion-text-wrap limited-text">{{ hero.title }}</ion-card-title>
            <ion-card-subtitle class="limited-text">{{ hero.description }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <ion-badge>{{ getRelativeTime(hero.updatedAt) }}</ion-badge>
          </ion-card-content>
        </ion-card>
      </ion-item>

      <ion-item-options side="end" @ionSwipe="handleStatus(hero)">
        <ion-item-option @click="handleEdit(hero)">
          <ion-icon slot="icon-only" :icon="create" size="large"></ion-icon>
        </ion-item-option>
        <ion-item-option color="success" expandable @click="handleStatus(hero)">
          <ion-icon slot="icon-only" :icon="checkmarkCircle" color="light" size="large"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
    <ion-item v-if="activeHeros.length === 0" class="ion-text-center">
      <ion-label>There's No Active Story</ion-label>
    </ion-item>
  </ion-list>
</div>

<!-- completed heros -->
<ion-item class="accordion-container">
  <ion-accordion-group>
    <ion-accordion value="first">
      <ion-item slot="header" color="light">
        <ion-label class="ion-text-center">Completed</ion-label>
      </ion-item>
      <div slot="content" class="scrollable-container">
        <ion-list>
          <ion-item-sliding v-for="hero in completedHeros" :key="hero.id" :ref="(el) => setItemRef(el, hero.id!)">
            <ion-item-options side="start" @ionSwipe="handleDelete(hero)">
              <ion-item-option color="danger" expandable @click="handleDelete(hero)">
                <ion-icon slot="icon-only" :icon="trash" size="large"></ion-icon>
              </ion-item-option>
            </ion-item-options>

            <ion-item>
              <ion-card>
                <ion-card-header>
                  <ion-card-title class="ion-text-wrap limited-text">{{ hero.title }}</ion-card-title>
                  <ion-card-subtitle class="limited-text">{{ hero.description }}</ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                  <ion-badge>{{ getRelativeTime(hero.updatedAt) }}</ion-badge>
                </ion-card-content>
              </ion-card>
            </ion-item>

            <ion-item-options side="end" @ionSwipe="handleStatus(hero)">
              <ion-item-option @click="handleEdit(hero)">
                <ion-icon slot="icon-only" :icon="create" size="large"></ion-icon>
              </ion-item-option>
              <ion-item-option color="warning" expandable @click="handleStatus(hero)">
                <ion-icon slot="icon-only" :icon="close" color="light" size="large"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
          <ion-item v-if="completedHeros.length === 0" class="ion-text-center">
            <ion-label>There's No Completed Story</ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-accordion>
  </ion-accordion-group>
</ion-item>

<!-- bagian tombol dan modal -->
  
  <!-- komponen paling bawah dari ion-content -->
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button @click="isOpen = true;">
      <ion-icon :icon="add" size="large"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <InputModal v-model:isOpen="isOpen" v-model:editingId="editingId" :hero="hero" @submit="handleSubmit" />
</ion-content>
</template>

<!-- modifikasi src/views/HomePage.vue import semua komponen yang diperlukan -->
<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonAccordion,
  IonAccordionGroup,
  IonLabel,
  IonList,
  loadingController,
  IonRefresher,
  IonRefresherContent,
  toastController
} from '@ionic/vue';
import {
  add,
  checkmarkCircle,
  close,
  create,
  trash,
  closeCircle,
  warningOutline
} from 'ionicons/icons';
import InputModal from '@/components/InputModal.vue';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { firestoreService, type Hero } from '@/utils/firestore';
import { formatDistanceToNow } from 'date-fns';

// modifikasi src/views/HomePage.vue deklarasikan variabel yang akan digunakan
const isOpen = ref(false);
const editingId = ref<string | null>(null);
const heros = ref<Hero[]>([]);
const hero = ref<Omit<Hero, 'id' | 'createdAt' | 'updatedAt' | 'status'>>({
  title: '',
  description: '',
});
const activeHeros = computed(() => heros.value.filter(hero => !hero.status));
const completedHeros = computed(() => heros.value.filter(hero => hero.status));
const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());
let intervalId: any;
const timeUpdateTrigger = ref(0);

// mendapatkan value dari item
const setItemRef = (el: any, id: string) => {
  if (el) {
    itemRefs.value.set(id, el.$el);
  }
};

// toast notifikasi
const showToast = async (message: string, color: string = 'success', icon: string = checkmarkCircle) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'top',
    icon
  });
  await toast.present();
};

// mendapatkan perbedaan waktu
const getRelativeTime = (date: any) => {
  timeUpdateTrigger.value;
  try {
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(jsDate, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

// handle swipe refresher
const handleRefresh = async (event: any) => {
  try {
    await loadHeros(false);
  } catch (error) {
    console.error('Error refreshing:', error);
  } finally {
    event.target.complete();
  }
};

// handle submit add/edit pada modal
const handleSubmit = async (hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
  if (!hero.title) {
    await showToast('Title is required', 'warning', warningOutline);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateHero(editingId.value, hero as Hero);
      await showToast('Hero updated successfully', 'success', checkmarkCircle);
    } else {
      await firestoreService.addHero(hero as Hero);
      await showToast('Hero added successfully', 'success', checkmarkCircle);
    }
    loadHeros();
  } catch (error) {
    await showToast('An error occurred', 'danger', closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

// handle edit click
const handleEdit = async (editHero: Hero) => {
  const slidingItem = itemRefs.value.get(editHero.id!);
  await slidingItem?.close();

  editingId.value = editHero.id!;
  hero.value = {
    title: editHero.title,
    description: editHero.description,
  }
  isOpen.value = true;
}

// handle delete click/swipe
const handleDelete = async (deleteHero: Hero) => {
  try {
    await firestoreService.deleteHero(deleteHero.id!);
    await showToast('Hero deleted successfully', 'success', checkmarkCircle);
    loadHeros();
  } catch (error) {
    await showToast('Failed to delete hero', 'danger', closeCircle);
    console.error(error);
  }
};

// handle status click/swipe, mengubah status hero active (false)/completed (true)
const handleStatus = async (statusHero: Hero) => {
  const slidingItem = itemRefs.value.get(statusHero.id!);
  await slidingItem?.close();
  try {
    await firestoreService.updateStatus(statusHero.id!, !statusHero.status);
    await showToast(
      `Hero marked as ${!statusHero.status ? 'completed' : 'active'}`,
      'success',
      checkmarkCircle
    );
    loadHeros();
  } catch (error) {
    await showToast('Failed to update status', 'danger', closeCircle);
    console.error(error);
  }
};

// load data
const loadHeros = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({
      message: 'Loading...'
    });
    await loading.present();
  }

  try {
    heros.value = await firestoreService.getHeros();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) {
      await loading.dismiss();
    }
  }
};

// dijalankan setiap halaman diload, load data dan set interval update 1 menit
onMounted(() => {
  loadHeros();
  intervalId = setInterval(() => {
    timeUpdateTrigger.value++;
  }, 60000);
});

// reset interval update
onUnmounted(() => {
  clearInterval(intervalId);
});

</script>
