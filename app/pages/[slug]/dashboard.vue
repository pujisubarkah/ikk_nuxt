<template>
	<div class="w-full px-4 md:px-8 py-6 md:py-10 bg-gray-50 min-h-screen">
		<div
			v-if="toast.show"
			class="fixed right-4 top-4 z-50 max-w-md rounded-lg border px-4 py-3 shadow-lg"
			:class="toast.variant === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'"
		>
			<p class="font-semibold">{{ toast.variant === 'error' ? 'Gagal' : 'Sukses' }}</p>
			<p class="text-sm">{{ toast.message }}</p>
		</div>

		<div class="mb-6 md:mb-8">
			<UiTabMenu :items="tabItems" :value="activeTab" @change="onTabChange" />
		</div>

		<div class="bg-white p-4 md:p-6 rounded-lg shadow">
			<div v-if="activeTab === 'approval'">
				<h2 class="text-xl md:text-2xl font-bold mb-4">Persetujuan Registrasi Koordinator Instansi</h2>

				<div v-if="usersError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					Gagal memuat data users: {{ usersError }}
				</div>

				<div v-if="isUsersLoading" class="flex justify-center items-center h-40">
					<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
				</div>

				<UiTable v-else :headers="approvalHeaders" :items="filteredUsers">
					<template #no="{ index }">{{ index + 1 }}</template>
					<template #nama="{ item }">{{ asUser(item).name }}</template>
					<template #instansi="{ item }">{{ asUser(item).instansi?.agency_name || 'Tidak Ada' }}</template>
					<template #email="{ item }">
						<span class="break-words max-w-xs inline-block">{{ asUser(item).email }}</span>
					</template>
					<template #telepon="{ item }">{{ asUser(item).phone || '-' }}</template>
					<template #status="{ item }">
						<span
							class="px-2 py-1 rounded-full text-xs"
							:class="asUser(item).status === 'aktif' ? 'bg-green-100 text-green-800' : asUser(item).status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'"
						>
							{{ asUser(item).status }}
						</span>
					</template>
					<template #surat="{ item }">
						<a
							v-if="getSuratPenunjukkanFile(item)"
							:href="getSuratPenunjukkanFile(item)"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline break-all"
						>
							Lihat Surat
						</a>
						<span v-else class="text-gray-500">Tidak Ada</span>
					</template>
					<template #jfak="{ item }">
						<button
							class="text-xl focus:outline-none"
							:class="getMelibatkanJfAnalis(item) ? 'text-green-500' : 'text-red-500'"
							title="Toggle JFAK"
							:disabled="isApprovingUser"
							@click="handleToggleJfak(asUser(item).id, !getMelibatkanJfAnalis(item))"
						>
							{{ getMelibatkanJfAnalis(item) ? '✔' : '✘' }}
						</button>
					</template>
					<template #aksi="{ item }">
						<button
							v-if="asUser(item).status === 'inactive' || asUser(item).status === 'nonaktif'"
							class="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base transition-colors"
							:disabled="isApprovingUser"
							@click="approveUser(asUser(item).id)"
						>
							{{ isApprovingUser ? 'Memproses...' : 'Setuju' }}
						</button>
					</template>
					<template #empty>
						<span class="text-gray-500">Tidak ada data koordinator instansi yang perlu disetujui</span>
					</template>
				</UiTable>
			</div>

			<div v-if="activeTab === 'penentuan_kornas'">
				<h2 class="text-xl md:text-2xl font-bold mb-4">Penentuan Koordinator Nasional untuk Koordinator Instansi</h2>

				<div v-if="kornasListError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					Gagal memuat data koordinator: {{ kornasListError }}
				</div>

				<div v-if="kornasOptionsError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					Gagal memuat opsi koordinator nasional: {{ kornasOptionsError }}
				</div>

				<div v-if="isKornasListLoading || isKornasOptionsLoading" class="flex justify-center items-center h-40">
					<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
				</div>

				<UiTable v-else :headers="kornasHeaders" :items="kornasList">
					<template #no="{ index }">{{ index + 1 }}</template>
					<template #nama="{ item }">{{ asKoornasEntry(item).name }}</template>
					<template #instansi="{ item }">{{ asKoornasEntry(item).instansi }}</template>
					<template #pilih="{ item }">
						<select
							v-model="selectedKornasByKoorins[asKoornasEntry(item).id]"
							class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
							:disabled="isAssigningKorwil"
						>
							<option :value="null">-- Pilih Koordinator Nasional --</option>
							<option v-for="kornas in kornasOptions" :key="kornas.value" :value="kornas.value">
								{{ kornas.label }}
							</option>
						</select>
					</template>
					<template #aksi="{ item }">
						<button
							class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1 rounded transition-colors"
							:disabled="isAssigningKorwil || !selectedKornasByKoorins[asKoornasEntry(item).id]"
							@click="saveKornasAssignment(asKoornasEntry(item).id)"
						>
							{{ isAssigningKorwil ? 'Menyimpan...' : 'Simpan' }}
						</button>
					</template>
					<template #empty>
						<span class="text-gray-500">Tidak ada koordinator instansi yang tersedia.</span>
					</template>
				</UiTable>
			</div>

			<div v-if="activeTab === 'penentuan_verif'">
				<h2 class="text-xl md:text-2xl font-bold mb-4">Penentuan Verifikator untuk Koordinator Nasional</h2>

				<div v-if="verifikatorError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					Gagal memuat daftar verifikator: {{ verifikatorError }}
				</div>

				<div v-if="kornasOptionsError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					Gagal memuat opsi koordinator nasional: {{ kornasOptionsError }}
				</div>

				<div v-if="isKornasOptionsLoading || isVerifikatorLoading" class="flex justify-center items-center h-40">
					<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
				</div>

				<UiTable v-else :headers="verifHeaders" :items="kornasOptions">
					<template #no="{ index }">{{ index + 1 }}</template>
					<template #nama="{ item }">{{ asKoornasOption(item).label }}</template>
					<template #verif1="{ item }">
						<select
							:value="getSelectedVerifValue(asKoornasOption(item).value, 0)"
							class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
							:disabled="isAssigningVerif"
							@change="onVerifikatorSelectChange(asKoornasOption(item).value, 0, ($event.target as HTMLSelectElement).value)"
						>
							<option value="">-- Pilih Verifikator --</option>
							<option v-for="verif in getFilteredVerifikators(asKoornasOption(item).value, 0)" :key="verif.id" :value="verif.id">
								{{ verif.name }}
							</option>
						</select>
					</template>
					<template #verif2="{ item }">
						<select
							:value="getSelectedVerifValue(asKoornasOption(item).value, 1)"
							class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
							:disabled="isAssigningVerif"
							@change="onVerifikatorSelectChange(asKoornasOption(item).value, 1, ($event.target as HTMLSelectElement).value)"
						>
							<option value="">-- Pilih Verifikator --</option>
							<option v-for="verif in getFilteredVerifikators(asKoornasOption(item).value, 1)" :key="verif.id" :value="verif.id">
								{{ verif.name }}
							</option>
						</select>
					</template>
					<template #verif3="{ item }">
						<select
							:value="getSelectedVerifValue(asKoornasOption(item).value, 2)"
							class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
							:disabled="isAssigningVerif"
							@change="onVerifikatorSelectChange(asKoornasOption(item).value, 2, ($event.target as HTMLSelectElement).value)"
						>
							<option value="">-- Pilih Verifikator --</option>
							<option v-for="verif in getFilteredVerifikators(asKoornasOption(item).value, 2)" :key="verif.id" :value="verif.id">
								{{ verif.name }}
							</option>
						</select>
					</template>
					<template #verif4="{ item }">
						<select
							:value="getSelectedVerifValue(asKoornasOption(item).value, 3)"
							class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
							:disabled="isAssigningVerif"
							@change="onVerifikatorSelectChange(asKoornasOption(item).value, 3, ($event.target as HTMLSelectElement).value)"
						>
							<option value="">-- Pilih Verifikator --</option>
							<option v-for="verif in getFilteredVerifikators(asKoornasOption(item).value, 3)" :key="verif.id" :value="verif.id">
								{{ verif.name }}
							</option>
						</select>
					</template>
					<template #aksi="{ item }">
						<button
							class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1 rounded transition-colors"
							:disabled="isAssigningVerif || isVerifRowEmpty(asKoornasOption(item).value)"
							@click="saveVerifikatorAssignment(asKoornasOption(item).value)"
						>
							{{ isAssigningVerif ? 'Menyimpan...' : 'Simpan' }}
						</button>
					</template>
					<template #empty>
						<span class="text-gray-500">Tidak ada koordinator nasional yang tersedia.</span>
					</template>
				</UiTable>
			</div>

			<div v-if="activeTab === 'helpdesk'">
				<h2 class="text-xl md:text-2xl font-bold mb-4">Dashboard Helpdesk</h2>

				<div v-if="helpdeskError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					Gagal memuat data helpdesk: {{ helpdeskError }}
				</div>

				<div v-if="isHelpdeskLoading" class="flex justify-center items-center h-40">
					<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
				</div>

				<UiTable v-else :headers="helpdeskHeaders" :items="sortedHelpdesk">
					<template #no="{ index }">{{ index + 1 }}</template>
					<template #tanggal="{ item }">{{ formatDate(asHelpdeskTicket(item).created_at) }}</template>
					<template #nama_lengkap="{ item }">{{ asHelpdeskTicket(item).nama_lengkap }}</template>
					<template #email_aktif="{ item }">{{ asHelpdeskTicket(item).email_aktif }}</template>
					<template #instansi="{ item }">{{ asHelpdeskTicket(item).instansi }}</template>
					<template #masalah="{ item }">{{ asHelpdeskTicket(item).masalah }}</template>
					<template #pesan="{ item }">
						<span class="break-words">{{ asHelpdeskTicket(item).pesan }}</span>
					</template>
					<template #empty>
						<span class="text-gray-500">Tidak ada data helpdesk yang tersedia</span>
					</template>
				</UiTable>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import UiTabMenu from '@/components/UI/UiTabMenu.vue';
