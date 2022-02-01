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
    let customWidgetUrl = null;
	let menu = null;

    return {
        setRoot: function (htmlElement) {
            this.rootElement = htmlElement;
            return this;
        },
        setCustomWidgetUrl: function (customWidgetUrl) {
            this.customWidgetUrl = customWidgetUrl;
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
						containers: [{
							'type':'contentWidget',
							'nature': 'panel-element',
							'display': 'Panel',
							'sizeable': false,
							'icon' : 'rowwidget',
							'propsDef':[{
								'name':'title',
								'type': 'text',
								'default':'panel'
							}]
						}],
						widgets: [{ 
							'type':'widget',
							'nature': 'input-element',
							'display': 'Input',
							'sizeable': true,
							'icon' : 'bi bi-input-cursor-text',
							'propsDef':[
								{
									'name':'required',
									'type': 'boolean',
									'default':true
								},
								{
									'name':'disabled',
									'type': 'boolean',
									'default':false
								},
								{
									'name':'type',
									'type': 'list',
									'values' : ['text', 'number', 'email', 'password'],
									'default':'text'
								},
								{
									'name':'icon',
									'type': 'text',
									'default' : 'bi bi-input-cursor-text'
								},
								{
									'name':'label',
									'type': 'text',
									'default' : 'label :',
								},
								{
									'name':'value',
									'type': 'binding'
								},
								{
									'name':'labelPosition',
									'type': 'list',
									'values' : ['top', 'left'],
									'default': 'top'
								},
								{
									'name':'placeholder',
									'type': 'text',
									'default':'placeholder'
								},
								{
									'name':'min',
									'type': 'number',
									'condition':'field.props.type=="number"'
								},
								{
									'name':'max',
									'type': 'number',
									'condition':'field.props.type=="number"'
								},
								{
									'name':'minlength',
									'type': 'number',
									'condition':'field.props.type!="number"'
								},
								{
									'name':'maxlength',
									'type': 'number',
									'condition':'field.props.type!="number"'
								}
							]					
						},{ 
							'type':'widget',
							'nature': 'checkbox-element',
							'display': 'CheckBox',
							'sizeable': true,
							'icon' : 'bi bi-check-square',
							'propsDef':[
								{
									'name':'required',
									'type': 'boolean',
									'default': true
								},
								{
									'name':'disabled',
									'type': 'boolean',
									'default': false
								},
								{
									'name':'label',
									'type': 'text',
									'default': 'label'
								}
							]					
						},{
							'type':'widget',
							'nature': 'button-element',
							'display': 'Button',
							'sizeable': true,
							'icon': 'bi bi-send',
							'propsDef':[
								{
									'name':'disabled',
									'type': 'boolean',
									'default': false
								},
								{
									'name':'icon',
									'type': 'text',
									'default': 'bi bi-send'
								},
								{
									'name':'label',
									'type': 'text',
									'default': 'button'
								},
								{
									'name':'style',
									'type': 'list',
									'values' : ['primary', 'secondary','info','success','warning','danger'],
									'default': 'primary'
								},
								{
									'name':'outlined',
									'type': 'boolean',
									'default': false
								}
							]
						}]

						
					};
				},
				methods: {
					loadWidgetMap: function() {
						for(let i=0;i<this.containers.length;i++) {
							this.$store.fieldTypeMap[this.containers[i].nature]=this.containers[i].propsDef;
						}
						for(let i=0;i<this.widgets.length;i++) {
							this.$store.fieldTypeMap[this.widgets[i].nature]=this.widgets[i].propsDef;
						}
					},
					loadCustomWidgetMap: function() {
						for(let i=0;i<this.customWidgets.length;i++) {
							this.$store.fieldTypeMap[this.customWidgets[i].nature]=this.customWidgets[i].propsDef;
						}
					}
				},
				components: {
					draggable: vuedraggable
				},
				beforeMount: function(){
					this.loadWidgetMap();
				}
			});
			
			if (window.customwidgets) {
				vm.customWidgets = window.customwidgets;
				vm.loadCustomWidgetMap();
			}
		},
	   
        build: function () {
			this.addHtmlTemplate();
			if (this.customWidgetUrl) {
				axios.get(this.customWidgetUrl).then(response => {
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