<template>
  <div class="min-h-screen bg-gray-50 px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Thread -->
      <div class="bg-white p-6 rounded-xl shadow mb-6">
        <h1 class="text-xl font-semibold mb-2">
          {{ thread.title }}
        </h1>
        <p class="text-gray-600">
          {{ thread.description }}
        </p>
      </div>
      <!-- Comments -->
      <div class="space-y-4 mb-6">
        <div 
          v-for="comment in comments" 
          :key="comment.id"
          class="bg-white p-4 rounded-lg shadow"
        >
          <p class="text-sm text-gray-800">
            {{ comment.text }}
          </p>
          <span class="text-xs text-gray-400">
            oleh {{ comment.user }}
          </span>
        </div>
      </div>
      <!-- Comment Form -->
      <div class="bg-white p-4 rounded-xl shadow">
        <div v-if="user">
          <textarea 
            v-model="newComment"
            placeholder="Tulis komentar..."
            class="w-full border rounded-lg p-3 mb-3"
          ></textarea>
          <button 
            @click="submitComment"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Kirim
          </button>
        </div>
        <div v-else class="text-center text-gray-600">
          Silakan 
          <NuxtLink to="/login" class="text-blue-600 underline">
            login
          </NuxtLink>
          untuk berkomentar
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const user = ref(null) // nanti dari auth

// dummy thread
const thread = {
  title: "Bagaimana meningkatkan kualitas perencanaan kebijakan?",
  description: "Diskusi terkait evidence-based policy"
}

const comments = ref([
  { id: 1, text: "Menurut saya penting pakai data BPS", user: "Admin" },
  { id: 2, text: "Setuju, tapi implementasinya sulit", user: "User A" }
])

const newComment = ref("")

function submitComment() {
  if (!newComment.value) return

  comments.value.push({
    id: Date.now(),
    text: newComment.value,
    user: "Saya"
  })

  newComment.value = ""
}
</script>
