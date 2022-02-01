Vue.component('my-header',{ template: '<nav class="navbar navbar-light bg-dark text-light">'+
		'<div class="container-fluid">'+
			'<component v-if="$store.menu" :is="$store.menu"></component>'+
			'<a v-else class="navbar-brand text-light" href="#">{{apptitle}}</a>'+
			'<div class="btn-group" role="group" aria-label="Basic outlined example">'+
			  '<template v-if="!$store.preview">'+
				'<a data-bs-target="#sidebar" data-bs-toggle="collapse" type="button" class="btn btn-outline-light"><i class="bi bi-boxes"></i></a>'+
				'<a data-bs-target="#sidebar-properties" data-bs-toggle="collapse" type="button" class="btn btn-outline-light"><i class="bi bi-card-list"></i></a>'+
				'<a data-bs-target="#data-panel" data-bs-toggle="collapse" type="button" class="btn btn-outline-light"><i class="bi bi-braces"></i></a>'+
			  '</template>'+
			'</div>'+
			
			'<div class="form-check">'+
			  '<input class="form-check-input" type="checkbox" v-model="$store.preview" id="checkPreview">'+
			  '<label class="form-check-label" for="checkPreview">Preview</label>'+
			'</div>'+
		'</div>'+
	'</nav>',
  props: ['apptitle']
 });
Vue.component('widgets-list',{
  template: '<draggable :list="list" :group="{ name: \'form\', pull: \'clone\', put: false}" :clone="cloneWidget">'+
				'<div v-for="widget in list" class="widgetbtn"><i :class="\'widgetIcon \'+widget.icon"></i>{{ widget.display }}</div>'+
			'</draggable>',
  props: ['list'],
  methods: {
	cloneWidget(obj) {
		var clone = JSON.parse(JSON.stringify(obj));
		
		clone.props={};
		if (clone.type=='contentWidget') {
			clone.props.content=[];
		}
		if (clone.sizeable) {
			clone.props.lg=12;
			clone.props.md=12;
			clone.props.sm=12;
			clone.props.xs=12;
		}
		for(i=0;i < clone.propsDef.length; i++) {
			prop = clone.propsDef[i];
			if (prop.default) {
				clone.props[prop.name]=prop.default;
			}
		}
		clone.propsFn={};
		clone.binding={};
		clone.props.id = 'widget'+(this.$store.globalId++);
		delete clone.propsDef;
		return clone;
	}
  }
});
Vue.component('widget-side-bar',{
  template: '<div id="sidebar" class="collapse collapse-horizontal show border-end">'+
		'<div id="sidebar-nav" class="list-group bg-secondary border-0 rounded-0 text-sm-start">'+		
			'<div class="accordion" id="widgetAccordions">'+
				'<accordion-item itemid="containers-widgets" title="Containers" :show=false parentId="#widgetAccordions"><widgets-list :list="containers"/></accordion-item>'+
				'<accordion-item itemid="standard-widgets" title="Widgets" :show=true parentId="#widgetAccordions"><widgets-list :list="widgets"/></accordion-item>'+
				'<accordion-item v-if="customwidgets.length>0" itemid="custom-widgets" title="Custom" :show=false parentId="#widgetAccordions"><widgets-list :list="customwidgets"/></accordion-item>'+
			'</div>'+
		'</div>'+
	'</div>',
  props: ['containers', 'widgets', 'customwidgets']
});

Vue.component('accordion-item', {
  template: '<div class="accordion-item">'+
				'<h2 class="accordion-header">'+
					'<button class="accordion-button bg-secondary text-light" type="button" data-bs-toggle="collapse" :data-bs-target="\'#\'+itemid">{{title}}</button>'+
				'</h2>'+
				'<div :id="itemid" :class="show ? \'accordion-collapse collapse show\' : \'accordion-collapse collapse\'"  :data-bs-parent="parentId">'+
					'<div class="accordion-body bg-secondary"><slot></slot></div>'+
				'</div>'+
			'</div>',
	props:['itemid', 'title', 'show', 'parentId']
});	

