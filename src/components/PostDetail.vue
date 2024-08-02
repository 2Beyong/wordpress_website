<template>
    <div v-if="post">
        <h1>{{ post.title.rendered }}</h1>
        <div v-html="post.content.rendered" class="article"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getPostById } from '../api/wordpress';

const route = useRoute();
const post = ref(null);

onMounted(async () => {
    try {
        const postId = route.params.id;
        post.value = await getPostById(postId);
    } catch (error) {
        console.error('Error fetching post:', error);
    }
});
</script>

<style>
.article {
    p {
        /*color: red*/
        margin: 0.5rem;
    }

}
</style>