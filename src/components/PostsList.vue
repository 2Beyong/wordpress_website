<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Blog Posts</h1>
        <ul class="space-y-4">
            <li v-for="post in posts" :key="post.id" class="p-4 border rounded-lg shadow">
                <router-link :to="{ name: 'post', params: { id: post.id } }"
                    class="text-blue-500 hover:underline text-2xl">
                    {{ post.title.rendered }}
                </router-link>

                <div class="text-gray-600">
                    <span>By {{ post.author_name }}</span> | <span>{{ formatDate(post.date) }}</span>

                    <span v-for="categoryId in post.categories" :key="categoryId" class="mr-2">
                        | {{ getCategoryName(categoryId) }}
                    </span>
                </div>
            </li>
        </ul>
        <div class="mt-4 flex justify-center space-x-2">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
                Previous
            </button>
            <span class="px-4 py-2">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
                Next
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPosts, getCategories } from '../api/wordpress';

const posts = ref([]);
const categories = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);

const fetchPosts = async (page) => {
    try {
        const { data, totalPages: pages } = await getPosts(page);
        posts.value = data.map(post => ({
            ...post,
            author_name: post._embedded.author[0].name,
        }));
        totalPages.value = pages;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

const fetchCategories = async () => {
    try {
        categories.value = await getCategories();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchPosts(page);
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

const getCategoryName = (id) => {
    const category = categories.value.find(cat => cat.id === id);
    return category ? category.name : 'Unknown';
};

onMounted(() => {
    fetchPosts(currentPage.value);
    fetchCategories();
});
</script>

<style scoped>
/* Add any custom styles here */
</style>