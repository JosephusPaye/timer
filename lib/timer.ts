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
     * Set the timer's length. Will stop the timer and reset internal state for a new run.
     */
    setLength(length: number) {
        const wasRunning = this.state === 'running';

        this.setState('stopped');

        if (wasRunning) {
            this.events.emit('stop');
        }

        this.resetInternal();
        this.length = length;
    }

    /**
     * Set the timer state to the given state
     */
    private setState(state: TimerState) {
        this.state = state;
        this.events.emit('state', state);
    }

    /**
     * Set `isDone` to the given value
     */
    private setIsDone(isDone: boolean) {
        const oldIsDone = this.isDone;

        this.isDone = isDone;
        this.doneEventEmitted = isDone;

        if (oldIsDone !== isDone) {
            this.events.emit('done', isDone);
        }
    }

    /**
     * Set `isOverflowed` to the given value
     */
    private setIsOverflowed(isOverflowed: boolean) {
        const oldIsOverflowed = this.isOverflowed;

        this.isOverflowed = isOverflowed;

        if (oldIsOverflowed !== isOverflowed) {
            this.events.emit('overflow', isOverflowed);
        }
    }

    /**
     * Reset the internal timer state for a possible new run
     */
    private resetInternal({
        isDone,
        isOverflowed,
    }: { isDone?: boolean; isOverflowed?: boolean } = {}) {
        this.setIsDone(isDone ?? false);
        this.setIsOverflowed(isOverflowed ?? false);
        this.pausedAt = 0;
        this.endingAt = 0;
    }

    /**
     * Reset the timer
     */
    reset() {
        this.setState('stopped');
        this.resetInternal();
        this.events.emit('reset', this.type === 'countdown' ? this.length : 0);
    }

    /**
     * Start the timer
     */
    start() {
        this.resetInternal();
        this.setState('running');

        this.endingAt = Date.now() + this.length;
        this.tick();

        this.events.emit('start');
    }

    /**
     * Stop the timer
     */
    stop(options = { isDone: false }) {
        this.setState('stopped');
        this.resetInternal({ isDone: options.isDone });
        this.events.emit('stop');
    }

    /**
     * Pause the timer
     */
    pause() {
        if (this.state !== 'running') {
            return;
        }

        this.pausedAt = Date.now();
        this.setState('paused');

        this.events.emit('pause');
    }

    /**
     * Resume the timer
     */
    resume() {
        if (this.state !== 'paused') {
            return;
        }

        this.endingAt += Date.now() - this.pausedAt;
        this.pausedAt = 0;

        this.setState('running');
        this.tick();

        this.events.emit('resume');
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
            if (this.allowOverflow) {
                if (!this.doneEventEmitted) {
                    this.setIsDone(true);
                }

                this.events.emit('tick', this.time);

                this.setIsOverflowed(true);
            } else {
                this.events.emit(
                    'tick',
                    this.type === 'countdown' ? 0 : this.length
                );
                this.stop({ isDone: true });
            }
        } else {
            this.events.emit('tick', this.time);
        }

        requestAnimationFrame(this.tick.bind(this));
    }
}
