<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, Ref, ref, watch } from 'vue';

enum ScreenState {
  Start = 0,
  Initializing,
  InPreview,
  Captured,
}

const screenState: Ref<ScreenState> = ref(ScreenState.Start);
const videoRef: Ref<HTMLVideoElement | null> = ref(null);
const canvasRef: Ref<HTMLCanvasElement | null> = ref(null);
const capturedImageRef: Ref<HTMLImageElement | null> = ref(null);
const capturedImageLinkRef: Ref<HTMLAnchorElement | null> = ref(null);
const data = reactive({
  videoSize: { width: 0, height: 0 },
  canvasSize: { width: 0, height: 0 },
  imageUrl: '',
});

const initialize = () => {
  const video = videoRef.value;
  const canvas = canvasRef.value;
  if (!video || !canvas) {
    throw new Error('Implementation error, reference is null');
  }

  const videoConstrains: MediaTrackConstraints = {
    facingMode: 'environment',
  };
  navigator.mediaDevices.getUserMedia({ video: videoConstrains, audio: false }).then((stream) => {
    video.srcObject = stream;
  });
  video.addEventListener('canplay', () => {
    if (screenState.value !== ScreenState.Initializing) {
      return;
    }

    // Currently, no image manipulation
    const width = video.videoWidth;
    const height = video.videoHeight;
    data.canvasSize.width = width;
    data.canvasSize.height = height;

    // Just as debug info
    data.videoSize.width = video.videoWidth;
    data.videoSize.height = video.videoHeight;

    screenState.value = ScreenState.InPreview;
  });
};

const retry = () => {
  if (screenState.value !== ScreenState.Captured) {
    return;
  }

  const canvas = canvasRef.value;
  const capturedImage = capturedImageRef.value;
  if (!canvas || !capturedImage) {
    throw new Error('Implementation error, reference is null');
  }
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to obtain the context from canvas');
  }

  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL('image/png');
  capturedImage.setAttribute('src', data);

  screenState.value = ScreenState.InPreview;
};

const takePicture = () => {
  if (screenState.value !== ScreenState.InPreview) {
    return;
  }
  const video = videoRef.value;
  const canvas = canvasRef.value;
  const capturedImage = capturedImageRef.value;
  if (!video || !canvas || !capturedImage) {
    throw new Error('Implementation error, reference is null');
  }
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to obtain the context from canvas');
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  data.imageUrl = canvas.toDataURL('image/jpeg');

  screenState.value = ScreenState.Captured;
};

const download = () => {
  const anchor = capturedImageLinkRef.value;
  if (!anchor) {
    throw new Error('Implementation error, reference is null');
  }
  anchor.click();
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

onBeforeUnmount(() => {
  const video = videoRef.value;
  if (video) {
    video.pause();
    video.remove();
  }
});
</script>

<template>
  <div class="canvas">
    <canvas
      ref="canvasRef"
      :width="data.canvasSize.width"
      :height="data.canvasSize.height"
    ></canvas>
  </div>

  <div class="video" v-show="screenState === ScreenState.InPreview">
    <video ref="videoRef" playsinline autoplay></video>
  </div>

  <div class="captured-image" v-show="screenState === ScreenState.Captured">
    <a :href="data.imageUrl" download="photo" title="photo" ref="capturedImageLinkRef"
      ><img ref="capturedImageRef" :src="data.imageUrl" alt="picture"
    /></a>
  </div>

  <div class="overlay">
    <p>
      videoW: {{ data.videoSize.width }}, videoH: {{ data.videoSize.height }}<br />
      canvasW: {{ data.canvasSize.width }}, canvasH: {{ data.canvasSize.height }}<br />
    </p>
  </div>

  <div class="control" v-show="screenState > ScreenState.Initializing">
    <div v-if="screenState === ScreenState.InPreview">
      <button class="btn btn-primary" @click.prevent="takePicture">Take picture</button>
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
div.overlay {
  position: fixed;
  bottom: 0;
  top: 0;
  width: 100%;
  padding: 0.2rem;
  color: #ffcc00;
  font-size: 12px;
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

div.video {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #111111;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

div.video > video {
  width: 100%;
  height: 100%;
}

div.canvas {
  position: fixed;
  top: 0;
  left: 0;
  visibility: hidden;
}

div.captured-image {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #202020;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

div.captured-image img {
  max-width: 100%;
  max-height: 100%;
}
</style>
