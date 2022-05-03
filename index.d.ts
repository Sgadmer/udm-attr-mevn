import lodash_ from 'lodash';

declare module '#app' {
  interface NuxtApp {
    $_ (): lodash_
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $_ (): lodash_
  }
}

export { }
