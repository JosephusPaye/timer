import mitt from 'mitt';
import { Emitter } from 'mitt';

/**
 * The type of timer: 'countdown' or 'stopwatch'
 */
export type TimerType = 'countdown' | 'stopwatch';

/**
 * The timer state, one of 'stopped', 'running', 'paused'
 */
export type TimerState = 'stopped' | 'running' | 'paused';

/**
 * Timer constructor options
 */
export interface TimerOptions {
    /**
     * Whether the timer should allow overflow. If true, the timer will
     * set `isOverflowed` and continue counting when the length is
     * reached. Otherwise, the timer stops upon reaching the length.
     */
    allowOverflow?: boolean;
}

export class Timer {
    /**
     * The type of timer: 'countdown' or 'stopwatch'
     */
    type: TimerType = 'countdown';

    /**
     * The timer state, one of 'stopped', 'running', 'paused'
     */
    state: TimerState = 'stopped';

    /**
     * Indicates whether the timer allows overflow. When true, the timer
     * will set `isOverflowed` and continue counting when the length is
     * reached. Otherwise, the timer stops upon reaching the length.
     */
    allowOverflow: boolean = false;

    /**
     * Indicates whether the timer has overflowed (i.e. exceeded the length)
     */
    isOverflowed: boolean = false;

    /**
     * Indicates whether the timer is done (i.e. met or exceeded the length)
     */
    isDone: boolean = false;

    /**
     * The timer event emitter
     */
    events: Emitter;

    /**
     * How long the timer is running for, in milliseconds
     */
    private length: number;

    /**
     * The time when the timer was paused, in milliseconds since epoch
     */
    private pausedAt: number = 0;

    /**
     * The time when the timer will run out, in milliseconds since epoch
     */
    private endingAt: number = 0;

    /**
     * Indicates whether the 'done' event has been emitted
     */
    private doneEventEmitted: boolean = false;

    /**
     * Create a new timer
     *
     * @param type    The type of timer: 'countdown' or 'stopwatch'
     * @param length  How long the timer should count down from or count up to
     * @param options The timer options
     */
    constructor(type: TimerType, length: number, options: TimerOptions = {}) {
        this.type = type;
        this.length = length;
        this.allowOverflow = options.allowOverflow ?? true;
        this.events = mitt();
    }

    /**
     * The elapsed time in milliseconds. Is zero if the timer is stopped.
     */
    get time() {
        if (this.state === 'stopped') {
            return 0;
        }

        const now = this.state === 'paused' ? this.pausedAt : Date.now();
        const timeLeft = this.endingAt - now;

        return this.type === 'countdown' ? timeLeft : this.length - timeLeft;
    }

    /**
     * Reset the timer
     *
     * @return The new timer state after resetting
     */
    reset() {
        this.state = 'stopped';
        this.pausedAt = 0;
        this.endingAt = 0;
        this.isOverflowed = false;
        this.isDone = false;
        this.doneEventEmitted = false;

        this.events.emit('reset', this.type === 'countdown' ? this.length : 0);

        return this.state;
    }

    /**
     * Start the timer
     *
     * @return The new timer state after starting
     */
    start() {
        this.state = 'running';
        this.endingAt = Date.now() + this.length;
        this.tick();

        this.events.emit('start');

        return this.state;
    }

    /**
     * Stop the timer
     *
     * @return The new timer state after stopping
     */
    stop() {
        this.state = 'stopped';

        this.events.emit('stop');

        return this.state;
    }

    /**
     * Pause the timer
     *
     * @return The new timer state after pausing
     */
    pause() {
        if (this.state !== 'running') {
            return;
        }

        this.pausedAt = Date.now();
        this.state = 'paused';

        this.events.emit('pause');

        return this.state;
    }

    /**
     * Resume the timer
     *
     * @return The new timer state after resuming
     */
    resume() {
        if (this.state !== 'paused') {
            return;
        }

        this.endingAt += Date.now() - this.pausedAt;
        this.pausedAt = 0;

        this.state = 'running';
        this.tick();

        this.events.emit('resume');

        return this.state;
    }

    /**
     * Destroy the timer and event listeners
     */
    destroy() {
        this.events.all.clear();
    }

    /**
     * Advance the timer by one tick
     */
    private tick() {
        if (this.state !== 'running') {
            return;
        }

        if (Date.now() >= this.endingAt) {
            this.isDone = true;

            if (this.allowOverflow) {
                this.events.emit('tick', this.time);
                this.isOverflowed = true;
            } else {
                this.events.emit(
                    'tick',
                    this.type === 'countdown' ? 0 : this.length
                );
                this.stop();
            }

            if (!this.doneEventEmitted) {
                this.events.emit('done');
                this.doneEventEmitted = true;
            }
        } else {
            this.events.emit('tick', this.time);
        }

        requestAnimationFrame(this.tick.bind(this));
    }
}
