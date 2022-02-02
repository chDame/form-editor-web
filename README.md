# VUIzer
A simple drag & drop form editor project made with Vue, Vue.draggable, CodeMirror and Bootstrap. 
Backend http calls are made with axios.

## status
Project is still a draft. You can drag and drop a limited set of widgets.
You can define data store and use binding or functions in widget properties.

## Project setup
```
npm install
```

### Compiles 
```
npm run build
```
In order to use a single js file vuizer-full.bundle.min.js, as demonstrated in index.html (without dependencies in assets/js, you'll need to run it twice

### Serve
```
static-html-server -p 8082 -r ./ -f index.html
```
index.html is an example. Running the previous command will start a server where you can check the result :
http://localhost:8082/

### working with custom widgets
to work with your own widgets, you'll need to pick them from an external service thanks to seWidgetUrl as demonstrated in the example
```
vuizer.builder().setRoot(document.body).setWidgetUrl('./test/customWidgets.txt').build();
```
The content of the test/customWidgets.txt is an example of response that can be interpreted (it's javascript).
```
window.widgets = { 
	containers:[
		{
			"type":"contentWidget",
			...
```


```