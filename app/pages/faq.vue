<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1
      class="text-4xl font-bold text-center mb-12"
      :style="{ color: primaryColor }"
    >
      FAQ - Pertanyaan yang Sering Diajukan
    </h1>

    <div v-for="(section, sectionIdx) in sections" :key="sectionIdx" class="mb-12">
      <h2
        class="text-2xl font-semibold mb-6 border-b pb-2"
        :style="{ color: primaryColor, borderColor: '#dce7f2' }"
      >
        {{ section.title }}
      </h2>
      <div class="space-y-4">
        <div
          v-for="(q, qIdx) in section.questions"
          :key="`${sectionIdx}-${qIdx}`"
          class="border rounded-xl p-5 shadow transition-all duration-300 ease-in-out hover:shadow-md"
          :style="{
            borderColor: openIndex === `${sectionIdx}-${qIdx}` ? primaryColor : '#e2e8f0',
            backgroundColor: openIndex === `${sectionIdx}-${qIdx}` ? '#f1f8fd' : 'white',
          }"
        >
          <button
            class="w-full flex justify-between items-center text-left text-lg font-medium focus:outline-none"
            :style="{ color: primaryColor }"
            @click="toggleQuestion(`${sectionIdx}-${qIdx}`)"
          >
            <span>{{ q.question }}</span>
            <span
              class="text-2xl font-bold"
              :style="{ color: openIndex === `${sectionIdx}-${qIdx}` ? '#c0392b' : primaryColor }"
            >
              {{ openIndex === `${sectionIdx}-${qIdx}` ? '−' : '+' }}
            </span>
          </button>
          <p
            v-if="openIndex === `${sectionIdx}-${qIdx}`"
            class="mt-4 text-gray-700 leading-relaxed whitespace-pre-line"
          >
            {{ q.answer }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const primaryColor = '#16578d'
const openIndex = ref<string | null>(null)

const toggleQuestion = (index: string) => {
  openIndex.value = openIndex.value === index ? null : index
}

const sections = [
  {
    title: '📋 Pengisian Kebijakan',
    questions: [
      {
        question: 'Apa itu Indeks Kualitas Kebijakan (IKK)?',
        answer: `Indeks Kualitas Kebijakan (IKK) adalah instrumen untuk mengukur kualitas kebijakan pemerintah terutama terhadap dampak atau hasil bagi pembangunan yang strategis dengan mengedepankan prinsip berbasis bukti (evidence-based).`,
      },
      {
        question: 'Bagaimana menyajikan bukti dukung dari beberapa dokumentasi yang tebal untuk menjawab pertanyaan IKK?',
        answer: `Apabila jawaban atas pertanyaan dalam Indeks Kualitas Kebijakan (IKK) tercantum dalam dokumen yang memiliki volume besar, seperti Rencana Strategis atau laporan kinerja, disarankan untuk mengekstraksi atau memisahkan bagian yang secara spesifik dan relevan mendukung jawaban dimaksud.\nDokumen bukti pendukung tersebut dapat diunggah ke layanan penyimpanan berbasis cloud, seperti Google Drive, Dropbox, atau platform serupa.\nPastikan bahwa tautan dokumen telah diatur dengan izin akses publik agar dapat diakses oleh semua pihak yang berkepentingan dalam proses penilaian dan verifikasi.`,
      },
      {
        question: 'Apakah harus mengunggah bukti dukung pada setiap pertanyaan atau bisa menggunakan tautan terpisah di luar SI IKK untuk mengumpulkan bukti dukung jawaban pertanyaan dalam instrumen IKK?',
        answer: `Analis Instansi tetap diwajibkan untuk mengunggah dokumen bukti pendukung pada kolom yang tersedia di bawah setiap pertanyaan dalam Indeks Kualitas Kebijakan (IKK).\nHal ini penting dilakukan karena sistem informasi IKK (SI IKK) secara otomatis menghitung progres pengisian berdasarkan kombinasi antara isian jawaban dan keberadaan dokumen pendukung pada setiap butir pertanyaan.\nNamun demikian, untuk memperkuat dan memperkaya substansi bukti yang disampaikan, Analis Instansi diperkenankan untuk mencantumkan tautan eksternal menuju dokumen pendukung tambahan yang disimpan di layanan penyimpanan awan seperti Google Drive, Dropbox, atau platform serupa.\nTautan yang dibagikan sebaiknya telah diatur dengan izin akses publik agar dapat diakses oleh seluruh pihak yang berkepentingan dalam proses evaluasi.`,
      },
      {
        question: 'Apakah Analis Instansi bisa unggah lebih dari 1 (satu) file sebagai bukti dukung untuk menjawab 1 (satu) pertanyaan?',
        answer: `Setiap pertanyaan dalam Indeks Kualitas Kebijakan (IKK) hanya menyediakan satu kolom unggahan bukti dukung, tanpa batasan format atau ukuran file. Analis Instansi disarankan untuk menyusun bagian paling relevan dari beberapa dokumen ke dalam satu file utama yang menjawab pertanyaan secara spesifik.\n\nApabila terdapat bukti tambahan, dapat disediakan melalui tautan eksternal (misalnya Google Drive atau Dropbox) yang bersifat publik. Perlu diperhatikan bahwa sistem ini menggunakan kecerdasan buatan (AI) untuk mengekstraksi dan menganalisis dokumen; oleh karena itu, file yang dibagikan sebaiknya menggunakan format yang dapat dibaca mesin (seperti PDF, DOCX, atau teks) untuk memastikan keterbacaan dan keakuratan analisis.`,
      },
      {
        question: 'Jika Analis Instansi menyediakan tautan untuk mengumpulkan bukti dukung, di mana Analis Instansi dapat menginformasikan tautan bukti dukung tersebut?',
        answer: `Terdapat beberapa alternatif yang dapat ditempuh oleh Analis Instansi dalam menyampaikan tautan bukti dukung tambahan di luar file unggahan utama, antara lain:\nAnalis Instansi dapat menginformasikan tautan bukti dukung (misalnya melalui Google Drive atau Dropbox) kepada Koordinator Instansi untuk diteruskan kepada Koordinator Nasional;\nAnalis Instansi dapat mencantumkan tautan tersebut dalam sebuah dokumen, kemudian menyimpannya dalam format PDF untuk diunggah pada kolom bukti dukung di pertanyaan terkait;\nAnalis Instansi juga dapat menambahkan penjelasan dan mencantumkan tautan bukti dukung tambahan pada kolom isian terbuka yang tersedia di akhir setiap pertanyaan dalam masing-masing dimensi, yaitu: Perencanaan Kebijakan, Implementasi Kebijakan, Evaluasi dan Keberlanjutan Kebijakan, serta Transparansi dan Partisipasi Publik.\nAlternatif ini bertujuan untuk memastikan seluruh bukti relevan tetap terdokumentasi dan dapat diakses oleh seluruh pihak yang berkepentingan dalam proses penilaian secara komprehensif.`,
      },
    ],
  },
  {
    title: '💡 Bantuan Teknis',
    questions: [
      {
        question: 'Siapa yang bisa saya hubungi jika mengalami kendala?',
        answer: 'Anda dapat menghubungi tim Helpdesk kami melalui menu "Helpdesk" pada sidebar atau melalui email resmi yang tertera di halaman kontak.',
      },
    ],
  },
]
</script>
