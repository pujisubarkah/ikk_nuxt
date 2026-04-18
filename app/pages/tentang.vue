<template>
  <div>
    
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-[#16578d] via-[#1a5f96] to-[#1e67a3] text-white py-20">
      <div class="container mx-auto px-6 text-center">
        <div class="max-w-4xl mx-auto">
          <span class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            Tentang IKK
          </span>
          <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Indeks Kualitas Kebijakan
          </h1>
          <p class="text-xl text-blue-100 leading-relaxed">
            Instrumen pengukuran kualitas kebijakan pemerintah berbasis bukti untuk pembangunan yang strategis
          </p>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 min-h-screen">
      <div class="container mx-auto px-6 py-16">
        
        <!-- Section: Mengenal IKK -->
        <div class="mb-20">
          <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div class="text-center mb-10">
              <span class="inline-block px-4 py-2 bg-[#16578d]/10 text-[#16578d] rounded-full text-sm font-medium mb-4">
                Pengenalan
              </span>
              <h2 class="text-3xl md:text-4xl font-bold text-[#16578d] mb-6">
                Mengenal IKK
              </h2>
            </div>
            
            <div class="space-y-6 text-gray-700 leading-relaxed">
              <p class="text-lg">
                IKK adalah instrumen untuk mengukur kualitas kebijakan pemerintah terutama terhadap dampak atau hasil
                bagi pembangunan yang strategis dengan mengedepankan prinsip berbasis bukti <em class="text-[#16578d] font-semibold">(evidence-based)</em>
              </p>
              
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-[#16578d]">
                <p class="text-lg">
                  IKK yang diawali tahun <span class="font-bold text-[#16578d]">2021</span> dengan memperhatikan dinamikanya pada tahun <span class="font-bold text-[#16578d]">2025</span> dilakukan penyesuaian
                  terhadap instrumen pengukuran.
                </p>
              </div>
              
              <p class="text-lg">
                Secara garis besar, IKK menjadi bagian dari <span class="font-semibold text-[#16578d]">Reformasi Birokrasi</span> yang merupakan perwujudan <span class="font-semibold text-[#16578d]">Asta Cita ke-7</span>
                dari Visi Misi Presiden, yakni memperkuat reformasi politik, hukum, dan birokrasi, serta memperkuat
                pencegahan dan pemberantasan korupsi, narkoba, judi, dan penyelundupan.
              </p>
            </div>
          </div>
        </div>

        <!-- 4 Dimensi Section -->
        <div class="mb-20">
          <div class="text-center mb-12">
            <span class="inline-block px-4 py-2 bg-[#16578d]/10 text-[#16578d] rounded-full text-sm font-medium mb-4">
              4 Dimensi Pengukuran 2025
            </span>
            <h2 class="text-3xl md:text-4xl font-bold text-[#16578d] mb-4">
              Dimensi Pengukuran
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(dimension, index) in dimensions" :key="index" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div class="text-4xl mb-4 text-center">{{ dimension.icon }}</div>
              <h3 class="font-bold text-[#16578d] text-center mb-3 text-lg">
                {{ dimension.title }}
              </h3>
              <p class="text-gray-600 text-sm text-center leading-relaxed">
                {{ dimension.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Section: Tujuan IKK -->
        <div class="mb-20">
          <div class="bg-gradient-to-br from-[#16578d] to-[#1e67a3] rounded-2xl shadow-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div class="relative">
              <div class="text-center mb-8">
                <span class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                  Tujuan
                </span>
                <h2 class="text-3xl md:text-4xl font-bold mb-6">TUJUAN IKK</h2>
              </div>
              
              <div class="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-xl text-center">
                <div class="flex items-center justify-center mb-4">
                  <span class="text-6xl text-yellow-300 mr-3">❝</span>
                  <p class="text-xl md:text-2xl font-semibold leading-relaxed flex-grow">
                    untuk mendorong peningkatan kualitas kebijakan pemerintah melalui metode pengukuran mandiri
                    <em class="text-yellow-300"> (self-assessment)</em>.
                  </p>
                  <span class="text-6xl text-yellow-300 ml-3">❞</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Peraturan Terkait -->
        <div class="mb-20">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-[#16578d] to-[#1e67a3] text-white p-8">
              <h2 class="text-3xl font-bold text-center">SE Kepala LAN Tentang Pengukuran Kualitas Kebijakan</h2>
            </div>
            
            <div class="p-8 md:p-12">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div class="space-y-6">
                  <div class="bg-blue-50 p-6 rounded-xl border-l-4 border-[#16578d]">
                    <h3 class="text-[#16578d] font-bold text-lg mb-4">
                      SURAT EDARAN KEPALA LAN NOMOR 8/K.1/HKM.02.3/2025 
                      <br />TENTANG PENGUKURAN KUALITAS KEBIJAKAN
                    </h3>
                  </div>
                  
                  <div class="space-y-6">
                    <div>
                      <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                        <span class="w-2 h-2 bg-[#16578d] rounded-full mr-3"></span>
                        Maksud Surat Edaran
                      </h4>
                      <p class="text-gray-700 mb-3">Memberikan acuan bagi:</p>
                      <ol class="list-decimal list-inside pl-4 space-y-2 text-gray-700">
                        <li>LAN untuk menyelenggarakan pengukuran kualitas kebijakan pada instansi pemerintah pusat dan instansi pemerintah daerah; dan</li>
                        <li>instansi pemerintah pusat dan instansi pemerintah daerah untuk melakukan pengukuran mandiri (self-asessment) kualitas kebijakan. </li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                        <span class="w-2 h-2 bg-[#16578d] rounded-full mr-3"></span>
                        Tujuan Penyusunan
                      </h4>
                      <ol class="list-decimal list-inside pl-4 space-y-2 text-gray-700">
                      Menjamin kelancaran dan ketepatan pelaksanaan pengukuran kualitas kebijakan pada instansi pemerintah pusat dan instansi pemerintah daerah. 
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-xl">
                  <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <iframe
                      src="/files/se-kepala-lan-nomor-8-tahun-2025.pdf"
                      width="100%"
                      height="500"
                      allow="autoplay"
                      class="w-full"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Kualifikasi Nilai -->
        <div class="mb-20">
          <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div class="text-center mb-12">
              <span class="inline-block px-4 py-2 bg-[#16578d]/10 text-[#16578d] rounded-full text-sm font-medium mb-4">
                Sistem Penilaian
              </span>
              <h2 class="text-3xl md:text-4xl font-bold text-[#16578d] mb-4">
                Kualifikasi Nilai IKK
              </h2>
              <p class="text-gray-600 max-w-2xl mx-auto">
                Klasifikasi tingkat kualitas kebijakan berdasarkan skor yang diperoleh
              </p>
            </div>

            <div class="max-w-4xl mx-auto">
              <div class="grid gap-4">
                <div v-for="(item, idx) in data" :key="idx" class="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div class="flex items-center p-6">
                    <div :class="[`w-4 h-12 rounded-full mr-6`, item.color]"></div>
                    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div class="font-bold text-lg text-gray-800">
                        {{ item.range }}
                      </div>
                      <div :class="[`font-bold text-xl flex items-center`, item.textColor]">
                        <span class="mr-2">
                          <template v-if="item.qualification === 'Unggul'">🏆</template>
                          <template v-else-if="item.qualification === 'Sangat Baik'">⭐</template>
                          <template v-else-if="item.qualification === 'Baik'">👍</template>
                          <template v-else-if="item.qualification === 'Cukup'">👌</template>
                          <template v-else-if="item.qualification === 'Kurang'">📝</template>
                        </span>
                        {{ item.qualification }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const data = [
  { range: '91,00 – 100', qualification: 'Unggul', color: 'bg-green-500', textColor: 'text-green-700' },
  { range: '80,00 – 90,99', qualification: 'Sangat Baik', color: 'bg-blue-500', textColor: 'text-blue-700' },
  { range: '65,00 – 79,99', qualification: 'Baik', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  { range: '50,00 – 64,99', qualification: 'Cukup', color: 'bg-orange-500', textColor: 'text-orange-700' },
  { range: '< 50,00', qualification: 'Kurang', color: 'bg-red-500', textColor: 'text-red-700' },
];

const dimensions = [
  { title: 'Perencanaan Kebijakan', icon: '📋', description: 'Proses perencanaan yang sistematis dan berbasis data' },
  { title: 'Implementasi Kebijakan', icon: '⚙️', description: 'Pelaksanaan kebijakan yang efektif dan efisien' },
  { title: 'Evaluasi dan Keberlanjutan', icon: '📊', description: 'Monitoring dan evaluasi berkelanjutan' },
  { title: 'Transparansi dan Partisipasi', icon: '👥', description: 'Keterbukaan dan pelibatan masyarakat' },
];
</script>
