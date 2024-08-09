<!--
<template>
    <div v-if="post">
        <h1>{{ post.title.rendered }}</h1>
        <div v-html="post.content.rendered" class="post-content"></div>
    </div>
</template>
-->

<template>

    <div v-if="post" class="container mx-auto p-4 ">

        <!-- 返回按钮 -->
        <button @click="goBack"
            class="fixed  bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <!-- 图标可以使用一个SVG图标，下面是一个简单的箭头图标 -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <article class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md ">
            <h1 class="text-4xl font-bold mb-4">{{ post.title.rendered }}</h1>
            <div class="text-gray-600 mb-4">
                <span>By {{ post.author_name != undefined ? post.author_name : '未知' }}</span> | <span>{{
                    formatDate(post.date)
                }}</span>
            </div>
            <!-- <div v-html="post.content.rendered" class="post-content"></div> -->
            <!--<div v-html="formattedContent" class="post-content"></div>-->
            <HtmlParser :content="articleContent" class="post-content" />


        </article>


    </div>


</template>

<script setup>
import { ref, onMounted, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPostById } from '../api/wordpress';
import HtmlParser from '@/directives/HtmlParser.vue';
// import MusicCard from './MusicCard.vue'; // 引入新创建的 MusicCard 组件

const route = useRoute();
const post = ref(null);
const router = useRouter(); // 获取路由器实例
const articleContent = ref(null)


onMounted(async () => {
    try {
        const postId = route.params.id;
        post.value = await getPostById(postId);
        post.value.author_name = post.value._embedded.author[0].name

        articleContent.value = post.value.content.rendered;
        //formatContent();
    } catch (error) {
        console.error('Error fetching post:', error);
    }
});

// 返回按钮点击事件处理函数
const goBack = () => {
    router.back();
};
const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};


</script>

<style>
/* 文章容器样式 */
article {
    box-shadow: var(--tw-shadow-lg);
    border-radius: var(--tw-rounded-lg);
    overflow: hidden;
}

/* 标题样式 */
h1 {
    font-size: 2.25rem;
    /* text-4xl */
    font-weight: 700;
    /* font-bold */
    margin-bottom: 1rem;
    /* mb-4 */
}

/* 元数据样式 */
.text-gray-600 {
    color: #718096;
    /* text-gray-600 */
    margin-bottom: 1rem;
    /* mb-4 */
}

/* 文章内容样式 */
.post-content p {
    margin-bottom: 1rem;
    /* mb-4 */
    color: #4a5568;
    /* text-gray-700 */
}

/* 标题样式 */
.post-content h1,
.post-content h2,
.post-content h3,
.post-content h4,
.post-content h5,
.post-content h6 {
    font-weight: 700;
    /* font-bold */
    margin-top: 1rem;
    /* my-4 */
    margin-bottom: 1rem;
    /* my-4 */
}

.post-content h1 {
    font-size: 1.5rem;
    /* text-2xl */
}

.post-content h2 {
    font-size: 1.25rem;
    /* text-xl */
}

.post-content h3 {
    font-size: 1.125rem;
    /* text-lg */
}

.post-content h4 {
    font-size: 1rem;
    /* text-base */
}

/* 列表样式 */
.post-content ul,
.post-content ol {
    margin-left: 1.25rem;
    /* ml-5 */
    list-style-type: disc;
    /* list-disc */
    list-style-position: inside;
    /* list-inside */
    margin-bottom: 1rem;
    /* mb-4 */
}

/* 链接样式 */
.post-content a {
    color: #4299e1;
    /* text-blue-500 */
    text-decoration: underline;
    /* hover:underline */
}

/* 引用块样式 */
.post-content blockquote {
    border-left-width: 0.25rem;
    /* border-l-4 */
    border-color: #e2e8f0;
    /* border-gray-300 */
    padding-left: 1rem;
    /* pl-4 */
    font-style: italic;
    /* italic */
    margin-top: 1rem;
    /* my-4 */
    margin-bottom: 1rem;
    /* my-4 */
    color: #718096;
    /* text-gray-600 */
}

/* 行内代码样式 */
.post-content code {
    background-color: #f7fafc;
    /* bg-gray-100 */
    padding: 0.25rem;
    /* p-1 */
    border-radius: 0.25rem;
    /* rounded */
}

/* 图片样式 */
.post-content img {
    width: 100%;
    /* w-full */
    height: auto;
    /* h-auto */
    border-radius: 0.5rem;
    /* rounded-lg */
    box-shadow: var(--tw-shadow-md);
    /* shadow-md */
    margin-bottom: 1rem;
    /* mb-4 */
}
</style>