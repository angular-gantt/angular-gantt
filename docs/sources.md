# Sources

angular-gantt is under active development, and is available on [GitHub](https://github.com/angular-gantt/angular-gantt).

```
git clone https://github.com/angular-gantt/angular-gantt
```

## Build
1. Install [npm](https://www.npmjs.org/), [bower](http://bower.io/) and [grunt](http://gruntjs.com/)

2. Run `npm install` to install node dependencies

3. Run `bower install` to install bower dependencies

4. Run `grunt` to build distribution files in `assets`

5. Run `grunt` from `demo` directory to build demo distribution

    *tip: Run `grunt watch --force` to build automatically on source file change.*

## Use angular-gantt sources

Bower can [link](http://bower.io/docs/api/#link) local angular-gantt sources in demo project (or your own project).

    bower link # Create global link for local angular-gantt sources. 
    cd demo # Move to demo project folder
    bower link angular-gantt # Create link for local angular-gantt sources in bower components folder.
    
This will create a symbolic link in `demo/bower_components` pointing to your local sources of `angular-gantt`.

Then, run `grunt serve` from `demo` directory to run the demo.
