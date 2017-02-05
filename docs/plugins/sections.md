# Sections

Display sections inside tasks. Sections are defined with date and smartly follow tasks and magnet on changes.

## Usage

    angular.module('myApp', ['gantt', 'gantt.sections']);
    
<!-- -->

    <div gantt>
        <gantt-sections enabled="..." keep-proportions="..." disable-magnet="..." disable-daily="..."></gantt-corner>
    </div>

<!-- -->

    <link rel="stylesheet" href="angular-gantt-sections.css">

## Attributes

- ### enabled

    Enable sections display.
  
    default: `true`

- ### keep-proportions
 
    If true, proportions will be kept when the task is resized. If false, sections will stay at the same place relative
    to the left border of the task container.
    
    default: `true`

- ### disable-magnet

    If true, sections won't follow magnets defined by `column-magnet` and `shit-column-magnet` gantt attributes.
    
    default: `false`
    
- ### disable-daily

    If true, sections won't follow daily mode defined by `daily` gantt attribute.
    
    default: `false`


## Model

Sections are defined inside Task object.

    {
      ...
      // Inside Task object
      sections: {
        keepProportions: true/false, // Override plugin configuration (Optional).
        disableMagnet: true/false, // Override plugin configuration (Optional).
        disableDaily: true/false, // Override plugin configuration (Optional).
        items: [
          {
            from: <Date>, // Date can be a String, Timestamp, Date object or moment object.
            to: <Date>, // Date can be a String, Timestamp, Date object or moment object.
            classes: <Array|String> // Array or String of class names which should be applied to the section. See ng-class documentation for details (Optional).
          },
          {
            ... 
          }
        ]
      }
    }
