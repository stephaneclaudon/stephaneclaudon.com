import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import { State } from './store/state'
import getters from './store/getters'
import mutations from './store/mutations'
//@ts-ignore
import Stats from './lib/stats.min.js'
import jsonData from "./assets/data/data.json";
import Global from "./Global";

let GlobalInstance = new Global();
GlobalInstance.setMediaPath();

Vue.use(Vuex);
Vue.use(VueRouter);

const state = new State();
state.projects = jsonData;

let routes: Array<any> = [];
routes.push(
  {
    path: '/', name: 'home', component: App,
    meta: {
      title: 'Stéphane Claudon - Freelance video',
      metaTags: [
        {
          name: 'description',
          content: 'Stéphane Claudon - Freelance video.'
        },
        {
          property: 'og:description',
          content: 'Stéphane Claudon - Freelance video.'
        }
      ]
    }
  },
  { path: '/contact', name: 'contact', component: App }
);

for (let index = 0; index < state.projects.length; index++) {
  routes.push(
    {
      path: '/project/' + state.projects[index].id,
      name: state.projects[index].id,
      component: App,
      meta: {
        title: state.projects[index].client + " - " + state.projects[index].title,
        metaTags: [
          {
            name: 'description',
            content: state.projects[index].description
          },
          {
            property: 'og:description',
            content: state.projects[index].description
          }
        ]
      }
    }
  );
}

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode!.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map((tagDef: any) => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
    // Add the meta tags to the document head.
    .forEach((tag: any) => document.head.appendChild(tag));

  next();
});


setTimeout(() => {
  let vueApp: Vue = new Vue({
    el: document.querySelector('#app') as Element,
    components: {App},
    router,
    store: new Vuex.Store({ 
      state: state,
      getters,
      mutations
    }),
    render (h) {
      return h('App')
    }
  })
  
  let stats: Stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  stats.dom.style.cssText = 'position:fixed;bottom:0;right:0;cursor:pointer;opacity:0.9;z-index:10000';
  document.body.appendChild( stats.dom );
  function animate() {
    stats.begin();
    stats.end();
    requestAnimationFrame( animate );
  }
  requestAnimationFrame( animate );
}, 500);
