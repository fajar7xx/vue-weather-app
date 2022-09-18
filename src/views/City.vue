<script setup>
import AsyncCity from './AsyncCity.vue';

</script>

<template>
    <Suspense>
        <AsyncCity />

        <template #fallback>
            <p>Loading...</p>
        </template>
    </Suspense>
</template>