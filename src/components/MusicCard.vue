<template>
    <div class="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4 mb-4 ">
        <!-- 歌曲名 -->
        <div class="flex justify-between items-center ">
            <div class="text-lg font-bold flex items-center" style="color: #C20C0C;">{{ songTitle }}</div>
            <!-- 可视化切换按钮 -->
            <button @click="useAnalyser = !useAnalyser"
                class=" text-sm text-white bg-[#C20C0C] hover:bg-blue-700 rounded-full px-2 py-1 shadow-md">
                可视化切换
            </button>
        </div>
        <p class="text-sm text-gray-500">{{ artistName }}</p>


        <!-- 可视化区域 -->
        <div v-if="useAnalyser == true" class=" p-2 rounded-lg bg-gray-100">
            <div class="flex items-center space-x-2">
                <button @click="initAnalyser"
                    class="text-sm text-white bg-[#C20C0C] hover:bg-red-700 rounded-full px-2 py-1 shadow-md">
                    Got
                </button>
                <audio controls ref="audio" :src="finalAudioSrc" crossOrigin="anonymous" class="flex-grow"></audio>
            </div>
            <canvas ref="canvas" class="w-full h-24 mt-2 rounded-lg bg-white"></canvas>
        </div>

        <!-- 默认音频区域 -->
        <div v-else>
            <audio controls :src="audioSrc" class="w-full bg-gray-100 rounded-md shadow-sm"></audio>
        </div>
    </div>
</template>

<script>
//import leicaAudio from '@/assets/leica.mp3';
import { fetchFinalMusicUrl } from '../api/netcloud-music'
export default {
    name: 'MusicCard',
    props: {
        songTitle: String,
        artistName: String,
        audioSrc: String,
    },
    data() {
        return {
            useAnalyser: false,
            audioCtx: null,
            analyser: null,
            dataArray: null,
            bufferLength: null,
            //example_src: "//m8.music.126.net/21180815163607/04976f67866d4b4d11575ab418904467/ymusic/515a/5508/520b/f0cf47930abbbb0562c9ea61707c4c0b.mp3",
            //test_src: "http://m801.music.126.net/20240808182154/b22a7becf2727029488746398929f234/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/34569569119/d520/365b/14c9/bc9b12c7d5aeb0da4e3c1615b02c86e7.mp3",
            //test_src: "https://music.163.com/song/media/outer/url?id=1991309789.mp3",
            finalAudioSrc: "",
        };
    },
    mounted() {
        //this.getTrueUrl()
        //this.setupCanvas();

    },
    methods: {
        async getTrueUrl() {
            const trueUrl = await fetchFinalMusicUrl(this.audioSrc)
            console.log(trueUrl)
            this.finalAudioSrc = trueUrl
            console.log('finalAudioSrc', this.finalAudioSrc)
        },

        async initAnalyser() {
            await this.getTrueUrl()
            this.initializeAudioContext()
        },
        initializeAudioContext() {
            // 这吊东西有问题
            if (this.audioCtx) return;

            const audio = this.$refs.audio;
            // 可能是外链的问题
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            // 关键还是接口
            const source = this.audioCtx.createMediaElementSource(audio);

            this.analyser = this.audioCtx.createAnalyser();

            source.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);

            this.analyser.fftSize = 512;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.renderFrame();
        },
        draw() {
            const canvas = this.$refs.canvas;
            const canvasCtx = canvas.getContext('2d');
            const drawVisual = () => {
                requestAnimationFrame(drawVisual);
                this.analyser.getByteTimeDomainData(this.dataArray);

                canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

                canvasCtx.beginPath();

                const sliceWidth = (canvas.width * 1.0) / this.bufferLength;
                let x = 0;

                for (let i = 0; i < this.bufferLength; i++) {
                    const v = this.dataArray[i] / 128.0;
                    const y = (v * canvas.height) / 2;

                    if (i === 0) {
                        canvasCtx.moveTo(x, y);
                    } else {
                        canvasCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                canvasCtx.lineTo(canvas.width, canvas.height / 2);
                canvasCtx.stroke();
            };

            drawVisual();
        },
        renderFrame() {
            const canvas = this.$refs.canvas;
            // Match canvas dimensions to CSS dimensions
            let WIDTH = canvas.width;
            let HEIGHT = canvas.height;
            console.log('Canvas:', WIDTH, HEIGHT)
            const ctx = canvas.getContext('2d');

            let barWidth = WIDTH / this.bufferLength * 1.5;
            let barHeight;
            const drawVisual = () => {
                requestAnimationFrame(drawVisual);
                this.analyser.getByteFrequencyData(this.dataArray)
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                for (var i = 0, x = 0; i < this.bufferLength; i++) {
                    barHeight = this.dataArray[i] / 2;
                    var r = barHeight + 25 * (i / this.bufferLength);
                    var g = 250 * (i / this.bufferLength);
                    var b = 50;

                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                    x += barWidth + 2;
                }
            }
            drawVisual();






        }
    },
};
</script>

<style scoped></style>