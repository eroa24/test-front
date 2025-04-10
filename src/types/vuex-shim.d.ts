declare module 'vuex' {
  import { Store as VuexStore, createStore as createVuexStore } from 'vuex'
  export * from 'vuex'
  export { VuexStore as Store, createVuexStore as createStore }
}
