# Timespans

[timespans](attributes.md#timespans) is the [attribute](attributes.md) used to load timespans into `angular-gantt`.

Timespans are used to display gray area for a period of time. It is drawn on the whole height of the gantt.

## Timespan

    {
      id: "...",  // Unique id of the timespan (Optional).
      name: "...", // Name shown on top of each timespan.
      from: <Date>, // Date can be a String, Timestamp, Date object or moment object.
      to: <Date>, // Date can be a String, Timestamp, Date object or moment object.
      color: "..." , // Color of the timespan in HEX format (Optional).
      classes: <Array|String> // Class names to apply to the task (Optional).
    }
