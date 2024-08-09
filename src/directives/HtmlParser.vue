<!-- HtmlParser.vue -->
<template>
    <div ref="contentContainer"></div>
</template>

<script>
import { onMounted, ref, createApp, h } from 'vue';
import MusicCard from '../components/MusicCard.vue';

export default {
    props: {
        content: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const contentContainer = ref(null);

        onMounted(() => {
            if (contentContainer.value) {
                // Parse the HTML string into a DOM element
                contentContainer.value.innerHTML = props.content;

                // Find and replace <audio> elements
                const audioElements = contentContainer.value.querySelectorAll('.ncm-music');
                audioElements.forEach(audioEl => {

                    const audioComponent = document.createElement('div');


                    const songTitle = audioEl.querySelector('p:nth-of-type(1)').innerText;
                    const artistName = audioEl.querySelector('p:nth-of-type(2)').innerText;
                    const audioSrc = audioEl.querySelector('audio').src;

                    contentContainer.value.replaceChild(audioComponent, audioEl);
                    // Mount the AudioPlayer component in place of the <audio> element
                    const app = createApp({
                        render() {
                            return h(MusicCard, { songTitle, artistName, audioSrc });
                        }
                    });
                    app.mount(audioComponent);
                });
            }
        });

        return { contentContainer };
    }
};
</script>