<template>
  <div class="min-h-screen bg-gray-50 px-4 py-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-semibold text-gray-800">
          💬 Forum Diskusi Kebijakan
        </h1>
        <p class="text-gray-600">
          Diskusikan praktik terbaik dan tantangan dalam kebijakan publik
        </p>
      </div>
      <!-- Thread List -->
      <div class="space-y-4">
        <div 
          v-for="thread in threads" 
          :key="thread.id"
          class="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
        >
          <NuxtLink :to="`/forum/${thread.id}`">
            <h2 class="text-lg font-semibold text-blue-700">
              {{ thread.title }}
            </h2>
          </NuxtLink>
          <p class="text-sm text-gray-600 mt-1">
            {{ thread.description }}
          </p>
          <div class="text-xs text-gray-400 mt-2">
            {{ thread.comments }} komentar
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const threads = [
  {
    id: 1,
    title: "Bagaimana meningkatkan kualitas perencanaan kebijakan?",
    description: "Diskusi tentang metode evidence-based policy",
    comments: 12
  },
  {
    id: 2,
    title: "Tantangan implementasi kebijakan di daerah",
    description: "Sharing pengalaman antar instansi",
    comments: 8
  }
]
</script>
