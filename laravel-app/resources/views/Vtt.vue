<template>
    <v-container>
        <h2>VTT</h2>
        <v-file-input
            style="width: 30rem"
            label="テキストファイルを選択してください"
            type="file"
            @change="fileSelected"
        ></v-file-input>
        <dragFilesDrop
            :selectFileHandler="fileSelect"
            dropAreaMessage="ファイルドロップ"
            :isAllowSameFileName="false"
            class="dropFileAreaApp"
            style="margin: 0 auto"
        />
        <div>
            <div class="flex-box">
                <video v-if="videoPath" controls class="flex-item" id="video">
                    <source
                        :src="`storage/video/${videoPath}`"
                        type="video/mp4"
                    />
                </video>
                <div class="flex-item" v-else>
                    こちらに動画がアップロードされます。
                </div>

                <v-card class="flex-item" variant="tonal">
                    <v-list density="compact">
                        <v-list-subheader class="font-weight-black font-italic"
                            >再生する音声ファイル</v-list-subheader
                        >

                        <v-list-item
                            v-for="(item, i) in audioFiles"
                            :key="i"
                            :value="item"
                        >
                            <dev
                                @click="demoPlay(item.file_name)"
                                class="v-list-item-flex"
                            >
                                <v-list-item-title style="font-weight: bold"
                                    >{{ item.file_name }}
                                </v-list-item-title>
                                <v-list-item-title
                                    >{{ item.size }}
                                </v-list-item-title>
                            </dev>
                        </v-list-item>
                    </v-list>
                </v-card>
            </div>
        </div>
        <div class="d-flex align-center flex-column">
            <v-card width="500px">
                <div id="time" class="countTimer">00:00:00.000</div>
                <div class="timerButtons">
                    <v-btn
                        type="button"
                        @click="timeStart"
                        :disabled="startButtonDisabled"
                        color="grey-darken-3"
                        class="mr-2"
                        >start</v-btn
                    >
                    <v-btn
                        type="button"
                        @click="timeStop"
                        color="grey-darken-3"
                        :disabled="stopButtonDisabled"
                        class="mr-2"
                        >stop</v-btn
                    >
                    <v-btn
                        type="button"
                        color="grey-lighten-1"
                        @click="timeReset"
                        >reset</v-btn
                    >
                </div>
                <div class="d-flex align-center flex-column mb-6">
                    <v-btn
                        @click="continuousPlay"
                        color="blue-grey-darken-1"
                        :disabled="continuousPlayButtonDisabled"
                        >音声連続再生</v-btn
                    >
                </div>
            </v-card>
        </div>
        <v-btn @click="createVtt">VTT</v-btn>
        <div v-if="vttDisplay">
            <p>WEBVTT</p>
            <br/>
            <ul v-for="(item, i) in vttJson" :key="i">
                <li style="list-style: none;">
                    <p>{{ i }}</p>
                    <p>
                        {{ item.startTime }} --> {{ item.endTime }} 
                    </p>
                    <p>{{ item.text }}</p>
                    <br/>
                </li>
            </ul>

        </div>
    </v-container>
</template>