Vue.component('properties-side-bar',{
  template: '<div id="sidebar-properties" class="collapse collapse-horizontal show border-start">'+
				'<div id="properties-nav" class="card text-white bg-secondary border-0 rounded-0 text-sm-start">'+
					'<div class="accordion" v-if="$store.currentField!=null">'+
						'<accordion-item itemid="properties-general" :title="$store.currentField.display" :show=false>'+
							'<prop-fn :propdef="{\'name\':\'id\', \'type\':\'text\', \'required\':true}" :fnenabled=false></prop-fn>'+
						'</accordion-item>'+
						'<accordion-item itemid="properties-display" title="Display" :show=true>'+
							'<prop-fn :propdef="{\'name\':\'hidden\', \'type\':\'boolean\'}" :fnenabled=true></prop-fn>'+
							'<prop-fn :propdef="{\'name\':\'class\', \'type\':\'text\'}" :fnenabled=true></prop-fn>'+
							'<display-comp icon="phone" property="xs" v-if="$store.currentField.props.xs"></display-comp>'+
							'<display-comp icon="tablet-landscape" property="sm" v-if="$store.currentField.props.sm"></display-comp>'+
							'<display-comp icon="laptop" property="md" v-if="$store.currentField.props.md"></display-comp>'+
							'<display-comp icon="display" property="lg" v-if="$store.currentField.props.lg"></display-comp>'+
						'</accordion-item>'+
						'<accordion-item itemid="properties-other" title="Other" :show=true>'+
							'<div v-for="prop in $store.fieldTypeMap[$store.currentField.nature]">'+
								'<prop-list v-if="prop.type==\'list\'" :propdef="prop"></prop-list>'+
								'<prop-binding v-else-if="prop.type==\'binding\'" :propdef="prop"></prop-binding>'+
								'<prop-fn v-else :propdef="prop" :fnenabled=true></prop-fn>'+
							'</div>'+
						'</accordion-item>'+
					'</div>'+
				'</div>'+
			'</div>'
});
  
  
Vue.component('data-panel',{
  template: '<div id="data-panel" class="card collapse collapse-vertical show">'+
	'<div class="card-header bg-secondary text-light d-flex justify-content-between" @drag="drag" @dragend="release" draggable=true><span>Data Panel</span>'+
		'<button class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#dataModal"><i class="bi bi-plus-lg"></i></button>'+
	'</div>'+
	'<div class="card-body" :style="style"><table class="table table-dark table-striped table-hover">'+
		'<thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Type</th><th scope="col">value</th><th scope="col"></th></tr></thead>'+
		'<tbody>'+
			'<tr v-for="(data, i) in $store.form.data">'+
				'<th scope="row">{{i}}</th>'+
				'<td>{{data.name}}</td>'+
				'<td>{{data.type}}</td>'+
				'<td>{{data.value}}</td>'+
				'<td><i @click="modifyData(data)" class="data-action bi bi-pencil"></i><i @click="deleteData(i)" class="data-action bi bi-trash"></i></td>'+
			'</tr>'+
		'</tbody>'+
	'</table></div>'+
  '</div>',
  data() {
    return {
      height: 100,
	  clientY:null
	}
  },
  methods: {
	  modifyData:function(data) {
		this.$store.currentData = data;  
		let modal = new bootstrap.Modal(document.getElementById('dataModal'), {});
		modal.show();
	  },
	  deleteData:function(i) {
		  this.$store.form.data.splice(i,1);
	  },
	  drag: function(evt){
		  if (this.clientY!=null) {
			  this.height=this.height-evt.clientY+this.clientY;
		  }
		  this.clientY=evt.clientY;
		  console.log(evt);
	  },
	  release: function(evt){
		  this.height=this.height-evt.clientY+this.clientY;
		  this.clientY=null;
	  }
  },
  computed: {
	  style: function() {
		  return 'height:'+this.height+'px; overflow:auto';
	  }
  }
});

