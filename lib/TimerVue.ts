import { Timer, TimerType } from './timer';
import { getTimeParts } from './timer-util';

export default {
    name: 'Timer',

    props: {
        type: {
            type: String,
            default: 'countdown',
            validator(value: any) {
                return value === 'countdown' || value === 'stopwatch';
            },
        },
        length: {
            type: Number,
            default: 0,
        },
        autostart: {
            type: Boolean,
            default: false,
        },
        allowOverflow: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            state: '',
            timeElapsed: 0,
            isOverflowed: false,
            isDone: false,
        };
    },

    computed: {
        time(): ReturnType<typeof getTimeParts> {
            return getTimeParts(Math.abs(this.timeElapsed));
        },
    },

    created() {
        this.initTimer();
    },

    mounted() {
        if (this.autostart) {
            this.timer.start();
        }
    },

    watch: {
        type(newType: TimerType) {
            this.timer.type = newType;
        },

        length() {
            this.reset();
            this.initTimer();
        },

        allowOverflow(allowOverflow: boolean) {
            this.timer.allowOverflow = allowOverflow;
        },
    },

    render(createElement) {
        return this.$scopedSlots.default
            ? this.$scopedSlots.default({
                  time: this.time,
                  state: this.state,
                  timeElapsed: this.timeElapsed,
                  isOverflowed: this.isOverflowed,
                  isDone: this.isDone,
              })
            : createElement(
                  'div',
                  {
                      class: [
                          'timer',
                          {
                              'is-done': this.isDone,
                              'is-overflowed': this.isOverflowed,
                          },
                      ],
                  },
                  [
                      createElement(
                          'span',
                          { class: 'timer__hours' },
                          this.time.h
                      ),
                      createElement('span', { class: 'timer__delimiter' }, ':'),
                      createElement(
                          'span',
                          { class: 'timer__minutes' },
                          this.time.m
                      ),
                      createElement('span', { class: 'timer__delimiter' }, ':'),
                      createElement(
                          'span',
                          { class: 'timer__seconds' },
                          this.time.s
                      ),
                      createElement('span', { class: 'timer__delimiter' }, ':'),
                      createElement(
                          'span',
                          { class: 'timer__milliseconds' },
                          this.time.ms
                      ),
                  ]
              );
    },

    beforeDestroy() {
        if (this.timer) {
            this.timer.stop();
            this.timer.destroy();
        }
    },

    methods: {
        start() {
            if (this.timer) {
                this.timer.start();
            }
        },

        stop() {
            if (this.timer) {
                this.timer.stop();
            }
        },

        pause() {
            if (this.timer) {
                this.timer.pause();
            }
        },

        resume() {
            if (this.timer) {
                this.timer.resume();
            }
        },

        toggle() {
            if (this.state === 'paused') {
                this.state = this.timer.resume();
            } else if (this.state === 'running') {
                this.state = this.timer.pause();
            } else if (this.state === 'stopped') {
                this.state = this.timer.start();
            } else {
                throw new Error(
                    'unable to toggle: unknown timer state: ' + this.state
                );
            }
        },

        reset() {
            this.state = this.timer.reset();
        },

        initTimer() {
            if (this.timer) {
                this.timer.destroy();
            }

            this.timer = new Timer(this.type, this.length, {
                allowOverflow: this.allowOverflow,
            });

            this.state = this.timer.state;
            this.timeElapsed = this.type === 'countdown' ? this.length : 0;

            this.timer.events.on('tick', (time) => {
                this.onTick(time);
                this.$emit('tick', time);
            });

            this.timer.events.on('done', () => {
                this.onDone();
                this.$emit('done');
            });

            this.timer.events.on('reset', (newTime) => {
                this.onReset(newTime);
                this.$emit('reset', newTime);
            });

            this.timer.events.on('start', () => {
                this.$emit('start');
            });

            this.timer.events.on('stop', () => {
                this.$emit('stop');
            });

            this.timer.events.on('pause', () => {
                this.$emit('pause');
            });

            this.timer.events.on('resume', () => {
                this.$emit('resume');
            });
        },

        onTick(time: number) {
            this.timeElapsed = time;
            this.isOverflowed = this.timer.isOverflowed;
        },

        onReset(newTime: number) {
            this.timeElapsed = newTime;
            this.isOverflowed = this.timer.isOverflowed;
            this.isDone = this.timer.isDone;
        },

        onDone() {
            this.isDone = this.timer.isDone;
        },
    },
};
