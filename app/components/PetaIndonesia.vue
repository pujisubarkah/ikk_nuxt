<template>
  <div>
    <h2 class="text-center text-2xl font-bold text-[#2c5282] mb-4">
      Peta Interaktif Instansi Pemerintah yang mengikuti Pengukuran Kualitas Kebijakan
    </h2>

    <div class="flex justify-between mb-4">
      <div>
        <label for="filter" class="mr-2 font-medium">Level:</label>
        <select
          id="filter"
          v-model="filter"
          class="px-3 py-2 border rounded-md"
        >
          <option value="provinsi">Pemerintah Provinsi</option>
          <option value="kabupaten">Pemerintah Kabupaten/Kota</option>
          <option value="kementerian">Kementerian/Lembaga</option>
        </select>
      </div>
      <div>
        <label class="mr-2 font-medium">Tahun:</label>
        <button
          v-for="year in years"
          :key="year"
          @click="selectedYear = year"
          :class="[
            'px-3 py-2 rounded-md mr-2',
            selectedYear === year ? 'bg-[#2c5282] text-white' : 'bg-white border'
          ]"
        >
          {{ year }}
        </button>
      </div>
    </div>

    <div class="mb-4 flex justify-center">
      <div class="text-[#16578d] px-6 py-3 rounded-lg shadow-md text-center font-sans flex items-center space-x-4">
        <div class="text-4xl font-extrabold">{{ countIKK }}</div>
        <div class="text-md font-semibold text-left">
          {{ filterLabel }} yang mengikuti pengukuran kualitas kebijakan <strong>{{ selectedYear }}</strong>
        </div>
      </div>
    </div>

    <l-map
      :zoom="zoom"
      :center="center"
      style="height: 600px; width: 100%"
      :useGlobalLeaflet="false"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <l-geo-json
        v-if="geoData"
        :geojson="filteredData"
        :options-style="styleFeature"
        :options-on-each-feature="onEachFeature"
      />
      <LegendControl v-if="filter !== 'kementerian'" />
      <template v-if="filter === 'kementerian' && apiData">
        <l-marker
          v-for="(item, idx) in apiData.data.filter(i => i[`predikat_${selectedYear}`])"
          :key="`lembaga-${idx}`"
          :lat-lng="getKementerianLatLng(item)"
        >
          <l-popup>
            <strong>{{ item.instansi_nama }}</strong>
          </l-popup>
        </l-marker>
      </template>
    </l-map>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { LMap, LTileLayer, LGeoJson, LMarker, LPopup, useMap } from 'vue-leaflet';
import 'leaflet/dist/leaflet.css';

const mapSources = {
  provinsi:
    'https://raw.githubusercontent.com/superpikar/indonesia-geojson/refs/heads/master/indonesia-province.json',
  kabupaten:
    'https://raw.githubusercontent.com/okzapradhana/indonesia-city-geojson/refs/heads/master/simplified-indonesia-cities.json',
  kementerian:
    'https://raw.githubusercontent.com/SakifAbdillah/jakartaKecamatanGeoJSON/refs/heads/master/kecamatan.geojson',
};

const years = ['2021', '2023', '2025'] as const;
type YearType = typeof years[number];
const filter = ref<'provinsi' | 'kabupaten' | 'kementerian'>('provinsi');
const selectedYear = ref<YearType>('2025');
interface FeatureCollection {
  type: string;
  features: any[];
  [key: string]: any;
}
const geoData = ref<FeatureCollection | null>(null);
interface ApiData {
  data: any[];
  [key: string]: any;
}
const apiData = ref<ApiData | null>(null);

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};

watch(filter, async () => {
  geoData.value = await fetcher(mapSources[filter.value]);
});

watch([filter, selectedYear], async () => {
  const apiEndpoint =
    filter.value === 'provinsi'
      ? `/api/ikk-hasil/provinsi/${selectedYear.value}`
      : filter.value === 'kabupaten'
      ? `/api/ikk-hasil/kabkot/${selectedYear.value}`
      : `/api/ikk-hasil/lembaga/${selectedYear.value}`;
  apiData.value = await fetcher(apiEndpoint);
});

