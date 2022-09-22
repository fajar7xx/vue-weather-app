<script setup>
import AsyncCity from './AsyncCity.vue';
import CityViewSkeleton from '@/components/CityViewSkeleton.vue';

</script>

<template>
    <Suspense>
        <AsyncCity />

        <template #fallback>
            <!-- <p>Loading...</p> -->
            <CityViewSkeleton />
        </template>
    </Suspense>
</template>