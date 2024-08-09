<template>
    <div class="container mx-auto p-4">
        <!-- 标题和分页控制栏 -->
        <div class="flex justify-between items-center mb-6">
            <!-- 标题 -->
            <h1 class="text-3xl font-bold">文章总数: {{ totalCount }}</h1>
            <!-- 翻页器 -->
            <div class="flex items-center space-x-4">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-2 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
                    <IconPrevious />
                </button>
                <span class="px-2 py-2">{{ currentPage }} / {{ totalPages }}</span>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-2 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
                    <IconNext />
                </button>
            </div>
        </div>

        <!--正文-->
        <ul class="space-y-4">
            <li v-for="post in posts" :key="post.id" class="p-4 border rounded-lg shadow">
                <router-link :to="{ name: 'post', params: { id: post.id } }"
                    class="text-blue-500 hover:underline text-2xl ">
                    {{ post.title.rendered }}
                </router-link>

                <div class="text-gray-600 mt-4">
                    <span>By {{ post.author_name }}</span> | <span>{{ formatDate(post.date) }}</span>

                    <span v-for="categoryId in post.categories" :key="categoryId" class="mr-2">
                        | {{ getCategoryName(categoryId) }}
                    </span>
                </div>

                <div v-html="post.excerpt.rendered"></div>
            </li>
        </ul>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPosts, getCategories } from '../api/wordpress';
import { onActivated } from 'vue'

import IconPrevious from './icons/IconPrevious.vue';
import IconNext from './icons/IconNext.vue';

const posts = ref([]);
const categories = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const totalCount = ref(0);
const fetchPosts = async (page) => {
    try {
        const { data, totalPages: pages, total } = await getPosts(page);
        posts.value = data.map(post => ({
            ...post,
            author_name: post._embedded.author[0].name,
        }));
        totalPages.value = pages;
        totalCount.value = total;

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

// 生命周期
onMounted(() => {
    fetchPosts(currentPage.value);
    fetchCategories();
    console.log('[PostsList]: onMounted')
});

//
onActivated(() => {
    // 调用时机为首次挂载
    // 以及每次从缓存中被重新插入时
    console.log('[PostsList]: onActivated')
    // 预防以后的判定
});
</script>

<style scoped>
/* Add any custom styles here */
</style>