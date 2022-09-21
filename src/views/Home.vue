<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import CityList from "@/components/CityList.vue";

const router = useRouter()

const mapBoxAPIKey = import.meta.env.VITE_MAP_BOX_API_KEY
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResult = ref(null);
const searchError = ref(false);

const getSearchResult = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapBoxAPIKey}&types=place`
        );
        mapboxSearchResult.value = result.data.features;
        console.log(mapboxSearchResult.value);
        return;
      } catch {
        searchError.value = true;
      }
    }
    mapboxSearchResult.value = null;
  }, 300);
};

const previewCity = (searchResult) => {
  console.log(searchResult)
  const [city, state] = searchResult.place_name.split(",")
  console.log(city, state)

  router.push({
    name: 'City',
    params: {
      state: state.replaceAll(" ", ""),
      city: city.replaceAll(" ", "")
    },
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true
    }
  })
}
</script>

<template>
  <main class="container text-white">
    <div class="relative pt-4 mb-8">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResult"
        name="search"
        id="search"
        class="py-4 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:shadow-[0px_1px_0_0_#04e71]"
        placeholder="search for a ciry or state"
      />

      <ul
        class="absoulute bg-weather-secondary text-white w-fulll shadow-md py-2 px-1 top-[66px]"
        v-if="mapboxSearchResult"
      >
        <p v-if="searchError">Sorry, something went wrong, please try again.</p>
        <p v-if="!searchError && mapboxSearchResult.length === 0">
          No result match your query, try different term.
        </p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResult"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>

    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <p>Loading....</p>
        </template>
      </Suspense>
    </div>
  </main>
</template>