import UiTable from '@/components/UI/UiTable.vue';

definePageMeta({ layout: 'sidebar' });

type TabKey = 'approval' | 'penentuan_kornas' | 'penentuan_verif' | 'helpdesk';

interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string | null;
	position: string | null;
	work_unit: string | null;
	active_year: string;
	status: 'aktif' | 'nonaktif' | 'inactive';
	instansi: {
		agency_id: string;
		agency_name: string;
	};
	surat_penunjukkan: {
		file: string;
		melibatkan_jf_analis: boolean;
	} | null;
	role_user: {
		role_id: string;
	};
}

interface KoornasEntry {
	id: number;
	name: string;
	instansi: string;
	koor_nasional: {
		id: number;
		name: string;
	} | null;
}

interface HelpdeskTicket {
	nama_lengkap: string;
	email_aktif: string;
	instansi: string;
	masalah: string;
	pesan: string;
	created_at: string;
}

interface KoornasOption {
	label: string;
	value: number;
}

interface Verifikator {
	id: number;
	name: string;
}

interface ToastState {
	show: boolean;
	message: string;
	variant: 'success' | 'error';
}

type TableHeader = {
	text: string;
	value: string;
	center?: boolean;
	right?: boolean;
	color?: string;
	width?: string;
};

const activeTab = ref<TabKey>('approval');

