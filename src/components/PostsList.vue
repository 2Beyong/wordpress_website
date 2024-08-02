<template>
    <div>
        <h1>Blog Posts</h1>
        <ul>
            <li v-for="post in posts" :key="post.id">
                <router-link :to="{ name: 'post', params: { id: post.id } }">{{ post.title.rendered }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPosts } from '../api/wordpress';

const posts = ref([]);

onMounted(async () => {
    try {
        posts.value = await getPosts();
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
});
</script>