// Initial fetch
geoData.value = await fetcher(mapSources[filter.value]);
apiData.value = await fetcher(`/api/ikk-hasil/provinsi/${selectedYear.value}`);

const filterLabel = computed(() =>
  filter.value === 'kementerian'
    ? 'Kementerian/Lembaga'
    : filter.value === 'provinsi'
    ? 'Pemerintah Provinsi'
    : 'Pemerintah Kabupaten/Kota'
);

const countIKK = computed(() =>
  apiData.value?.data?.filter((item: any) => !!item[`predikat_${selectedYear.value}`]).length ?? 0
);

const center = computed(() =>
  filter.value === 'kementerian' ? [-6.2, 106.8] : [-2.5, 118]
);
const zoom = computed(() => (filter.value === 'kementerian' ? 11 : 5));

const normalizeName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/(provinsi|kabupaten|kota|daerah khusus|daerah istimewa|\s|[^a-z0-9])/g, '')
    .trim();

const highlightNames = computed(() =>
  filter.value === 'provinsi' && apiData.value
    ? apiData.value.data
        .filter((item: any) => !!item[`predikat_${selectedYear.value}`])
        .map((item: any) => normalizeName(item.instansi_nama || ''))
    : []
);
const highlightCodes = computed(() =>
  filter.value === 'kabupaten' && apiData.value
    ? apiData.value.data
        .filter((item: any) => !!item[`predikat_${selectedYear.value}`])
        .map((item: any) => String(item.kd_kabkot))
    : []
);

const styleFeature = (feature: any) => {
  if (!feature) return {};
  const featureCode = String(feature.properties?.Code ?? feature.properties?.code ?? '');
  const rawName =
    feature.properties?.Propinsi ?? feature.properties?.kabupaten ?? feature.properties?.nama ?? '';
  const name = normalizeName(rawName);
  const isHighlight =
    filter.value === 'kabupaten'
      ? highlightCodes.value.includes(featureCode)
      : highlightNames.value.includes(name);
  return {
    fillColor: isHighlight ? '#3182ce' : '#fff',
    weight: 1,
    opacity: 1,
    color: isHighlight ? 'white' : '#ccc',
    dashArray: '3',
    fillOpacity: isHighlight ? 0.7 : 0.5,
  };
};

const onEachFeature = (feature: any, layer: any) => {
  const name =
    feature.properties?.Name ??
    feature.properties?.Province ??
    feature.properties?.Propinsi ??
    feature.properties?.kabupaten ??
    feature.properties?.nama ??
    'Wilayah';
  layer.bindTooltip(name, { permanent: false, direction: 'top' });
};

const filteredData = computed(() => {
  if (filter.value === 'kementerian' && geoData.value) {
    return {
      ...geoData.value,
      features: geoData.value.features.filter((feature: any) => {
        const name =
          (feature.properties?.Propinsi ??
            feature.properties?.kabupaten ??
            feature.properties?.nama ??
            '').toUpperCase();
        return name.includes('JAKARTA');
      }),
    };
  }
  return geoData.value;
});

function getKementerianLatLng(item: any) {
  const koor = item.instansi?.kementerian_kordinat?.[0];
  if (!koor || !koor.Latitude || !koor.Longitude) return [0, 0];
  return [koor.Latitude, koor.Longitude];
}
</script>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import * as L from 'leaflet';

export default defineComponent({
  name: 'LegendControl',
  setup() {
    onMounted(() => {
      const map = (window as any).LMapInstance;
      if (!map) return;
      const legend = new L.Control({ position: 'bottomright' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
          <div style="
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            font-size: 14px;
            line-height: 1.6;
          ">
            <strong>Legenda</strong><br/>
            <i style="background: #3182ce; width: 18px; height: 18px; display: inline-block; margin-right: 8px; border-radius: 4px;"></i>
            Wilayah dengan Penilaian IKK<br/>
            <i style="background: #fff; border: 1px solid #ccc; width: 18px; height: 18px; display: inline-block; margin-right: 8px; border-radius: 4px;"></i>
            Wilayah belum melakukan Penilaian IKK
          </div>
        `;
        return div;
      };
      legend.addTo(map);
    });
  },
});
</script>
