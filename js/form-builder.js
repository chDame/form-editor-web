let template = '<my-header apptitle="Ed!t0r"></my-header>'+
	'<div class="container-fluid bg-secondary">'+
		'<div class="row flex-nowrap">'+
			'<div class="col-auto px-0" v-if="!$store.preview" >'+
				'<widget-side-bar :containers="containers" :widgets="widgets" :customwidgets="customWidgets"></widget-side-bar>'+
			'</div>'+
			'<main class="col ps-md-2 pt-2">'+
				'<div :class="[$store.preview ? \'p-3 bg-light border rounded preview\' : \'bg-light border rounded edition\']">'+
					'<form-content :content="$store.form.content"></form-content>'+
				'</div>'+
				'<data-panel></data-panel>'+
			'</main>'+
			'<div  v-if="!$store.preview" class="col-auto px-0">'+
				'<properties-side-bar></properties-side-bar>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<data-modal></data-modal>'+
	'<fn-prop-modal></fn-prop-modal>';

window.dropZone = null;

export function builder() {

    let rootElement;
    let widgetUrl = null;
	let menu = null;

    return {
        setRoot: function (htmlElement) {
            this.rootElement = htmlElement;
            return this;
        },
        setWidgetUrl: function (widgetUrl) {
            this.widgetUrl = widgetUrl;
            return this;
        },
        setMenu: function (menu) {
            this.menu = menu;
            return this;
        },
       
	    addHtmlTemplate: function() {
			let theApp = document.createElement("div");
			theApp.id="editorApp";
			theApp.innerHTML=template;
			this.rootElement.insertBefore(theApp, this.rootElement.firstChild);
		},
		
		buildVueEditor: function(menu){
			Vue.prototype.$store = Vue.observable({
				globalId:0,
				preview: false,
				form: {'id':null,
					'name': 'newForm',
					'content':[],
					'data':[]},
				currentField:null,
				currentProp:null,
				currentData:null,
				fieldTypeMap:[],
				menu: menu,
			});
			let vm = new Vue({
				el: '#editorApp',
				
				data: function () {
					return {
						customWidgets: [],
						containers: [],
						widgets: []

						
					};
				},
				methods: {
					buildSubWidgetMap: function(source, target) {
						for (let i=0; i<source.length; i++) {
							Vue.component(source[i].nature, {template:source[i].template,
							  props: ['props']
							});
							let clone = JSON.parse(JSON.stringify(source[i]));
							delete clone.template;
							target.push(clone);
							this.$store.fieldTypeMap[clone.nature]=clone.propsDef;
						}
					},
					loadWidgetMap: function() {
						let components = window.defaultcomponents;
						if (window.widgets) {
							components = window.widgets;
						}
						this.buildSubWidgetMap(components.containers, this.containers);
						this.buildSubWidgetMap(components.widgets, this.widgets);
						this.buildSubWidgetMap(components.customwidgets, this.customwidgets);
					}
				},
				components: {
					draggable: vuedraggable
				},
				beforeMount: function(){
					this.loadWidgetMap();
				}
			});
			
		},
	   
        build: function () {
			this.addHtmlTemplate();
			if (this.widgetUrl) {
				axios.get(this.widgetUrl).then(response => {
				  var script = document.createElement("script");
				  script.innerHTML = response.data;  
				  document.body.appendChild(script);
				  
				  this.buildVueEditor(this.menu);
				}).catch(error => {
				  this.buildVueEditor(this.menu);
				})
			} else {
				this.buildVueEditor(this.menu);
			}
		}
	}
}