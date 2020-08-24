<template>
  <button
    class="pl-3 pr-4 py-2 flex items-center leading-none bg-gray-300 hover:bg-gray-400"
    @click="$emit('update:checked', !checked)"
  >
    <span class="inline-box mr-1">
      <svg
        v-if="checked"
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        class="text-blue-600"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          fill="currentColor"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        class="text-gray-700"
      >
        <path
          d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
          fill="currentColor"
        />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "CheckButton",
  props: {
    checked: Boolean
  }
};
</script>
