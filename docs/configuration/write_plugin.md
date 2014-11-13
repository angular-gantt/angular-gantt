# Write a Plugin

A [plugin](plugins.md) is a child directive of main `gantt` directive
[transcluded](https://docs.angularjs.org/api/ng/directive/ngTransclude) in [Template](customize.md#default-template).

1. Copy skeleton file from `docs/skeletons/plugin.js` to `src/plugins`

2. Rename the skeleton copy using the plugin name (dash-delimited notation, `plugin-name.js`)

3. Open the plugin file with your favorite editor.

3. Replace `xxxxxx` with the name of the plugin (camelCase notation, `pluginName`). Take special care
to directive name, that must be camelCase to (`ganttPluginName`). There are 5 matches.

4. Register plugin in `Gruntfile.js` by adding its dash-delimited name to `plugins` variable.

5. Add options as binded attributes in the directive `scope`.

6. Implement plugin feature using a [Template Hook](customize.md#template-hooks).

7. You can add additional files in a subfolder named as your filename (without `.js`). 
This folder can contains templates (`*.html`), CSS (`*.css`) and other JavaScript (`*.js`). Those files will be included in the build.