const tabItems = [
	{ value: 'approval', label: 'Persetujuan Registrasi' },
	{ value: 'penentuan_kornas', label: 'Penentuan Koor Nasional' },
	{ value: 'penentuan_verif', label: 'Penentuan Verifikator' },
	{ value: 'helpdesk', label: 'Dashboard Helpdesk' },
];

const approvalHeaders: TableHeader[] = [
	{ text: 'No', value: 'no', center: true, width: '64px' },
	{ text: 'Nama', value: 'nama', width: '200px' },
	{ text: 'Instansi', value: 'instansi', width: '220px' },
	{ text: 'Email', value: 'email', width: '240px' },
	{ text: 'Telepon', value: 'telepon', width: '140px' },
	{ text: 'Status', value: 'status', width: '130px' },
	{ text: 'Surat Penunjukkan', value: 'surat', width: '180px' },
	{ text: 'JFAK', value: 'jfak', center: true, width: '90px' },
	{ text: 'Aksi', value: 'aksi', width: '130px' },
];

const kornasHeaders: TableHeader[] = [
	{ text: 'No', value: 'no', center: true, width: '64px' },
	{ text: 'Nama Koordinator Instansi', value: 'nama', width: '260px' },
	{ text: 'Instansi', value: 'instansi', width: '220px' },
	{ text: 'Pilih Koordinator Nasional', value: 'pilih', width: '280px' },
	{ text: 'Aksi', value: 'aksi', width: '130px' },
];

