import { Timer, TimerType } from './timer';
import { getTimeParts } from './util';

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
        autoStart: {
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
        if (this.autoStart) {
            this.timer.start();
        }
    },

    watch: {
        type(newType: TimerType) {
            this.timer.type = newType;
        },

        length(newLength: number) {
            this.timer.setLength(newLength);
            this.timeElapsed = this.type === 'countdown' ? this.length : 0;
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
            this.timer.start();
        },

        stop() {
            this.timer.stop();
        },

        pause() {
            this.timer.pause();
        },

        resume() {
            this.timer.resume();
        },

        toggle() {
            if (this.state === 'paused') {
                this.timer.resume();
            } else if (this.state === 'running') {
                this.timer.pause();
            } else if (this.state === 'stopped') {
                this.timer.start();
            } else {
                throw new Error(
                    'unable to toggle timer: unknown state: ' + this.state
                );
            }
        },

        reset() {
            this.timer.reset();
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

            this.timer.events.on('state', (state) => {
                this.state = state;
                this.$emit('state', state);
            });

            this.timer.events.on('overflow', (isOverflowed) => {
                this.isOverflowed = isOverflowed;

                if (isOverflowed) {
                    this.$emit('overflow');
                }
            });

            this.timer.events.on('done', (done) => {
                this.isDone = done;

                if (done) {
                    this.$emit('done');
                }
            });

            this.timer.events.on('tick', (time) => {
                this.timeElapsed = time;
                this.$emit('tick', time);
            });

            this.timer.events.on('reset', (time) => {
                this.timeElapsed = time;
                this.$emit('reset', time);
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
    },
};
