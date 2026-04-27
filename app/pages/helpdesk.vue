<template>
	<div class="flex flex-col items-center justify-center min-h-[60vh] py-12">
		<div class="w-full max-w-xl px-8 py-10 bg-white shadow-md rounded-lg">
			<div class="flex flex-col gap-6">
				<h1 class="text-3xl font-semibold text-[#16578d] mb-4">Helpdesk IKK</h1>
				<p class="text-gray-600 text-base leading-relaxed">
					Jika Anda mengalami kendala dalam pengisian IKK, silakan isi formulir di bawah ini
					atau hubungi tim helpdesk kami melalui surel
					<a href="mailto:ikk@lan.go.id" class="text-[#16578d] underline">ikk@lan.go.id</a>.
				</p>
				<form @submit.prevent="handleSubmit" class="bg-gray-50 shadow-sm border border-gray-200 p-8 rounded-lg space-y-6">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
						<input type="text" name="name" v-model="form.name" placeholder="Nama Lengkap" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none" required />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Email Aktif</label>
						<input type="email" name="email" v-model="form.email" placeholder="Email Aktif" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none" required />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Unit Kerja/Instansi</label>
						<input type="text" name="unit" v-model="form.unit" placeholder="Unit Kerja/Instansi" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Kategori Masalah</label>
						<select name="category" v-model="form.category" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none" required>
							<option value="">Pilih Kategori Masalah</option>
							<option value="TEKNIS">Masalah Teknis</option>
							<option value="LOGIN/AKSES">Login / Akses IKK</option>
							<option value="INSTRUMEN">Pengisian Instrumen IKK</option>
							<option value="LAINNYA">Lainnya</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Pesan / Permasalahan</label>
						<textarea name="message" rows="4" v-model="form.message" placeholder="Jelaskan permasalahan Anda..." class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#16578d] focus:outline-none" required />
					</div>
					<div v-if="notif" class="text-center">
						<span :class="notifType === 'success' ? 'text-green-600' : 'text-red-600'">{{ notif }}</span>
					</div>
					<div class="text-center">
						<button type="submit" class="bg-[#16578d] hover:bg-[#134c77] text-white px-6 py-2 rounded-md font-medium transition-colors duration-300">Kirim Permintaan</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({
	name: '',
	email: '',
	unit: '',
	category: '',
	message: ''
})
const notif = ref('')
const notifType = ref('success')

function handleSubmit() {
	// Simulasi submit sukses
	notif.value = 'Pesan Anda telah dikirim, dapatkan pemberitahuan melalui email.'
	notifType.value = 'success'
	form.value = { name: '', email: '', unit: '', category: '', message: '' }
	setTimeout(() => { notif.value = '' }, 4000)
}
</script>
