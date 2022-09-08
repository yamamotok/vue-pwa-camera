<script setup lang="ts">
import { onMounted, reactive, ref, Ref, watch } from 'vue';

enum ScreenState {
  Start = 0,
  Initializing,
  InPreview,
  Captured,
}

interface Data {
  capturedImageSrc: string | undefined;
}

const screenState: Ref<ScreenState> = ref(ScreenState.Start);
const startButtonRef: Ref<HTMLElement | null> = ref(null);
const fileInputRef: Ref<HTMLInputElement | null> = ref(null);
const imageRef: Ref<HTMLImageElement | null> = ref(null);
const imageLinkRef: Ref<HTMLAnchorElement | null> = ref(null);
const data = reactive<Data>({
  capturedImageSrc: undefined,
});

const initialize = () => {
  screenState.value = ScreenState.InPreview;
};

const takePicture = () => {
  startButtonRef.value?.click();
};

const retry = () => {
  const fileInput = fileInputRef.value;
  if (fileInput) {
    fileInput.value = '';
  }
  screenState.value = ScreenState.InPreview;
};

const download = () => {
  const imageLink = imageLinkRef.value;
  if (!imageLink) {
    throw new Error('Implementaion error, reference is null');
  }
  imageLink.click();
};

const onFileInputChange = () => {
  const fileInput = fileInputRef.value;
  const image = imageRef.value;
  if (!fileInput || !image) {
    throw new Error('Implementation error, reference is null');
  }
  if (!fileInput.value) {
    return;
  }
  const file = fileInput.files?.[0];
  if (!file) {
    throw new Error('Implementation error, reference is null');
  }
  data.capturedImageSrc = URL.createObjectURL(file);
  screenState.value = ScreenState.Captured;
};

watch(screenState, (state) => {
  if (state === ScreenState.Initializing) {
    initialize();
    return;
  }
});

onMounted(() => {
  screenState.value = ScreenState.Initializing;
});
</script>

<template>
  <div class="initial-pane" v-show="screenState === ScreenState.InPreview">
    <label for="fileInput">
      <span class="btn btn-primary" ref="startButtonRef">Start Camera</span>
      <input
        id="fileInput"
        ref="fileInputRef"
        type="file"
        accept="image/*"
        capture="environment"
        @change="onFileInputChange"
      />
    </label>
  </div>

  <div class="preview-pane" v-show="screenState === ScreenState.Captured">
    <a :href="data.capturedImageSrc" download="photo" title="photo" ref="imageLinkRef">
      <img ref="imageRef" alt="captured image" :src="data.capturedImageSrc"
    /></a>
  </div>

  <div class="control" v-show="screenState > ScreenState.Initializing">
    <div v-if="screenState === ScreenState.InPreview">
      <button class="btn btn-primary" @click.prevent="takePicture">Start Camera</button>
    </div>
    <div v-if="screenState === ScreenState.Captured">
      <button class="btn btn-primary" @click.prevent="retry">Retry</button>
    </div>
    <div v-if="screenState === ScreenState.Captured">
      <button class="btn btn-info" @click.prevent="download">Download</button>
    </div>
    <div v-if="screenState !== ScreenState.Initializing">
      <button class="btn btn-dark" @click.prevent="$router.push('/')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
div.initial-pane {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 97vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

div.initial-pane input {
  display: none;
}

div.preview-pane {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 97vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

div.preview-pane img {
  max-width: 100%;
  max-height: 100%;
}

div.control {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem 0;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
}

div.control > div {
  margin: 0 6px;
}
</style>