Vue.component('data-modal',{
  template: '<div class="modal fade" id="dataModal" ref="dataModal" tabindex="-1">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header bg-secondary text-light">'+
        '<h5 class="modal-title" v-if="this.$store.currentData">Update {{this.$store.currentData.name}}</h5>'+
        '<h5 class="modal-title" v-else="this.$store.currentData">Create a new data</h5>'+
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
      '</div>'+
      '<div class="modal-body">'+
        '<div class="input-group mb-3" v-if="!this.$store.currentData">'+
			'<span class="input-group-text">Name</span>'+
			'<input type="text" class="form-control" placeholder="Name" v-model="data.name">'+
        '</div>'+
		'<div class="input-group mb-3">'+
		  '<label class="input-group-text" for="dataType">Type</label>'+
		  '<select class="form-select" id="dataType" v-model="data.type" @chqnge="changeType">'+
			'<option>Choose...</option>'+
			'<option>String</option>'+
			'<option>JSON</option>'+
			'<option>URL</option>'+
			'<option>Javascript</option>'+
			'<option>URL parameter</option>'+
		  '</select>'+
		'</div>'+
        '<div class="input-group mb-3" v-if="data.type==\'String\' || data.type==\'URL\' || data.type==\'URL parameter\'">'+
			'<span class="input-group-text" v-if="data.type==\'String\'">Value</span>'+
			'<span class="input-group-text" v-if="data.type==\'URL\'">URL</span>'+
			'<span class="input-group-text" v-if="data.type==\'URL parameter\'">Parameter name</span>'+
			'<input type="text" class="form-control" placeholder="Value" v-model="data.value">'+
        '</div>'+
		'<json-editor v-if="shown && data.type==\'JSON\'" :data="data"></json-editor>'+
		'<javascript-editor v-if="shown && data.type==\'Javascript\'" :data="data"></javascript-editor>'+
      '</div>'+
      '<div class="modal-footer">'+
        '<button type="button" class="btn btn-primary" @click="saveData" data-bs-dismiss="modal">Save</button>'+
        '<button class="btn btn-link" data-bs-dismiss="modal">Cancel</button>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>',
  data() {
    return {
		data: {
		  name: "",
		  type:"String",
		  value:"",
		},
		shown:false
	}
  },
  methods: {
	  displayEditor(){
		  this.shown = true;
	  },
	  prepareData() {
		  if (this.$store.currentData) {
			  this.data = Object.assign({}, this.$store.currentData);
		  } else {
			this.data.name="";
			this.data.type="String";
			this.data.value="";
		  }
	  },
	  saveData() {
		  if (this.$store.currentData) {
			  this.$store.currentData.type=this.data.type;
			  this.$store.currentData.value=this.data.value;
		  }
		  else {
			  this.$store.form.data.push(Object.assign({}, this.data));
		  }
	  },
	  changeType() {
		  this.data.value="";
	  },
	  closeModal(){
		  this.shown = false;
		  this.$store.currentData = null;
	  }
  },
  mounted(){
	document.getElementById("dataModal").addEventListener('show.bs.modal', this.prepareData);
	document.getElementById("dataModal").addEventListener('shown.bs.modal', this.displayEditor);
	document.getElementById("dataModal").addEventListener('hidden.bs.modal', this.closeModal);
  }
});

Vue.component('json-editor',{
  template: '<div><span class="form-label">JSON value</span><textarea id="jsonEditor">{{data.value}}</textarea></div>',
  props:['data'],
  mounted(){
	this.codemirror = CodeMirror.fromTextArea(document.getElementById('jsonEditor'), {
				lineNumbers: true,
				matchBrackets: true,
				continueComments: "Enter",
				extraKeys: {"Ctrl-Q": "toggleComment"},
				autoRefresh:true,
				mode: "json"
			  });
	this.codemirror.on('change', (cm) => {
		this.$set(this.data, 'value', cm.getValue());
    });
  }
});

Vue.component('javascript-editor',{
  template: '<div><span class="form-label">Javascript</span><textarea id="javascriptEditor">{{data.value}}</textarea></div>',
  props:['data'],
  mounted(){
	this.codemirror = CodeMirror.fromTextArea(document.getElementById('javascriptEditor'), {
				lineNumbers: true,
				matchBrackets: true,
				continueComments: "Enter",
				extraKeys: {"Ctrl-Q": "toggleComment"},
				autoRefresh:true,
				mode: "javascript"
			  });
	this.codemirror.on('change', (cm) => {
		this.$set(this.data, 'value', cm.getValue());
    });
  }
});

Vue.component('fn-prop-modal',{
  template: '<div class="modal fade" id="fnPropModal" ref="fnPropModal" tabindex="-1">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header bg-secondary text-light">'+
        '<h5 class="modal-title" v-if="$store.currentProp">F(x) : {{$store.currentProp.name}}</h5>'+
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
      '</div>'+
      '<div class="modal-body">'+
		'<javascript-editor v-if="shown==true" :data="data"></javascript-editor>'+
		'<i>to access the data, use the this.$store prefix. For example this.$store.myJsonData.attribute</i>'+
      '</div>'+
      '<div class="modal-footer">'+
        '<button type="button" class="btn btn-primary" @click="changeProperty" data-bs-dismiss="modal">Save</button>'+
        '<button class="btn btn-link" data-bs-dismiss="modal">Cancel</button>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>',
  data() {
    return {
		data: {
		  value:""
		},
		shown:false
	}
  },
  methods: {
	  displayEditor(){
		  this.shown = true;
	  },
	  prepareDisplay(){
		  this.data.value = this.$store.currentField.propsFn[this.$store.currentProp.name].value;
	  },
	  changeProperty() {
		  this.$store.currentField.propsFn[this.$store.currentProp.name].value= this.data.value;
	  },
	  closeEditor(){
		  this.shown = false;
	  }
  },
  mounted(){
	document.getElementById("fnPropModal").addEventListener('show.bs.modal', this.prepareDisplay);
	document.getElementById("fnPropModal").addEventListener('shown.bs.modal', this.displayEditor);
	document.getElementById("fnPropModal").addEventListener('hidden.bs.modal', this.closeEditor);
  }
});