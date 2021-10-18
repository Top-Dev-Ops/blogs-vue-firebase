<template>
    <div class="modal" ref="modal">
        <div class="modal-content">
            <Close @click="closePreview" class="icon" />
            <img :src="this.$store.state.blog.photoFileUrl" alt="" />
        </div>
    </div>
</template>

<script>
import Close from "../assets/Icons/times-circle-light.svg"

export default {
    components: {
        Close,
    },
    methods: {
        closePreview() {
            this.$store.commit("updateBlog", { key: "photoPreview", value: false })
        },
    },
    computed: {
    },
}
</script>

<style lang="scss" scoped>
    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        background-color: rgba(0, 0, 0, .5);
        z-index: 99;

        .modal-content {
            display: flex;
            justify-content: center;
            position: relative;
            border-radius: 12px;
            width: 600px;
            height: 400px;
            padding: 50px;
            background-color: #fff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06);

            .icon {
                width: 24px;
                height: auto;
                cursor: pointer;
                font-size: 24px;
                position: absolute;
                top: 15px;
                right: 15px;
                color: #303030;
            }

            img {
                margin-top: 16px;
                display: block;
                width: auto;
                height: 100%;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06);
            }
        }
    }
</style>