# Corner

Display labels for column headers in the corner

## Usage

    angular.module('myApp', ['gantt', 'gantt.corner']);
    
<!-- -->

    <div gantt>
        <gantt-corner enabled="..." headers-labels="..."></gantt-corner>
    </div>

<!-- -->

    <link rel="stylesheet" href="angular-gantt-corner.css">

## Attributes

- ### enabled

    Enable corner display.
  
    default: `true`

- ### headers-labels
 
    Associative object of headers labels. Key is the header, and value is the label.

        $scope.headersLabels = { 
          year: 'Year', 
          quarter: 'Quarter', 
          month: 'Month', 
          week: 'Week', 
          day: 'Day', 
          hour: 'Hour', 
          minute:'Minute'
        };
        
    It is also possible to specify a function to return the header label.
    
        $scope.headersLabels = function(headerName, headerUnit, columns) {
            // Capitalize the header name to build the label.
            return headerName.charAt(0).toUpperCase() + headerName.slice(1);
        }

- ### headers-labels-templates

    The template to use to display a single header label.
    
    default: `{{getLabel(header)}}`
    
    Can also be an associative object, where Key is the header, and value is the template.
    
        $scope.headersLabels = { 
          year: '<i>{{getLabel(header)}}</i>', 
          month: '<b>{{getLabel(header)}}</b>', 
        };
    
    It is also possible to specify a function to return the header label template.
    
        $scope.headersLabelsTemplates = function(headerName, headerUnit, columns) {
            if (headerName == 'year') {
                return '<i>{{getLabel(header)}}</i>';
            } else if (headerName == 'month') {
                return '<b>{{getLabel(header)}}</b>';
            }
            // Other case will default template.
        }
