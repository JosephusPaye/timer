# Timer

⏳ A small and smooth (60-fps) countdown timer and stopwatch for Vue and vanilla JS.

This project is part of [#CreateWeekly](https://dev.to/josephuspaye/createweekly-create-something-new-publicly-every-week-in-2020-1nh9), my attempt to create something new publicly every week in 2020.

## Demo

<https://timerlib.netlify.app>

## Installation

```
npm install @josephuspaye/timer --save
```

## Usage

### With default template

You can create a timer with the default template, which shows days, hours, minutes, seconds, and milliseconds. You can also use the following classes to style the resulting timer:

-   `timer` - added to the timer root element (a `div` element)
-   `timer__delimiter` - added to the `:` delimiters (`span` elements)
-   `timer__days` - added to the timer days (a `span` element)
-   `timer__hours` - added to the timer hours (a `span` element)
-   `timer__seconds` - added to the timer seconds (a `span` element)
-   `timer__milliseconds` - added to the timer milliseconds (a `span` element)

The following creates a simple countdown timer with 15 seconds (view [CodePen](https://codepen.io/JosephusPaye/pen/wvGgyNz)):

```vue
<template>
    <div>
        <Timer type="countdown" autoStart :length="15 * 1000" />
        <!-- Change to `type="stopwatch"` for a stopwatch -->
    </div>
</template>

<script>
import { TimerVue as Timer } from '@josephuspaye/timer';

export default {
    components: { Timer },
};
</script>
```

### With a custom template

You can use a [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to render your own template.

The following renders a custom template with 10-second stopwatch that allows for overflow ([view CodePen](https://codepen.io/JosephusPaye/pen/MWyJQMV)):

```vue
<template>
    <div>
        <Timer
            type="stopwatch"
            auto-start
            allow-overflow
            :length="15 * 1000"
            v-slot="{ time, isDone, isOverflowed }"
        >
            <!-- Change to `type="countdown"` for a countdown timer -->
            <div>
                <span :class="{ 'is-overflowed': isOverflowed }">
                    <span>{{ time.d }}d</span>
                    <span>{{ time.h }}h</span>
                    <span>{{ time.m }}m</span>
                    <span>{{ time.s }}s</span>
                    <span>{{ time.ms }}ms</span>
                </span>

                <span>{{ isDone ? '✅' : '⏳' }}</span>
            </div>
        </Timer>
    </div>
</template>

<script>
import { TimerVue as Timer } from '@josephuspaye/timer';

export default {
    components: { Timer },
};
</script>

<style>
.is-overflowed {
    color: red;
}
</style>
```

## Vue API

### Props

| Prop            | Type    | Default     | Description                                                                                                                   |
| --------------- | ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `type`          | String  | `countdown` | The type of timer. One of `countdown` or `stopwatch`. This value can be changed while the timer is running.                   |
| `length`        | Number  |             | How long the timer is running for, in milliseconds. Changing this while the timer is running will cause it to stop and reset. |
| `autoStart`     | Boolean | `false`     | When `true`, the timer will start automatically on mount.                                                                     |
| `allowOverflow` | Boolean | `false`     | When `true`, the timer will continue when the length is exceeded. Otherwise, it will stop.                                    |

### Methods

| Event      | Description                                                                                |
| ---------- | ------------------------------------------------------------------------------------------ |
| `start()`  | Start the timer.                                                                           |
| `stop()`   | Stop the timer.                                                                            |
| `pause()`  | Pause the timer if it's running.                                                           |
| `resume()` | Resume the timer if it's paused.                                                           |
| `toggle()` | Toggle the timer. Will start the timer if stopped, pause if running, and resume if paused. |
| `reset()`  | Stop and reset the timer, for a possible restart.                                          |

### Events

| Event      | Description                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `state`    | Emitted when the timer state changes. The handler is called with the new state, one of `stopped`, `running` or `paused`.                                           |
| `overflow` | Emitted when the timer exceeds its length.                                                                                                                         |
| `done`     | Emitted when the timer reaches its length.                                                                                                                         |
| `tick`     | Emitted when the timer advances. The handler is called with the total time elapsed, in milliseconds. When the timer is running, this is emitted 60 times a second. |
| `reset`    | Emitted when the timer is reset. The handler is called with the time it was reset to, in milliseconds.                                                             |
| `start`    | Emitted when the timer is started.                                                                                                                                 |
| `stop`     | Emitted when the timer is stopped.                                                                                                                                 |
| `pause`    | Emitted when the timer is paused.                                                                                                                                  |
| `resume`   | Emitted when the timer is resumed.                                                                                                                                 |

### Slots

| Slot      | Description                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------- |
| (default) | The default slot. Can hold any content with a single root element, and is passed the props listed below. |

#### Slot props

| Prop           | Type    | Description                                                                                                                                                                     |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `time`         | Object  | The timer's current time as an object with keys `d` (days), `h` (hours), `m` (minutes), `s` (seconds), and `m` (milliseconds). Each value is a padded string ready for display. |
| `timeElapsed`  | Number  | For a countdown, the total time remaining, in milliseconds. For a stopwatch, the total time elapsed, in milliseconds.                                                           |
| `state`        | String  | The timer's current state, one of `stopped`, `running` or `paused`.                                                                                                             |
| `isDone`       | Boolean | Whether or not the timer has reached its length.                                                                                                                                |
| `isOverflowed` | Boolean | Whether or not the timer has exceeded its length.                                                                                                                               |

## Licence

[MIT](LICENCE)
