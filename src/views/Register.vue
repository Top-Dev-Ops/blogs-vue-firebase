<template>
    <div class="form-wrapper">
        <form class="register">
            <p class="login-register">
                Already have an account?
                <router-link class="router-link" :to="{name: 'Login'}">
                    Login
                </router-link>
            </p>

            <h2>Create Your FireBlog Account</h2>
            <div class="inputs">
                <div class="input">
                    <input type="text" placeholder="First Name" v-model="firstName" />
                    <UserIcon class="icon" />
                </div>
                <div class="input">
                    <input type="text" placeholder="Last Name" v-model="lastName" />
                    <UserIcon class="icon" />
                </div>
                <div class="input">
                    <input type="text" placeholder="Username" v-model="userName" />
                    <UserIcon class="icon" />
                </div>
                <div class="input">
                    <input type="text" placeholder="Email" v-model="email" />
                    <EmailIcon class="icon" />
                </div>
                <div class="input">
                    <input type="password" placeholder="Password" v-model="password" />
                    <PasswordIcon class="icon" />
                </div>

                <div v-show="error.error" class="error">{{error.message}}</div>
            </div>

            <button class="button" @click.prevent="register">Sign Up</button>

            <div class="angle"></div>
        </form>

        <div class="background"></div>
    </div>
</template>

<script>
import EmailIcon from "../assets/Icons/envelope-regular.svg"
import PasswordIcon from "../assets/Icons/lock-alt-solid.svg"
import UserIcon from "../assets/Icons/user-alt-light.svg"
import firebase from "firebase/app"
import "firebase/auth" 
import db from "../firebase/firebaseInit"

export default {
    name: "Register",
    components: {
        EmailIcon, PasswordIcon, UserIcon,
    },
    data() {
        return {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            userName: "",
            error: {
                error: null,
                message: "",
            },
        }
    },
    methods: {
        async register() {
            if (
                this.email !== "" &&
                this.password !== "" &&
                this.userName !== "" &&
                this.firstName !== "" &&
                this.lastName !== ""
            ) {
                this.error = {
                    error: false,
                    message: "",
                }
                const firebaseAuth = await firebase.auth()
                const createUser = await firebaseAuth.createUserWithEmailAndPassword(this.email, this.password)
                const result = await createUser
                const database = db.collection("users").doc(result.user.uid)
                await database.set({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    userName: this.userName,
                    email: this.email,
                })
                this.$router.push({ name: "Home" })
                return
            }
            this.error = {
                error: true,
                message: "Please fill out all the fields.",
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.register {
    h2 {
        max-width: 350px;
    }
}
</style>