const verifHeaders: TableHeader[] = [
	{ text: 'No', value: 'no', center: true, width: '64px' },
	{ text: 'Nama Koordinator Nasional', value: 'nama', width: '260px' },
	{ text: 'Verifikator 1', value: 'verif1', width: '220px' },
	{ text: 'Verifikator 2', value: 'verif2', width: '220px' },
	{ text: 'Verifikator 3', value: 'verif3', width: '220px' },
	{ text: 'Verifikator 4', value: 'verif4', width: '220px' },
	{ text: 'Aksi', value: 'aksi', width: '130px' },
];

const helpdeskHeaders: TableHeader[] = [
	{ text: 'No', value: 'no', center: true, width: '64px' },
	{ text: 'Tanggal', value: 'tanggal', width: '180px' },
	{ text: 'Nama Lengkap', value: 'nama_lengkap', width: '220px' },
	{ text: 'Email Aktif', value: 'email_aktif', width: '240px' },
	{ text: 'Instansi', value: 'instansi', width: '220px' },
	{ text: 'Masalah', value: 'masalah', width: '180px' },
	{ text: 'Pesan', value: 'pesan', width: '360px' },
];

function onTabChange(value: string) {
	activeTab.value = value as TabKey;
}

function asKoornasOption(item: unknown): KoornasOption {
	return item as KoornasOption;
}

function asUser(item: unknown): User {
	return item as User;
}

function getSuratPenunjukkanFile(item: unknown): string | undefined {
	return asUser(item).surat_penunjukkan?.file;
}

function getMelibatkanJfAnalis(item: unknown): boolean {
	return asUser(item).surat_penunjukkan?.melibatkan_jf_analis ?? false;
}

function asKoornasEntry(item: unknown): KoornasEntry {
	return item as KoornasEntry;
}

function asHelpdeskTicket(item: unknown): HelpdeskTicket {
	return item as HelpdeskTicket;
}

const usersData = ref<User[]>([]);
const helpdeskData = ref<HelpdeskTicket[]>([]);
const kornasList = ref<KoornasEntry[]>([]);
const kornasOptionsData = ref<Verifikator[]>([]);
const verifikatorList = ref<Verifikator[]>([]);
const allAssignedVerifikators = ref<Record<number, { id: string; name: string }[]>>({});

const usersError = ref('');
const helpdeskError = ref('');
const kornasListError = ref('');
const kornasOptionsError = ref('');
const verifikatorError = ref('');

const isUsersLoading = ref(false);
const isHelpdeskLoading = ref(false);
const isKornasListLoading = ref(false);
const isKornasOptionsLoading = ref(false);
const isVerifikatorLoading = ref(false);

const isApprovingUser = ref(false);
const isAssigningKorwil = ref(false);
const isAssigningVerif = ref(false);

const selectedKornasByKoorins = ref<Record<number, number | null>>({});
const selectedVerifsByKoornas = ref<Record<number, Array<number | ''>>>({});

const toast = ref<ToastState>({ show: false, message: '', variant: 'success' });

function showToast(message: string, variant: 'success' | 'error') {
	toast.value = { show: true, message, variant };
	setTimeout(() => {
		toast.value.show = false;
	}, 3000);
}

