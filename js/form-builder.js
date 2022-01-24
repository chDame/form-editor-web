let template = '<my-header apptitle="Ed!t0r"></my-header>'+
	'<div class="container-fluid bg-secondary">'+
		'<div class="row flex-nowrap">'+
			'<div class="col-auto px-0" v-if="!$store.state.preview" >'+
				'<widget-side-bar :containers="containers" :widgets="widgets" :customwidgets="customWidgets"></widget-side-bar>'+
			'</div>'+
			'<main class="col ps-md-2 pt-2">'+
				'<div :class="[$store.state.preview ? \'p-3 bg-light border rounded preview\' : \'bg-light border rounded edition\']">'+
					'<form-content :content="$store.state.form.content"></form-content>'+
				'</div>'+
				'<data-panel></data-panel>'+
			'</main>'+
			'<div  v-if="!$store.state.preview" class="col-auto px-0">'+
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
			let vm = new Vue({
				el: '#editorApp',
				'store': new Vuex.Store({
					state: {
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
					},
					mutations: {
					  changePropValue (state, propValue) {
						  Vue.set(state.currentField.propsFn, propValue.prop.name, {"active":true, "value": propValue.value});
					  }
					}
				}),
				data: function () {
					return {
						customWidgets: [],
						containers: [{
							'type':'contentWidget',
							'nature': 'panel-element',
							'display': 'Panel',
							'sizeable': false,
							'props': {
								'id':'panel',
								'title': 'panel',
								'content':[],
								'icon' : 'rowwidget',
								'class': ''
							},
							'propsDef':[{
								'name':'title',
								'type': 'text'
							}]
						}],
						widgets: [{ 
							'type':'widget',
							'nature': 'input-element',
							'display': 'Input',
							'sizeable': true,
							'props': {
								'id':'input',
								'type': 'text',
								'icon' : 'bi bi-input-cursor-text',
								'class': '',
								'label': 'label :',
								'labelPosition': 'top',
								'placeholder': 'placeholder',
								'min': null,
								'max': null,
								'minlength': null,
								'maxlength': null,
								'required': true,
								'disabled': false,
								'hidden': false,
								
							},
							'propsDef':[
								{
									'name':'required',
									'type': 'boolean'
								},
								{
									'name':'disabled',
									'type': 'boolean'
								},
								{
									'name':'type',
									'type': 'list',
									'values' : ['text', 'number', 'email', 'password']
								},
								{
									'name':'icon',
									'type': 'text'
								},
								{
									'name':'class',
									'type': 'text'
								},
								{
									'name':'label',
									'type': 'text',
								},
								{
									'name':'labelPosition',
									'type': 'list',
									'values' : ['top', 'left']
								},
								{
									'name':'placeholder',
									'type': 'text'
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
							'props': {
								'id':'checkbox',
								'icon' : 'bi bi-check-square',
								'class': '',
								'label': 'label',
								'required': true,
								'disabled': false,
								'hidden': false,
								
							},
							'propsDef':[
								{
									'name':'required',
									'type': 'boolean'
								},
								{
									'name':'disabled',
									'type': 'boolean'
								},
								{
									'name':'class',
									'type': 'text'
								},
								{
									'name':'label',
									'type': 'text'
								}
							]					
						},{
							'type':'widget',
							'nature': 'button-element',
							'display': 'Button',
							'sizeable': true,
							'props': {
								'id':'button',
								'icon': 'bi bi-send',
								'label': 'button',
								'class': '',
								'style': 'primary',
								'outlined': false,
								'disabled': false,
								'hidden': false,
							},
							'propsDef':[
								{
									'name':'disabled',
									'type': 'boolean'
								},
								{
									'name':'label',
									'type': 'text'
								},
								{
									'name':'style',
									'type': 'list',
									'values' : ['primary', 'secondary','info','success','warning','danger']
								},
								{
									'name':'outlined',
									'type': 'boolean'
								}
							]
						}]

						
					};
				},
				methods: {
					loadWidgetMap: function() {
						for(let i=0;i<this.containers.length;i++) {
							this.$store.state.fieldTypeMap[this.containers[i].nature]=this.containers[i].propsDef;
						}
						for(let i=0;i<this.widgets.length;i++) {
							this.$store.state.fieldTypeMap[this.widgets[i].nature]=this.widgets[i].propsDef;
						}
					},
					loadCustomWidgetMap: function() {
						for(let i=0;i<this.customWidgets.length;i++) {
							this.$store.state.fieldTypeMap[this.customWidgets[i].nature]=this.customWidgets[i].propsDef;
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