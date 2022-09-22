<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter()

const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${
        route.query.lat
      }&lon=${route.query.lng}&exclude={part}&appid=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&units=imperial`
    );

    // call current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.current.dt * 1000 + localOffset;
    weatherData.data.currentTime =
      utc + 1000 * weatherData.data.timezone_offset;

    // call hourly weather offset
    weatherData.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
    });

    // flicker delay
    await new Promise((res) => setTimeout(res, 1000))

    return weatherData.data;
  } catch (error) {
    console.error(error);
  }
};

const weatherData = await getWeatherData();
console.log(weatherData);

const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem('savedCities'))
  const updatedCities =  cities.filter(
    (city) => city.id !== route.query.id 
  )

  localStorage.setItem('savedCities', JSON.stringify(updatedCities))
   router.push({
    name: 'Home'
   })
}
</script>

<template>
  <div class="flex flex-col items-center flex-1">
    <!-- banner -->
    <div
      v-if="route.query.preview"
      class="w-full p-4 text-center text-white bg-weather-secondary"
    >
      <p>
        You are currently previewing this city, click "+" icon to start tracking
        to this city.
      </p>
    </div>

    <!-- weather overview  -->
    <div class="flex flex-col items-center py-12 text-white">
      <h1 class="mb-2 text-4xl">{{ route.params.city }}</h1>
      <p class="mb-12 text-sm">
        {{
          new Date(weatherData.currentTime).toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
            timeStyle: "short",
          })
        }}
      </p>
      <p class="mb-8 text-8xl">
        {{ Math.round(weatherData.current.temp) }} &deg;
      </p>
      <p>Feels like {{ Math.round(weatherData.current.feels_like) }} &deg;</p>
      <p class="capitalize">
        {{ weatherData.current.weather[0].description }}
      </p>
      <img
        class="w-[150px] h-auto"
        :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
      />
    </div>

    <hr class="w-full border border-white border-opacity-10" />

    <!-- hourly weather -->
    <div class="w-full max-w-screen-md py-12">
        <div class="mx-8 text-white">
             <h2 class="mb-4">Hourly Weather</h2>
             <div class="flex gap-10 overflow-x-scroll">
                <div 
                    v-for="hourData in weatherData.hourly" 
                    :key="hourData.dt" 
                    class="flex flex-col items-center gap-4"
                >
                    <p class="whitespace-nowrap text-md">
                        {{
                            new Date(
                                hourData.currentTime
                            ).toLocaleTimeString("en-us", {
                                hour: "numeric"
                            })
                        }}
                    </p>
                    <img 
                        class="w-auto h-[50px] object-cover"
                        :src="`https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
                    />
                    <p class="text-xl">
                        {{Math.round(hourData.temp)}} &deg;
                    </p>
                </div>
             </div>
        </div>
    </div>

    <hr class="w-full border border-white border-opacity-10" />

    <!-- weekly weather -->
    <div class="w-full max-w-screen-md py-12">
        <div class="mx-8 text-white">
            <h2 class="mb-4">7 Days Forecasct</h2>
            <div 
                v-for="day in weatherData.daily" 
                :key="day.dt"
                class="flex items-center"
            >
                <p class="flex-1">
                    {{
                        new Date(day.dt * 1000).toLocaleDateString("en-us", {
                            weekday: "long"
                        })
                    }}
                </p>
                <img 
                    class="w-[50px] h-[50px] object-cover"
                    :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                />
                <div class="flex justify-end flex-1 gap-2">
                    <p>H: {{Math.round(day.temp.max)}}</p>
                    <p>L: {{Math.round(day.temp.min)}}</p>
                </div>
            </div>  
        </div>
    </div>

    <div 
      class="flex items-center gap-2 py-12 text-white duration-150 cursor-pointer hove:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>Remove City</p>
    </div>

  </div>
</template>
