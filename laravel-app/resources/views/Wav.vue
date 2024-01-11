<template>
    <v-container>
        <h2>Wav</h2>
        <v-file-input
            style="width: 30rem"
            label="テキストファイルを選択してください"
            @change="fileSelected"
        ></v-file-input>
        <v-button @click="but">aa</v-button>
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
                .get("/upload")
                .then((res) => {
                    // テストのため
                    // console.log(res);
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        async but() {
            await axios
                .get("/upload", {
                    responseType: "blob",
                })
                .then((res) => {
                    console.log(res.data.type);
                    const blob = new Blob([res.data], { type: res.data.type });
                    saveAs(blob, "x.wav");
                });
        },
    },
};
</script>
