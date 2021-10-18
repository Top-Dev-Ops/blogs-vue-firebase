<template>
    <div class="post-preview" v-if="currentPost">
        <div class="container quillWrapper">
            <h2>{{this.currentPost[0].title}}</h2>
            <h4>
                Posted on: {{new Date(this.currentPost[0].date).toLocaleString('en-us', { dateStyle: 'long' })}}
            </h4>
            <img :src="this.currentPost[0].photoFileUrl" alt="" />
            <div
                class="post-content ql-editor"
                v-html="this.currentPost[0].html"
            ></div>
        </div>        
    </div>
</template>

<script>
export default {
    name: "ViewPost",
    data() {
        return {
            currentPost: null,
        }
    },
    async mounted() {
        this.currentPost = await this.$store.state.blogs.filter(post => {
            return post.id === this.$route.params.postId
        })
    },
}
</script>

<style lang="scss">
    .post-preview {
        h4 {
            font-weight: 400;
            font-size: 14px;
            margin-bottom: 24px;
        }
    }
</style>