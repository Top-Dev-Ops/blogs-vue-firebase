<template>
    <div class="post-preview">
        <div class="container quillWrapper">
            <h2>{{this.$store.state.blog.title}}</h2>
            <img :src="this.$store.state.blog.photoFileUrl" alt="" />
            <div
                class="post-content ql-editor"
                v-html="this.$store.state.blog.html"
            ></div>
        </div>        
    </div>
</template>

<script>
export default {
    name: "PreviewPost",
    computed: {},
}
</script>

<style lang="scss">
.post-preview {
    min-height: 100vh;

    .container {
        max-width: 1000px;
        padding: 60px 25px;
    }

    .ql-editor {
        padding: 0;
    }

    h2 {
        margin-bottom: 16px;
        font-weight: 300;
        font-size: 32px;
    }

    img {
        width: 100%;
        margin-bottom: 32px;
    }
}
</style>