async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}`);
	}
	return (await response.json()) as T;
}

async function loadUsers() {
	isUsersLoading.value = true;
	usersError.value = '';
	try {
		usersData.value = await fetchJson<User[]>('/api/users');
	} catch (error) {
		usersError.value = error instanceof Error ? error.message : 'Unknown error';
		usersData.value = [];
	} finally {
		isUsersLoading.value = false;
	}
}

async function loadHelpdesk() {
	isHelpdeskLoading.value = true;
	helpdeskError.value = '';
	try {
		helpdeskData.value = await fetchJson<HelpdeskTicket[]>('/api/helpdesk');
	} catch (error) {
		helpdeskError.value = error instanceof Error ? error.message : 'Unknown error';
		helpdeskData.value = [];
	} finally {
		isHelpdeskLoading.value = false;
	}
}

async function loadKornasList() {
	isKornasListLoading.value = true;
	kornasListError.value = '';
	try {
		kornasList.value = await fetchJson<KoornasEntry[]>('/api/koornas');
		const initial: Record<number, number | null> = {};
		for (const item of kornasList.value) {
			initial[item.id] = item.koor_nasional?.id ?? null;
		}
		selectedKornasByKoorins.value = initial;
	} catch (error) {
		kornasListError.value = error instanceof Error ? error.message : 'Unknown error';
		kornasList.value = [];
	} finally {
		isKornasListLoading.value = false;
	}
}

async function loadKornasOptions() {
	isKornasOptionsLoading.value = true;
	kornasOptionsError.value = '';
	try {
		kornasOptionsData.value = await fetchJson<Verifikator[]>('/api/koornas/aktif');
	} catch (error) {
		kornasOptionsError.value = error instanceof Error ? error.message : 'Unknown error';
		kornasOptionsData.value = [];
	} finally {
		isKornasOptionsLoading.value = false;
	}
}

async function loadVerifikatorList() {
	isVerifikatorLoading.value = true;
	verifikatorError.value = '';
	try {
		verifikatorList.value = await fetchJson<Verifikator[]>('/api/users/verifikator');
	} catch (error) {
		verifikatorError.value = error instanceof Error ? error.message : 'Unknown error';
		verifikatorList.value = [];
	} finally {
		isVerifikatorLoading.value = false;
	}
}

async function loadAssignedVerifikators() {
	const map: Record<number, { id: string; name: string }[]> = {};
	await Promise.all(
		kornasOptionsData.value.map(async (koornas) => {
			try {
				const response = await fetchJson<{ id: string; name: string }[]>(`/api/koordinator_utama/${koornas.id}/verifikator`);
				map[koornas.id] = response || [];
			} catch {
				map[koornas.id] = [];
			}
		})
	);

	allAssignedVerifikators.value = map;
	const initialSelected: Record<number, Array<number | ''>> = {};

	for (const koornas of kornasOptionsData.value) {
		const slots: Array<number | ''> = ['', '', '', ''];
		(map[koornas.id] || []).slice(0, 4).forEach((verif, idx) => {
			slots[idx] = Number(verif.id);
		});
		initialSelected[koornas.id] = slots;
	}

	selectedVerifsByKoornas.value = initialSelected;
}

const filteredUsers = computed(() =>
	usersData.value.filter((user) => user.role_user?.role_id === '4' && user.status === 'inactive')
);

const sortedHelpdesk = computed(() =>
	[...helpdeskData.value].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
);

const kornasOptions = computed<KoornasOption[]>(() =>
	kornasOptionsData.value.map((item) => ({ label: item.name, value: item.id }))
);

function formatDate(value: string): string {
	return new Date(value).toLocaleDateString('id-ID', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

async function approveUser(userId: number) {
	isApprovingUser.value = true;
	try {
		await $fetch('/api/approveUser', {
			method: 'POST',
			body: { userId },
		});

		const currentAdminId = import.meta.client ? Number(localStorage.getItem('id')) : null;
		if (currentAdminId) {
			await $fetch('/api/notifikasi', {
				method: 'POST',
				body: {
					user_id: userId,
					pesan: 'Akun anda telah disetujui, silakan ajukan kebijakan.',
					dibaca: false,
					created_by: currentAdminId,
				},
			});
		}

		showToast('User berhasil disetujui dan notifikasi telah dikirim.', 'success');
		await loadUsers();
	} catch (error) {
		showToast(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
	} finally {
		isApprovingUser.value = false;
	}
}

async function handleToggleJfak(userId: number, value: boolean) {
	try {
		await $fetch(`/api/jfak/${userId}`, {
			method: 'PUT',
			body: { melibatkan_jf_analis: value },
		});
		showToast('Status JFAK berhasil diperbarui.', 'success');
		await loadUsers();
	} catch (error) {
		showToast(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
	}
}

async function saveKornasAssignment(koorInstansiId: number) {
	const selectedKornasId = selectedKornasByKoorins.value[koorInstansiId];
	if (!selectedKornasId) {
		showToast('Silakan pilih koordinator nasional.', 'error');
		return;
	}

	isAssigningKorwil.value = true;
	try {
		await $fetch('/api/penentuan-koornas', {
			method: 'POST',
			body: {
				koor_instansi_id: koorInstansiId,
				koor_nasional_id: selectedKornasId,
			},
		});

		const currentAdminId = import.meta.client ? Number(localStorage.getItem('id')) : null;
		if (currentAdminId) {
			await $fetch('/api/notifikasi', {
				method: 'POST',
				body: {
					user_id: selectedKornasId,
					pesan: 'Selamat Anda telah ditetapkan sebagai koordinator nasional.',
					dibaca: false,
					created_by: currentAdminId,
				},
			});
		}

		showToast('Koordinator Nasional berhasil ditetapkan.', 'success');
		await loadKornasList();
	} catch (error) {
		showToast(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
	} finally {
		isAssigningKorwil.value = false;
	}
}

function getSelectedVerifValue(koornasId: number, slotIdx: number): string | number {
	const slots = selectedVerifsByKoornas.value[koornasId] || ['', '', '', ''];
	return slots[slotIdx] ?? '';
}

function isVerifRowEmpty(koornasId: number): boolean {
	const slots = selectedVerifsByKoornas.value[koornasId] || ['', '', '', ''];
	return slots.every((v) => v === '');
}

function allUsedVerifikatorIds(exceptKoornasId: number): number[] {
	const ids: number[] = [];
	for (const [key, slots] of Object.entries(selectedVerifsByKoornas.value)) {
		if (Number(key) === exceptKoornasId) continue;
		for (const val of slots) {
			if (typeof val === 'number') ids.push(val);
		}
	}
	return ids;
}

function getFilteredVerifikators(koornasId: number, slotIdx: number): Verifikator[] {
	const slots = selectedVerifsByKoornas.value[koornasId] || ['', '', '', ''];
	const currentValue = slots[slotIdx];
	const usedInOtherRows = allUsedVerifikatorIds(koornasId);
	const usedInCurrentRow = slots.filter((v, idx) => idx !== slotIdx && typeof v === 'number') as number[];

	return [...verifikatorList.value]
		.filter((v) => {
			return !usedInOtherRows.includes(v.id) || usedInCurrentRow.includes(v.id) || v.id === currentValue;
		})
		.sort((a, b) => a.name.localeCompare(b.name));
}

function onVerifikatorSelectChange(koornasId: number, slotIdx: number, rawValue: string) {
	const value: number | '' = rawValue === '' ? '' : Number(rawValue);
	const slots = [...(selectedVerifsByKoornas.value[koornasId] || ['', '', '', ''])] as Array<number | ''>;
	slots[slotIdx] = value;

	if (value !== '' && slots.filter((v, idx) => idx !== slotIdx && v === value).length > 0) {
		slots[slotIdx] = '';
		showToast('Verifikator tidak boleh dipilih lebih dari sekali.', 'error');
	}

	selectedVerifsByKoornas.value = {
		...selectedVerifsByKoornas.value,
		[koornasId]: slots,
	};
}

async function saveVerifikatorAssignment(koornasId: number) {
	const selected = (selectedVerifsByKoornas.value[koornasId] || []).filter((v): v is number => typeof v === 'number');
	if (selected.length < 1) {
		showToast('Pilih minimal satu verifikator.', 'error');
		return;
	}

	isAssigningVerif.value = true;
	try {
		await $fetch('/api/assign-verifikator', {
			method: 'POST',
			body: {
				koor_nasional_id: koornasId,
				verifikator_ids: selected,
			},
		});

		const currentAdminId = import.meta.client ? Number(localStorage.getItem('id')) : null;
		if (currentAdminId) {
			await Promise.all(
				selected.map((verifId) =>
					$fetch('/api/notifikasi', {
						method: 'POST',
						body: {
							user_id: verifId,
							pesan: 'Selamat Anda telah menjadi Verifikator.',
							dibaca: false,
							created_by: currentAdminId,
						},
					})
				)
			);
		}

		showToast('Verifikator berhasil ditetapkan dan notifikasi terkirim.', 'success');
		await loadAssignedVerifikators();
	} catch (error) {
		showToast(`Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
	} finally {
		isAssigningVerif.value = false;
	}
}

onMounted(async () => {
	await Promise.all([loadUsers(), loadHelpdesk(), loadKornasList(), loadKornasOptions(), loadVerifikatorList()]);
	await loadAssignedVerifikators();
});
</script>
