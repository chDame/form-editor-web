# form-editor
A simple drag & drop form editor project made with Vue, Vue.draggable, Vuex and Bootstrap. 
Backend http calls are made with axios.

## status
Project is still a draft. You can darg and drop a limited set of widgets and widget properties are static.

## Project setup
```
npm install
```

### Compiles 
```
npm run build
```
In order to use a single js file FormEditor-full.bundle.min.js, as demonstrated in index.html (without dependencies in assets/js0, you'll need to run it twice

### Serve
```
static-html-server -p 8082 -r ./ -f index.html
```
index.html is an example. Running the previous command will start a server where you can check the result :
http://localhost:8082/

### Adding custom widgets
to add some custom widgets, you'll need to pick them from an external service thanks to setCustomWidgetUrl as demonstrated in the example
```
formEditor.builder().setRoot(document.body).setCustomWidgetUrl('./test/customWidgets.txt').build();
```
The content of the test/customWidgets.txt is an example of response that can be interpreted (it's javascript).
the start is the declaration of components attributes :
```
window.customwidgets = [{ 
		'type': 'checkbox-element',
		...
```

then come the vue components associated with the previous structure:
```
 Vue.component('checkbox-element', {
  template: '<div class="form-check mb-1"><input class="form-check-input" type="checkbox"><label class="form-check-label">{{props.label}}</label></div>',
  props: ['props']
})
```