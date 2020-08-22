export interface TimeUnit {
    /**
     * The type of unit, e.g. 'ms' for milliseconds
     */
    type: string;

    /**
     * How many milliseconds make up a single unit of this unit.
     * For example, if the unit is seconds, this is 1000.
     */
    milliseconds: number;

    /**
     * How many of this unit makes the next unit.
     * Set to 1 for the last unit.
     */
    nextUnitFactor: number;

    /**
     * Format a number in the given unit for display.
     *
     * @param value The unit value to format for display
     */
    format(value: number): string;
}

/**
 * The default units for `getTimeParts()`, ordered from smallest to largest.
 */
export const defaultUnits: TimeUnit[] = [
    {
        type: 'ms',
        milliseconds: 1,
        nextUnitFactor: 1000,
        format(value) {
            return String(value).padStart(3, '0');
        },
    },
    {
        type: 's',
        milliseconds: 1000,
        nextUnitFactor: 60,
        format(value) {
            return String(value).padStart(2, '0');
        },
    },
    {
        type: 'm',
        milliseconds: 60000,
        nextUnitFactor: 60,
        format(value) {
            return String(value).padStart(2, '0');
        },
    },
    {
        type: 'h',
        milliseconds: 3600000,
        nextUnitFactor: 24,
        format(value) {
            return String(value).padStart(2, '0');
        },
    },
    {
        type: 'd',
        milliseconds: 86400000,
        nextUnitFactor: 1,
        format(value) {
            return String(value).padStart(2, '0');
        },
    },
];

/**
 * Break up the given duration into the given units. By default, breaks
 * the given duration into days, hours, minutes, seconds, and milliseconds.
 *
 * @param time  The elapsed time in milliseconds
 * @param units The units to break up into, list of TimeUnits, ordered from smallest to largest
 */
export function getTimeParts(time: number, units: TimeUnit[] = defaultUnits) {
    const parts: { [key: string]: string } = {};

    units.forEach((unit) => {
        parts[unit.type] = unit.format(
            Math.floor(time / unit.milliseconds) % unit.nextUnitFactor
        );
    });

    return parts;
}
