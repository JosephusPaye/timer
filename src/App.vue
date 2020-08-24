<template>
    <div id="app">
        <Timer
            ref="timer"
            allowOverflow
            :length="5 * 1000"
            @done="onDone"
            @start="onStart"
            @reset="onReset"
            @pause="onPause"
            @resume="onResume"
            v-slot="{ time, state, timeElapsed, isOverflowed, isDone }"
        >
            <div>
                <div
                    :style="{
                        color: isOverflowed ? 'red' : 'black',
                        fontFamily: 'monospace',
                    }"
                >
                    {{ time.h }}:{{ time.m }}:{{ time.s }}:{{ time.ms }}
                </div>
                <button @click="toggle">
                    {{
                        state === 'stopped'
                            ? 'Start'
                            : state === 'running'
                            ? 'Pause'
                            : 'Resume'
                    }}
                </button>
                <button @click="reset">Reset</button>
                <code
                    ><pre
                        v-text="
                            JSON.stringify({
                                state,
                                time,
                                timeElapsed,
                                isOverflowed,
                                isDone,
                            }, null, '  ')
                        "
                    ></pre
                ></code>
            </div>
        </Timer>
    </div>
</template>

<script>
import { TimerVue as Timer } from '../lib/dist/timer.esm.js';

export default {
    name: 'App',
    components: {
        Timer,
    },
    methods: {
        toggle() {
            this.$refs.timer.toggle();
        },

        reset() {
            this.$refs.timer.reset();
        },

        onStart() {
            console.log('onStart');
        },

        onReset(time) {
            console.log('onReset', time);
        },

        onPause() {
            console.log('onPause');
        },

        onResume() {
            console.log('onResume');
        },

        onDone() {
            console.log('onDone');
        },
    },
};
</script>

<style>
#app {
    color: #2c3e50;
    font-size: 18px;
    margin-top: 60px;
}
</style>
