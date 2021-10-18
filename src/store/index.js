import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "firebase/app"
import "firebase/auth"
import db from "../firebase/firebaseInit"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    blog: {
      html: "Write your blog title...",
      title: "",
      photoName: null,
      photoFileUrl: null,
      photoPreview: null,
    },
    blogs: [],
    blogsLoaded: null,
    editPost: null,
    user: null,
    profile: {
      email: null,
      firstName: null,
      lastName: null,
      userName: null,
      id: null,
      initials: null,
      admin: null,
    }
  },
  mutations: {
    setBlog(state, payload) {
      state.blog = {
        ...state.blog,
        title: payload.title,
        html: payload.html,
        photoName: payload.photoName,
        photoFileUrl: payload.photoFileUrl,
      }
    },
    updateBlog(state, payload) {
      state.blog = {
        ...state.blog,
        [payload.key]: payload.value
      }
    },
    toggleEditPost(state, payload) {
      state.editPost = payload
    },
    updateUser(state, payload) {
      state.user = payload
    },
    setProfile(state, payload) {
      state.profile = {
        ...state.profile,
        email: payload.data().email,
        firstName: payload.data().firstName,
        lastName: payload.data().lastName,
        userName: payload.data().userName,
        id: payload.id,
        initials: payload.data().firstName.match(/(\b\S)?/g).join("") + payload.data().lastName.match(/(\b\S)?/g).join(""),
      }
    },
    updateProfileName(state, payload) {
      state.profile = {
        ...state.profile,
        [payload.key]: payload.value,
        initials: state.profile.firstName.match(/(\b\S)?/g).join("") + state.profile.lastName.match(/(\b\S)?/g).join(""),
      }
    },
    updateProfileAdmin(state, payload) {
      state.profile = {
        ...state.profile,
        admin: payload,
      }
    },
    filterBlogs(state, payload) {
      state.blogs = state.blogs.filter(post => post.id !== payload)
    },
  },
  getters: {
    blogsFeed(state) {
      return state.blogs.slice(0, 2)
    },
    blogsCards(state) {
      return state.blogs
    }
  },
  actions: {
    async getCurrentUser({ commit }, user) {
      const result = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
      commit("setProfile", result)
      const token = await user.getIdTokenResult()
      const admin = await token.claims.admin
      commit("updateProfileAdmin", admin)
    },
    async setCurrentUser({ state }) {
      await db.collection("users").doc(state.profile.id).update({
        firstName: state.profile.firstName,
        lastName: state.profile.lastName,
        userName: state.profile.userName,
      })
    },
    async getBlogs({ state }) {
      const results = await db.collection("blogPosts").orderBy("date", "desc").get()
      results.forEach(doc => {
        if (!state.blogs.some(blog => blog.id === doc.id)) {
          state.blogs.push(doc.data())
        }
      })
      state.blogsLoaded = true
    },
    async updateBlog({ commit, dispatch }, postId) {
      commit("filterBlogs", postId)
      await dispatch("getBlogs")
    },
    async deleteBlog({ commit }, postId) {
      await db.collection("blogPosts").doc(postId).delete()
      commit("filterBlogs", postId)
    },
  },
  modules: {
  }
})
