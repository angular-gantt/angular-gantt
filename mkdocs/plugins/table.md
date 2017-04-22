# Table

Display a table on the side with fully customizable columns count and data.

## Usage

    angular.module('myApp', ['gantt', 'gantt.table']);

<!-- -->

    <div gantt>
      <gantt-table enabled="...">
      </gantt-table>
    </div>

## Attributes

- #### enabled

    Enable display of table.

    default: `true`
    
- #### columns

    List of row expressions that will be used to build columns. Those expression will provide values for each row.
    
    default: `['model.name']`
    
- #### formatter

    Function `formatter(value, column, row)` used to format each value. The function returns formatted value.
    
    default: `{'model.name': 'Name'}`
    
- #### formatters

    Associative object to customize formatter for each cell. 
    Key is the column expression defined in `columns` attribute, and value is a formatter function `formatter(value, column, row)`
    returning formatted value.
    It can be used if some columns requires special formatters. If a formatter is undefined for the column, it will use then formatter 
    defined in `formatter` attribute
    
        {'from': function(value, column, row) {
          if (value) {
            return value.format('lll');
          }
          return value;
          }
        }

- #### headers

    Associative object to customize header for each column. Key is the column expression defined in `columns` attribute,
    and value is the header to display.
    
    ex: `{'model.name': 'Label'}`

- #### contents

    Associative object to customize values content. Key is the column expression defined in `columns` attribute,
    and value is the content to display for each column row. Content can contain HTML and will be automatically 
    compiled. Default content is `{{getValue()}}`.

    ex: `{'model.name': '<span class="glyphicon glyphicon-asterisk"></span> {{getValue()}}'}`
    
    Contents object can also be be defined for a specific `Row` object using an object property named `columnContents`
    
        {
          ...
          // Inside Row object
          'columnContents': {
            'model.name': '...',
            'from': '...',
            'to': '...'
          }
        }

- #### header-contents

    Associative object to customize header content. Key is the column expression defined in `columns` attribute,
    and value is the content to display for each column row. Content can contain HTML and will be automatically 
    compiled. Default content is `{{getHeader()}}`.

    ex: `{'model.name': '<span class="glyphicon glyphicon-asterisk"></span> {{getHeader()}}'}`

- #### classes

    Associative object to customize CSS classes. Key is the column expression defined in `columns` attribute,
    and value is the class name to apply to column.
    
    ex: `{'model.name': 'gantt-column-name'}`

- #### header-formatter

    Formatter function `formatter(column)` use to format each header. The function returns formatted header value.
