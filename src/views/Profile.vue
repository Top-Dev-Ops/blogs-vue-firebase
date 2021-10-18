<template>
    <div class="profile">
        <div class="container">
            <h2>Account Settings</h2>

            <div class="profile-info">
                <div class="initials">{{$store.state.profile.initials}}</div>

                <div class="admin-badge">
                    <AdminIcon class="icon" />
                    <span>admin</span>
                </div>

                <div class="input">
                    <label for="firstName">First Name:</label>
                    <input type="text" id="firstName" v-model="firstName" />
                </div>
                <div class="input">
                    <label for="lastName">Last Name:</label>
                    <input type="text" id="lastName" v-model="lastName" />
                </div>
                <div class="input">
                    <label for="userName">Username:</label>
                    <input type="text" id="userName" v-model="userName" />
                </div>
                <div class="input">
                    <label for="email">Email:</label>
                    <input disabled type="text" id="email" v-model="email" />
                </div>

                <button class="button" @click.prevent="updateProfile">Save Changes</button>
            </div>
        </div>

        <Modal
            v-if="modalActive"
            :modalMessage="modalMessage"
            v-on:close-modal="closeModal"
        />
    </div>
</template>

<script>
import Modal from "../components/Modal"
import AdminIcon from "../assets/Icons/user-crown-light.svg"

export default {
    name: 'admin',
    components: {
        Modal, AdminIcon,
    },
    data() {
        return {
            modalMessage: "Changes were saved!",
            modalActive: null,
        }
    },
    methods: {
        updateProfile() {
            this.$store.dispatch("setCurrentUser")
            this.modalActive = !this.modalActive
        },
        closeModal() {
            this.modalActive = !this.modalActive
        }
    },
    computed: {
        firstName: {
            get() {
                return this.$store.state.profile.firstName
            },
            set(payload) {
                this.$store.commit("updateProfileName", { key: 'firstName', value: payload })
            },
        },
        lastName: {
            get() {
                return this.$store.state.profile.lastName
            },
            set(payload) {
                this.$store.commit("updateProfileName", { key: 'lastName', value: payload })
            },
        },
        userName: {
            get() {
                return this.$store.state.profile.userName
            },
            set(payload) {
                this.$store.commit("updateProfileName", { key: 'userName', value: payload })
            },
        },
        email() {
            return this.$store.state.profile.email
        },
    }
}
</script>

<style lang="scss" scoped>
.profile {
    .container {
        max-width: 1000px;
        padding: 60px 25px;

        h2 {
            text-align: center;
            margin-bottom: 16px;
            font-size: 32px;
            font-weight: 600;
        }

        .profile-info {
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06);
            padding: 32px;
            background-color: #f1f1f1;
            display: flex;
            flex-direction: column;
            max-width: 600px;
            margin: 32px auto;

            .initials {
                position: initial;
                width: 80px;
                height: 80px;
                font-size: 32px;
                background-color: #303030;
                color: #fff;
                display: flex;
                align-self: center;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }

            .admin-badge {
                display: flex;
                align-self: center;
                color: #fff;
                font-size: 14px;
                padding: 8px 24px;
                border-radius: 8px;
                background-color: #303030;
                margin: 16px 0;
                text-align: center;
                text-transform: capitalize;

                .icon {
                    width: 14px;
                    heigth: auto;
                    margin-right: 8px;
                }
            }

            .input {
                margin: 16px 0;

                label {
                    font-size: 14px;
                    display: block;
                    padding-bottom: 6px;
                }

                input {
                    width: 100%;
                    border: none;
                    background-color: #f2f7f6;
                    padding: 8px;
                    height: 50px;

                    &:focus {
                        outline: none;
                    }
                }
            }

            button {
                align-self: center;
            }
        }
    }
}
</style>