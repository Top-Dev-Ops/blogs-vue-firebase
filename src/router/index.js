import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import Blogs from "../views/Blogs.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import ForgotPassword from "../views/ForgotPassword.vue"
import Profile from "../views/Profile.vue"
import Admin from "../views/Admin.vue"
import CreatePost from "../views/CreatePost.vue"
import PreviewPost from "../views/PreviewPost.vue"
import ViewPost from "../views/ViewPost.vue"
import EditPost from "../views/EditPost.vue"
import firebase from "firebase/app"
import "firebase/auth"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
    },
  }, {
    path: "/blogs",
    name: "Blogs",
    component: Blogs,
    meta: {
      title: "Blogs",
    },
  }, {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login",
    },
  }, {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register",
    },
  }, {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: {
      title: "ForgotPassword",
    },
  }, {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: "Profile",
      requiresAuth: true,
    },
  }, {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      title: "Admin",
      requiresAuth: true,
      requiresAdmin: true,
    },
  }, {
    path: "/create-post",
    name: "CreatePost",
    component: CreatePost,
    meta: {
      title: "Create Post",
      requiresAuth: true,
      requiresAdmin: true,
    },
  }, {
    path: "/preview-post",
    name: "PreviewPost",
    component: PreviewPost,
    meta: {
      title: "Post Preview",
      requiresAuth: true,
      requiresAdmin: true,
    },
  }, {
    path: "/view-post/:postId",
    name: "ViewPost",
    component: ViewPost,
    meta: {
      title: "View Post",
      requiresAuth: true,
      requiresAdmin: true,
    },
  }, {
    path: "/edit-post/:postId",
    name: "EditPost",
    component: EditPost,
    meta: {
      title: "Edit Post",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | FireBlog`
  next()
})

router.beforeEach(async (to, from ,next) => {
  let user = firebase.auth().currentUser
  let admin = null
  if (user) {
    let token = await user.getIdTokenResult()
    admin = token.claims.admin
  }
  if (to.matched.some(res => res.meta.requiresAuth)) {
    if (user) {
      if (to.matched.some(res => res.meta.requiresAdmin)) {
        if (admin) {
          return next()
        }
        return next({ name: "Home" })
      }
      return next()
    }
    return next({ name: "Home" })
  }
  return next()
})

export default router
