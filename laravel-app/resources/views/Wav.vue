<template>
    <v-container>
        <h2>Wav</h2>
        <v-file-input
            style="width: 30rem"
            label="テキストファイルを選択してください"
            @change="fileSelected"
        ></v-file-input>
        <v-button @click="but">aa</v-button>
        <v-card class="flex-left" max-width="500" variant="tonal">
            <v-list density="compact">
                <v-list-subheader class="font-weight-black font-italic"
                    >ダウンロード可能なファイル</v-list-subheader
                >

                <v-list-item
                    v-for="(item, i) in downloadFile"
                    :key="i"
                    :value="item"
                >
                    <v-list-item-title
                        >{{ item
                        }}<v-btn
                            @click="download(i)"
                            size="x-small"
                            variant="outlined"
                            >ダウンロード</v-btn
                        >
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
    </v-container>
</template>

<script>
import axios from "axios";
import { saveAs } from "file-saver";

export default {
    data: () => {
        return {
            fileInput: "",
            fileName: "",
            downloadFile: "",
        };
    },

    methods: {
        async fileSelected(event) {
            console.log(event.target.files[0]);
            this.fileInput = event.target.files[0];
            this.fileName = event.target.files[0].name;
            // ヘッダー定義
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
                .post("/upload", formData, config)
                .then(async (res) => {
                    // テストのため
                    console.log(res, "res");
                    await this.but();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        async but() {
            await axios.get("/download").then((res) => {
                console.log(res.data);
                this.downloadFile = res.data;
                console.log(this.downloadFile);
            });
        },
        async download(index) {
            console.log(index);
            await axios
                .get(`/dl/${index}`, {
                    responseType: "blob",
                })
                .then((res) => {
                    console.log(res.data.type);
                    const blob = new Blob([res.data], { type: res.data.type });
                    saveAs(blob, "x.wav");
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>
.get("/upload", { responseType: "blob", }) .then((res) => {
console.log(res.data.type); const blob = new Blob([res.data], { type:
res.data.type }); saveAs(blob, "x.wav"); });

<style scoped>
.downloadList {
    background-color: rgb(245, 239, 239);
    width: 30rem;
}
</style>
