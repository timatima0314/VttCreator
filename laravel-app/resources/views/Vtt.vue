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
                <video v-if="videoPath" controls class="flex-item">
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
    </v-container>
</template>

<script>
import dragFilesDrop from "drag-files-drop";

//cssのインポートもしておきます。
import "drag-files-drop/dist/drag-files-drop.css";

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
        };
    },

    methods: {
        aa() {
            alert("akfja");
        },
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
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        demoPlay(filename) {
            const music = new Audio(`storage/${filename}`);
            music.play();
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
</style>
