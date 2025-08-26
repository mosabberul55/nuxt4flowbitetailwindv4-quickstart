<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {randomString} from "~/composables/helper";
import {s3Endpoint} from "~/composables/helper";


interface Props {
  modelValue: undefined | string | string[]
  invalid?: any
  multiple?: boolean
  uploadPath?: string
  accept?: string
  maxFileSize?: number
  oldImage?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select File',
  multiple: false,
  uploadPath: 'uploads',
  accept: '*/*',
  maxFileSize: 20000000,
  invalid: false,
  oldImage: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void;
  (e: 'changeImage', value: any): void;
  (e: 'clearImage'): void;
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const progress = ref<number>(0)
const uploadedFiles = ref<string[] | string | null>(props.multiple ? [] : null)
const isLoading = ref<boolean>(false)
const isUploading = ref(false);
const isRemoved = ref<boolean>(false)
const runtimeConfig = useRuntimeConfig()
const backendBaseUrl = runtimeConfig.public.baseURL

const progressColor = computed(() => {
  const hue = Math.round(progress.value * 1.2);
  return `hsl(${hue}, 100%, 50%)`;
});

watch(() => props.modelValue, (val) => {
  if (!val) {
    inputRef.value && (inputRef.value.value = '')
    uploadedFiles.value = props.multiple ? [] : null
    progress.value = 0
  }
})

const submitHandler = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) {
    progress.value = 0
    uploadedFiles.value = props.multiple ? [] : null
    emit('update:modelValue', uploadedFiles.value)
    return
  }

  for (const fileItem of target.files) {
    await upload(fileItem)
  }
}

const upload = async (file: File) => {
  isLoading.value = true
  try {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const res = await fetch(`${backendBaseUrl}/upload/presigned-url?name=${randomString(32)}.${fileExtension}`)
    const { url } = await res.json()
    const success = await uploadFile(url, file)
    if (!success) throw new Error('Upload failed')
    const finalizeRes = await fetch(`${backendBaseUrl}/upload/finalize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: url,
        model: props.uploadPath ?? 'uploads'
      })
    })
    const data = await finalizeRes.json()
    const fileUrl = data.url

    if (props.multiple) {
      const updated = Array.isArray(uploadedFiles.value) ? [...uploadedFiles.value, fileUrl] : [fileUrl]
      uploadedFiles.value = updated
      emit('update:modelValue', updated)
    } else {
      uploadedFiles.value = fileUrl
      emit('update:modelValue', fileUrl)
      emit('changeImage', fileUrl)
      console.log('File uploaded successfully:', fileUrl)
    }
  } catch (err) {
    console.error(err)
  }
  isLoading.value = false
}

const uploadFile = async (url: string, file: File) => {
  return await new Promise<boolean>((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        progress.value = Math.round((event.loaded / event.total) * 100)
      }
    })
    xhr.onloadend = () => {
      resolve(xhr.status === 200)
    }
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')
    xhr.send(file)
  })
}
function triggerFileInput() {
  if (inputRef.value) inputRef.value?.click();
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start justify-center sm:items-center min-h-24 gap-4 w-full p-1 bg-white rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <div>
      <label v-if="props.label" class="block mb-1 text-sm font-medium">{{ props.label }}</label>

      <!-- Image Upload Container with Circular Loader -->
      <div class="relative inline-block ml-[3px] sm:ml-[0px] lg:ml-[0px] mt-4 border border-[#D1DFFF] rounded-full">
        <!-- Existing Image -->
        <div v-if="oldImage && !isRemoved" class="relative">
          <div
              class="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent relative group"
              :class="{ 'cursor-pointer': !isUploading }"
              @click="!isUploading && triggerFileInput()"
          >
            <!-- Image -->
            <img
                loading="lazy"
                :src="oldImage"
                alt="Uploaded Image"
                class="w-full h-full object-cover"
            />

            <!-- Overlay with icon -->
            <div
                class="absolute bottom-0 left-0 w-full h-[25%] bg-blue-500/50 text-white flex items-center justify-center transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:bottom-auto"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 7h2l.4-1.2a1 1 0 01.95-.8h10.3a1 1 0 01.95.8L19 7h2a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1zm9 2a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            </div>
          </div>

          <!-- Circular Progress Loader -->
          <svg v-if="progress > 0 && progress < 100"
               class="absolute inset-0 w-28 h-28 -top-2 -left-2 transform -rotate-90 pointer-events-none"
               viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45"
                    fill="none"
                    stroke="#e0e0e0"
                    stroke-width="4" />
            <circle cx="50" cy="50" r="45"
                    fill="none"
                    :stroke="progressColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    :stroke-dasharray="`${progress * 2.83}, 283`" />
          </svg>

          <!-- Spinner Animation -->
          <div v-if="isUploading && progress < 100"
               class="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-primary-500 border-b-transparent border-l-transparent animate-spin pointer-events-none"
               style="width: 28px; height: 28px; top: -2px; left: -2px;"></div>
        </div>

        <!-- Upload Placeholder (shown when no image exists) -->
        <div v-else
             class="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent relative group cursor-pointer"
             @click="triggerFileInput">
          <div class="w-full h-full bg-gray-100 flex items-center justify-center">
            <span class="text-gray-400 text-sm">Upload Image</span>
          </div>

          <!-- Upload icon overlay -->
          <div class="absolute bottom-0 left-0 w-full h-[25%] bg-blue-500/50 text-white flex items-center justify-center transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:bottom-auto">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 7h2l.4-1.2a1 1 0 01.95-.8h10.3a1 1 0 01.95.8L19 7h2a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1zm9 2a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          </div>

          <!-- Progress indicators for new uploads -->
          <svg v-if="progress > 0 && progress < 100"
               class="absolute inset-0 w-28 h-28 -top-2 -left-2 transform -rotate-90 pointer-events-none"
               viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45"
                    fill="none"
                    stroke="#e0e0e0"
                    stroke-width="4" />
            <circle cx="50" cy="50" r="45"
                    fill="none"
                    :stroke="progressColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    :stroke-dasharray="`${progress * 2.83}, 283`" />
          </svg>

          <div v-if="isUploading && progress < 100"
               class="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-primary-500 border-b-transparent border-l-transparent animate-spin pointer-events-none"
               style="width: 28px; height: 28px; top: -2px; left: -2px;"></div>
        </div>

        <!-- Percentage Badge -->
        <div v-if="progress > 0 && progress < 100"
             class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 shadow-sm">
          {{ progress }}%
        </div>
      </div>

      <!-- Hidden File Input -->
      <input
          ref="inputRef"
          type="file"
          :accept="accept"
          :multiple="multiple"
          @change="submitHandler"
          class="hidden"
      />

      <!-- Fallback Linear Progress Bar -->
      <div class="mt-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div v-if="progress > 0"
             class="bg-primary-600 text-xs font-medium text-primary-100 text-center p-0.5 leading-none rounded-full transition-all duration-300"
             :style="{width: `${progress}%`}">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth color transitions */
circle {
  transition: stroke 0.3s ease;
}
</style>