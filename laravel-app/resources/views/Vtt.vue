<template>
    <v-container>
        <h2>VTT</h2>
        <v-file-input
            style="width: 30rem"
            label="テキストファイルを選択してください"
            @change="fileSelected"
        ></v-file-input>
        <dragFilesDrop
            :selectFileHandler="fileSelect"
            dropAreaMessage="ファイルドロップ"
            :isAllowSameFileName="false"
            class="dropFileAreaApp"
        />
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
        };
    },

    methods: {
        async fileSelected(event) {
            this.files = event.target.files[0];
            this.fileName = event.target.files[0].name;
            console.log(this.fileInput, this.fileName);
            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                },
            };

            // Formデータ作成
            const formData = new FormData();

            formData.append("file", this.fileInput);
            formData.append("name", this.fileName);
            console.log(await formData.getAll("name"));
            // POST送信
            await axios
                .post("/vtt/upload", formData, config)
                .then(async (res) => {
                    // テストのため
                    console.log(res, "res");
                    await this.but();
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
                    this.audio = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
            this.audioFiles.push(this.audio);
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
</style>
