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
import axios from 'axios';
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
                .post("/upload", formData, config)
                .then((res) => {
                    // テストのため
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        but() {
            console.log(this.fileInput);
        },
    },
};
</script>
