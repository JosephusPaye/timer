<template>
    <button
        @click="$emit('click', $event)"
        :class="
            `cursor-pointer px-6 py-2 ${
                color === 'primary'
                    ? 'bg-blue-600 hover:bg-blue-50 active:bg-blue-700 text-white'
                    : 'bg-gray-300 hover:bg-gray-400 active:bg-gray-500'
            }`
        "
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        color: String,
    },
};
</script>