<script>
import dragFilesDrop, { f } from "drag-files-drop";
import dayjs from "dayjs";
//cssのインポートもしておきます。
import "drag-files-drop/dist/drag-files-drop.css";
let startTime;
// 停止時間
let stopTime = 0;
// タイムアウトID
let timeoutID;
let h;
let m;
let s;
let ms;
const now = dayjs(); // 現在の日付情報を取得
console.log(now.format());
export default {
    components: {
        dragFilesDrop,
    },
    data: () => {
        return {
            fileInput: "",
            fileName: "",
            files: "",
            audio: "",
            audioFiles: [],
            file: "",
            videoPath: "",
            startButtonDisabled: false,
            stopButtonDisabled: true,
            resetButtonDisabled: true,
            continuousPlayButtonDisabled: true,
            index: 0,
            vttJson: [],
            vtt:"",
            vttDisplay:false
        };
    },

    methods: {
        async fileSelected(event) {
            this.file = event.target.files[0];
            this.fileName = event.target.files[0].name;
            console.log(this.file, this.fileName);
            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                },
            };

            // Formデータ作成
            const formData = new FormData();

            formData.append("file", this.file);
            formData.append("name", this.fileName);
            console.log(await formData.getAll("name"));
            // POST送信
            await axios
                .post("/vtt/upload", formData, config)
                .then(async (res) => {
                    // テストのため
                    console.log(res, "res");
                    this.videoPath = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        async fileSelect(result, dropFiles) {
            if (!result) alert("同一名称のファイルは選択できません。");
            console.log(dropFiles[0]);
            console.log(dropFiles.slice(-1));
            this.files = dropFiles.slice(-1);
            // プロキシファイルは[0]指定で
            this.fileInput = this.files[0];
            this.fileName = this.files[0].name;
            console.log(this.files[0], this.fileName);
            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                },
            };
            console.log(this.fileInput, this.fileName);
            // Formデータ作成
            const formData = new FormData();

            formData.append("file", this.fileInput);
            formData.append("name", this.fileName);
            console.log(await formData.getAll("name"));
            // POST送信
            await axios
                .post("/vtt/uploads", formData, config)
                .then(async (res) => {
                    // テストのため
                    console.log(res.data);
                    this.audioFiles.push(res.data);
                    this.vttJson.push(res.data);
                    this.continuousPlayButtonDisabled = false;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        demoPlay(filename) {
            const music = new Audio(`storage/${filename}`);
            music.play();
        },
        continuousPlay() {
            const dammyDate = "2019-01-10";
            const addTime = this.audioFiles[this.index].size;
            const playFailName = this.audioFiles[this.index].file_name;
            const music = new Audio(`storage/${playFailName}`);
            music.play();

            let intTime = dayjs(`${dammyDate}${h}:${m}:${s}`)
                .add(addTime, "s")
                .format("YYYY-MM-DD HH:mm:ss");
            console.log(intTime);
            const res = intTime.slice(11, 19);
            console.log(res);
            this.vttJson[this.index].startTime = `${h}:${m}:${s}.${ms}`;
            this.vttJson[this.index].endTime = `${res}.${ms}`;
            if (this.audioFiles.length - 1 == this.index) {
                this.index = 0;
            } else {
                this.index++;
            }
            console.log(`${h}:${m}:${s}.${ms}`);
        },
        displayTime() {
            const currentTime = new Date(Date.now() - startTime + stopTime);
            // const h = String(currentTime.getHours() - 1).padStart(2, "0");
            h = String(currentTime.getHours() - 9).padStart(2, "0");
            m = String(currentTime.getMinutes()).padStart(2, "0");
            s = String(currentTime.getSeconds()).padStart(2, "0");
            ms = String(currentTime.getMilliseconds()).padStart(3, "0");
            // document.getElementById("time")を記述せずともtidを取得する
            time.textContent = `${h}:${m}:${s}.${ms}`;
            // console.log(currentTime);
            timeoutID = setTimeout(this.displayTime, 10);
        },
        timeStart() {
            this.startButtonDisabled = true;
            this.stopButtonDisabled = false;

            // stopButton.disabled = false;
            // resetButton.disabled = true;
            startTime = Date.now();
            this.displayTime();
            video.play();
        },
        timeStop() {
            {
                this.startButtonDisabled = false;
                this.stopButtonDisabled = true;
                // resetButton.disabled = false;
                clearTimeout(timeoutID);
                stopTime += Date.now() - startTime;
                console.log(`${h}:${m}:${s}.${ms}`);
                video.pause();
            }
        },
        timeReset() {
            time.textContent = "00:00.000";
            stopTime = 0;
            video.load();
        },
        createVtt() {
            this.vttDisplay=true;
            let vttItem = `WEBVTT
`;
for (let b = 0; b < this.vttJson.length; b++) {
vttItem = vttItem.concat(`
${b}
${this.vttJson[b].startTime} --> ${this.vttJson[b].endTime}
${this.vttJson[b].text}
`);
            }
            console.log(vttItem);
            this.vtt = vttItem
        },
    },
};
</script>

<style sscoped>
.dropFileAreaApp {
    font-size: 1em;
    color: gray;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    border: 7px solid gray;
    border-radius: 10px;
    text-align: center;
}
.dropFileAreaApp > div:first-child {
    width: 100%;
    height: 100%;
    line-height: 11;
}
.flex-box {
    display: flex;
    width: 100%;
}
.flex-item {
    width: 50%;
}
.v-list-item-flex {
    display: flex;
    width: 50%;
    justify-content: space-around;
}
.filesDrop div:nth-child(n + 2) {
    display: none;
}
.countTimer {
    text-align: center;
    font-size: 3rem;
    margin: 1rem;
}
.timerButtons {
    text-align: center;
    margin-bottom: 1.5rem;
}
</style>
