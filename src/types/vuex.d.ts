import { Store } from 'vuex'
import { State } from '../store'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

declare module 'vuex' {
  export interface Store<S> {
    state: S
    getters: Record<string, any>
    mutations: Record<string, any>
    actions: Record<string, any>
    modules: Record<string, any>
  }
}
