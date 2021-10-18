<template>
    <div class="create-post">
        <div class="container">
            <div :class="{'invisible': !error.error}" class="err-message">
                <p>
                    <span>Error: </span>
                    {{error.message}}
                </p>
            </div>

            <div class="blog-info">
                <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
                <div class="upload-file">
                    <label for="blog-photo">Upload Cover Photo</label>
                    <input
                        type="file"
                        ref="blogPhoto"
                        id="blog-photo"
                        accept=".png, .jpg, .jpeg"
                        @change="uploadFile"
                    />
                    <button
                        class="preview"
                        :class="{'button-inactive': !this.$store.state.blog.photoFileUrl}"
                        @click="openPreview"
                    >
                        Preview Photo
                    </button>
                    <span>File Chosen: {{this.$store.state.blog.photoName}}</span>
                </div>
            </div>

            <div class="editor">
                <vue-editor
                    :editorOptions="editorSettings"
                    v-model="blogHtml"
                    useCustomImageHandler
                    @image-added="imageHandler"
                />
            </div>

            <div class="blog-actions">
                <button class="button" @click="updatePost">Save Changes</button>
                <router-link class="router-button" :to="{name: 'PreviewPost'}">Post Preview</router-link>
            </div>
        </div>

        <BlogCoverPreview v-show="this.$store.state.blog.photoPreview" />
        <Loading v-show="loading" />
    </div>
</template>

<script>
import firebase from "firebase/app"
import "firebase/storage"
import db from "../firebase/firebaseInit"
import Quill from "quill"
window.Quill = Quill
const ImageResize = require("quill-image-resize-module").default
Quill.register("modules/ImageResize", ImageResize)
import BlogCoverPreview from "../components/BlogCoverPreview"
import Loading from "../components/Loading"

export default {
    name: "CreatePost",
    components: { BlogCoverPreview, Loading },
    data() {
        return {
            file: null,
            error: {
                error: null,
                message: "",
            },
            editorSettings: {
                modules: {
                    ImageResize: {}
                }
            },
            loading: false,
            currentBlog: null,
        }
    },
    computed: {
        blogCoverPhotoName() {
            return this.$store.state.blog.photoName
        },
        blogTitle: {
            get() {
                return this.$store.state.blog.title
            },
            set(payload) {
                this.$store.commit("updateBlog", { key: "title", value: payload })
            }
        },
        blogHtml: {
            get() {
                return this.$store.state.blog.html
            },
            set(payload) {
                this.$store.commit("updateBlog", { key: "html", value: payload })
            }
        },
    },
    async mounted() {
        this.currentBlog = await this.$store.state.blogs.filter(post => post.id === this.$route.params.postId)
        this.$store.commit("setBlog", {
            html: this.currentBlog[0].html,
            title: this.currentBlog[0].title,
            photoName: this.currentBlog[0].photoName,
            photoFileUrl: this.currentBlog[0].photoFileUrl,
        })
    },
    methods: {
        imageHandler(file, editor, cursorLocation, resetUploader) {
            const storageRef = firebase.storage().ref()
            const docRef = storageRef.child(`documents/blogPostPhotos/${file.name}`)
            docRef.put(file).on(
                "state_changed",
                () => {},
                (err) => console.log(err),
                async () => {
                    const downloadUrl = await docRef.getDownloadURL()
                    editor.insertEmbed(cursorLocation, "image", downloadUrl)
                    resetUploader()
                }
            )
        },
        uploadFile() {
            this.file = this.$refs.blogPhoto.files[0]
            const fileName = this.file.name
            this.$store.commit("updateBlog", { key: "photoName", value: fileName })
            this.$store.commit("updateBlog", { key: "photoFileUrl", value: URL.createObjectURL(this.file) })
        },
        async updatePost() {
            if (this.blogTitle.length !== 0 && this.blogHtml.length !== 0) {
                const database = await db.collection("blogPosts").doc(this.$route.params.postId)
                // new cover photo
                if (this.file) {
                    this.loading = true;
                    const storageRef = firebase.storage().ref()
                    const docRef = storageRef.child(`documents/blogCoverPhotos/${this.$store.state.blog.photoName}`)
                    docRef.put(this.file).on(
                        "state_changed",
                        () => {},
                        (err) => {
                            this.loading = false
                            console.log(err)
                        },
                        async () => {
                            const downloadUrl = await docRef.getDownloadURL()
                            await database.update({
                                html: this.blogHtml,
                                title: this.blogTitle,
                                photoName: this.blogCoverPhotoName,
                                photoFileUrl: downloadUrl,
                            })
                            await this.$store.dispatch("updateBlog", this.$route.params.postId)
                            this.loading = false
                            this.$router.push({ name: "ViewPost", params: { postId: database.id } })
                        }
                    )
                    return
                }
                // no cover photo - use existing cover photo in firebase storage
                this.loading = true
                await database.update({
                    html: this.blogHtml,
                    title: this.blogTitle,
                })
                await this.$store.dispatch("updateBlog", this.$route.params.postId)
                this.loading = false
                this.$router.push({name: "ViewPost", params: { postId: database.id }})
                return
            }
            this.error = {
                error: true,
                message: "Please ensure blog title and blog post has been filled out."
            }
            setTimeout(() => {
                this.error = {
                    error: null,
                    message: ""
                }
            }, 5000)
        },
        openPreview() {
            this.$store.commit("updateBlog", { key: "photoPreview", value: true })
        },
    },
}
</script>

<style lang="scss" scoped>
.create-post {
    position: relative;
    height: 100%;

    button {
        margin-top: 0;
    }

    .router-button {
        text-decoration: none;
        color: #fff;
    }

    label, button, .router-button {
        transition: .5s ease-in-out all;
        align-self: center;
        font-size: 14px;
        cursor: pointer;
        border-radius: 20px;
        padding: 12px 24px;
        color: #fff;
        background-color: #303030;
        text-decoration: none;

        &:hover {
            background-color: rgba(48, 48, 48, .7);
        }
    }

    .container {
        position: relative;
        height: 100%;
        padding: 10px 25px 60px;
    }

    // error styling
    .invisible {
        opacity: 0 !important;
    }
    .err-message {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        color: #fff;
        margin-bottom: 10px;
        background-color: #303030;
        opacity: 1;
        transition: .5s ease all;

        p {
            font-size: 16px;
        }

        span {
            font-weight: 600;
        }
    }

    .blog-info {
        display: flex;
        margin-bottom: 32px;

        input:nth-child(1) {
            min-width: 300px;
        }

        input {
            transition: .5s ease-in-out all;
            padding: 10px 4px;
            border: none;
            border-bottom: 1px solid #303030;

            &:focus {
                outline: none;
                box-shadow: 0 1px 0 0 #303030;
            }
        }

        .upload-file {
            display: flex;
            flex: 1;
            margin-left: 16px;
            position: relative;

            input {
                display: none;
            }

            .preview {
                margin-left: 16px;
                text-transform: initial;
                border: none;
            }

            span {
                font-size: 12px;
                margin-left: 16px;
                align-self: center;
            }
        }
    }

    .editor {
        height: 60vh;
        display: flex;
        flex-direction: column;

        .quillWrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .ql-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: scroll;
        }

        .ql-editor {
            padding: 20px 16px 30px;
        }
    }

    .blog-actions {
        margin-top: 30px;
        
        button {
            margin-right: 16px;
        }
    }
}
</style>