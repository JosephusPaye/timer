<template>
    <div id="app">
        <div class="max-w-5xl p-6 mx-auto">
            <div class="border-b border-gray-800 pt-8 pb-10">
                <div class="font-light text-4xl text-white">
                    @josephuspaye/timer
                </div>
                <p class="text-gray-400 text-base mt-3 text-xl">
                    A small and smooth (60-fps) countdown timer and stopwatch
                    for Vue and vanilla JS.
                </p>
                <a
                    href="https://github.com/JosephusPaye/timer"
                    rel="noopener"
                    target="_blank"
                    class="text-lg rounded-full py-3 px-8 inline-flex leading-none mt-5 bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700"
                    >Documentation</a
                >
            </div>

            <div class="flex flex-col lg:flex-row min-w-0 mt-12">
                <div class="flex h-10">
                    <ToggleButton id="countdown" :value.sync="type"
                        >Countdown</ToggleButton
                    >
                    <ToggleButton id="stopwatch" :value.sync="type"
                        >Stopwatch</ToggleButton
                    >
                </div>

                <CheckButton
                    :checked.sync="allowOverflow"
                    class="mt-4 lg:mt-0 lg:ml-3"
                    >Allow overflow</CheckButton
                >

                <div class="mt-4 lg:mt-0 lg:ml-3 lg:flex lg:items-center h-10">
                    <span
                        class="bg-gray-800 px-4 inline-flex items-center justify-center text-white h-full cursor-default"
                        >Length:</span
                    >
                    <input
                        type="number"
                        step="1000"
                        v-model.number="length"
                        class="ml-auto w-32 px-3 py-1 bg-gray-700 text-black h-full text-white"
                    />
                </div>
            </div>

            <div class="mt-10">
                <Timer
                    ref="timer"
                    :type="type"
                    :allowOverflow="allowOverflow"
                    :length="length"
                    @done="onDone"
                    @start="onStart"
                    @stop="onStop"
                    @reset="onReset"
                    @pause="onPause"
                    @resume="onResume"
                    @overflow="onOverflow"
                    v-slot="{ time, state, timeElapsed, isOverflowed, isDone }"
                >
                    <div>
                        <div
                            class="text-6xl font-mono font-thin"
                            :class="[
                                isOverflowed ? 'text-red-400' : 'text-gray-400',
                            ]"
                        >
                            {{ time.h }}:{{ time.m }}:{{ time.s }}:{{ time.ms }}
                        </div>

                        <div class="mt-6">
                            <Button
                                @click="toggle"
                                color="primary"
                                class="mr-1"
                            >
                                {{
                                    state === 'stopped'
                                        ? 'Start'
                                        : state === 'running'
                                        ? 'Pause'
                                        : 'Resume'
                                }}
                            </Button>
                            <Button @click="reset">Reset</Button>
                        </div>

                        <code
                            ><pre
                                v-text="
                                    JSON.stringify(
                                        {
                                            state,
                                            time,
                                            timeElapsed,
                                            isOverflowed,
                                            isDone,
                                        },
                                        null,
                                        '  '
                                    )
                                "
                            ></pre
                        ></code>
                    </div>
                </Timer>
            </div>
        </div>
    </div>
</template>

<script>
import { TimerVue as Timer } from '../lib/dist/timer.esm.js';
import CheckButton from './CheckButton.vue';
import ToggleButton from './ToggleButton.vue';
import Button from './Button.vue';

export default {
    name: 'App',
    components: { CheckButton, ToggleButton, Button, Timer },
    data() {
        return {
            type: 'countdown',
            allowOverflow: false,
            length: 5 * 1000,
        };
    },
    methods: {
        toggle() {
            this.$refs.timer.toggle();
        },

        reset() {
            this.$refs.timer.reset();
        },

        onStart() {
            console.log('event: start');
        },

        onStop() {
            console.log('event: stop');
        },

        onReset(time) {
            console.log('event: reset', time);
        },

        onPause() {
            console.log('event: pause');
        },

        onResume() {
            console.log('event: resume');
        },

        onDone() {
            console.log('event: done');
        },

        onOverflow() {
            console.log('event: overflow');
        },
    },
};
</script>

<style>
@import './tailwind.css';

body {
    @apply bg-gray-900;
}
</style>
