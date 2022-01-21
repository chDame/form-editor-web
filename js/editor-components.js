Vue.component('my-header',{ template: '<nav class="navbar navbar-light bg-dark text-light">'+
		'<div class="container-fluid">'+
			'<component v-if="$store.state.menu" :is="$store.state.menu"></component>'+
			'<a v-else class="navbar-brand text-light" href="#">{{apptitle}}</a>'+
			'<div class="btn-group" role="group" aria-label="Basic outlined example">'+
			  '<template v-if="!$store.state.preview">'+
				'<a data-bs-target="#sidebar" data-bs-toggle="collapse" type="button" class="btn btn-outline-light"><i class="bi bi-boxes"></i></a>'+
				'<a data-bs-target="#sidebar-properties" data-bs-toggle="collapse" type="button" class="btn btn-outline-light"><i class="bi bi-card-list"></i></a>'+
				'<a data-bs-target="#data-panel" data-bs-toggle="collapse" type="button" class="btn btn-outline-light"><i class="bi bi-braces"></i></a>'+
			  '</template>'+
			'</div>'+
			
			'<div class="form-check">'+
			  '<input class="form-check-input" type="checkbox" v-model="$store.state.preview" id="checkPreview">'+
			  '<label class="form-check-label" for="checkPreview">Preview</label>'+
			'</div>'+
		'</div>'+
	'</nav>',
  props: ['apptitle']
 });
Vue.component('widget-side-bar',{
  template: '<div id="sidebar" class="collapse collapse-horizontal show border-end">'+
				'<div id="sidebar-nav" class="list-group bg-secondary border-0 rounded-0 text-sm-start">'+
				
					'<div class="accordion" id="widgetAccordions" >'+
						'<div class="accordion-item">'+
							'<h2 class="accordion-header">'+
								'<button class="accordion-button bg-secondary text-light" type="button" data-bs-toggle="collapse" data-bs-target="#containers-widgets" aria-expanded="true" aria-controls="containers-widgets">Containers</button>'+
							'</h2>'+
							'<div id="containers-widgets" class="accordion-collapse collapse show" data-bs-parent="#widgetAccordions">'+
								'<div class="bg-secondary">'+
									'<draggable :list="containers" :group="{ name: \'form\', pull: \'clone\', put: false}" :clone="cloneWidget" :move="moveWidget" @end="endDrag">'+
										'<div v-for="(widget, i) in containers" :key="i" class="widgetbtn">'+
											' <i :class="\'widgetIcon \'+widget.props.icon"></i>{{ widget.display }}'+
										'</div>'+
									'</draggable>'+
								'</div></div></div>'+
						'<div class="accordion-item">'+
							'<h2 class="accordion-header">'+
								'<button class="accordion-button bg-secondary text-light" type="button" data-bs-toggle="collapse" data-bs-target="#standard-widgets" aria-expanded="true" aria-controls="standard-widgets">Widgets</button>'+
							'</h2>'+
							'<div id="standard-widgets" class="accordion-collapse collapse" data-bs-parent="#widgetAccordions">'+
								'<div class="bg-secondary">'+
									'<draggable :list="widgets" :group="{ name: \'form\', pull: \'clone\', put: false}" :clone="cloneWidget" :move="moveWidget" @end="endDrag">'+
										'<div v-for="(widget, i) in widgets" :key="i" class="widgetbtn">'+
											' <i :class="\'widgetIcon \'+widget.props.icon"></i>{{ widget.display }}'+
										'</div>'+
									'</draggable>'+
								'</div></div></div>'+
						'<div class="accordion-item" v-if="customwidgets.length>0">'+
							'<h2 class="accordion-header">'+
								'<button class="accordion-button bg-secondary text-light" type="button" data-bs-toggle="collapse" data-bs-target="#custom-widgets" aria-expanded="true" aria-controls="custom-widgets">Custom</button>'+
							'</h2>'+
							'<div id="custom-widgets" class="accordion-collapse collapse" data-bs-parent="#widgetAccordions">'+
								'<div class="bg-secondary">'+
									'<draggable :list="customwidgets" :group="{ name: \'form\', pull: \'clone\', put: false}" :clone="cloneWidget" :move="moveWidget" @end="endDrag">'+
										'<div v-for="(widget, i) in customwidgets" :key="i" class="widgetbtn">'+
											' <i :class="\'widgetIcon \'+widget.props.icon"></i>{{ widget.display }}'+
										'</div>'+
									'</draggable>'+
								'</div></div></div>'+
					'</div>'+
				
					'<draggable v-else :list="widgets" :group="{ name: \'form\', pull: \'clone\', put: false}" :clone="cloneWidget" :move="moveWidget" @end="endDrag">'+
						'<div v-for="(widget, i) in widgets" :key="i" class="widgetbtn">'+
							' <i :class="\'widgetIcon \'+widget.props.icon"></i>{{ widget.display }}'+
						'</div>'+
					'</draggable>'+
				
				'</div>'+
			'</div>',
  props: ['containers', 'widgets', 'customwidgets'],
  methods: {
	cloneWidget(obj) {
		var clone = JSON.parse(JSON.stringify(obj));
		delete clone.propsDef;
		if (clone.sizeable) {
			clone.props.lg=12;
			clone.props.md=12;
			clone.props.sm=12;
			clone.props.xs=12;
		}
		clone.props.id = clone.display+(this.$store.state.globalId++);
		return clone;
	},
	moveWidget(evt) {
		//if (window.dropZone!=null) {
		//	window.dropZone.classList.remove("highlight");
		//}
		//evt.to.classList.add("highlight");
		//window.dropZone = evt.to;
	},
	endDrag(evt) {
		//window.dropZone.classList.remove("highlight");
		//window.dropZone = null;
	}
  }
});
Vue.component('properties-side-bar',{
  template: '<div id="sidebar-properties" class="collapse collapse-horizontal show border-start">'+
				'<div id="properties-nav" class="card text-white bg-secondary border-0 rounded-0 text-sm-start">'+
					'<div class="accordion" v-if="$store.state.currentField!=null">'+
						'<div class="accordion-item">'+
							'<h2 class="accordion-header">'+
								'<button class="accordion-button bg-secondary text-light" type="button" data-bs-toggle="collapse" data-bs-target="#properties-general" aria-expanded="true" aria-controls="properties-general">'+
									'{{$store.state.currentField.display}}'+
								'</button>'+
							'</h2>'+
							'<div id="properties-general" class="accordion-collapse collapse show">'+
								'<div class="accordion-body bg-secondary">'+
									'<label class="form-label required">Component id</label>'+
										'<div class="input-group mb-1">'+
											'<span class="input-group-text">abc</span>'+
											'<input type="text" class="form-control" required v-model="$store.state.currentField.props.id">'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="accordion-item" v-if="$store.state.currentField.sizeable">'+
								'<h2 class="accordion-header">'+
									'<button class="accordion-button bg-secondary text-light" type="button" data-bs-toggle="collapse" data-bs-target="#properties-display" aria-expanded="true" aria-controls="properties-display">'+
										'Display'+
									'</button>'+
								'</h2>'+
								'<div id="properties-display" class="accordion-collapse collapse show">'+
									'<div class="accordion-body bg-secondary">'+
										'<div class="form-check mb-1"><input class="form-check-input" type="checkbox" v-model="$store.state.currentField.props.hidden"><label class="form-check-label">Hidden</label></div>'+
										'<div class="input-group mb-1 half">'+
											'<span class="input-group-text bi bi-phone"></span>'+
											'<input type="number" class="form-control" required v-model="$store.state.currentField.props.xs" min=1 max=12>'+
										'</div>'+
										'<div class="input-group mb-1 half">'+
											'<span class="input-group-text bi bi-tablet-landscape"></span>'+
											'<input type="number" class="form-control" required v-model="$store.state.currentField.props.sm" min=1 max=12>'+
										'</div> '+
										'<div class="input-group mb-1 half">'+
											'<span class="input-group-text bi bi-laptop"></span>'+
											'<input type="number" class="form-control" required v-model="$store.state.currentField.props.md" min=1 max=12>'+
										'</div>'+
										'<div class="input-group mb-1 half">'+
											'<span class="input-group-text bi bi-display"></span>'+
											'<input type="number" class="form-control" required v-model="$store.state.currentField.props.lg" min=1 max=12>'+
										'</div> '+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="accordion-item">'+
								'<h2 class="accordion-header">'+
									'<button class="accordion-button bg-secondary text-light" type="button" data-bs-toggle="collapse" data-bs-target="#properties-other" aria-expanded="true" aria-controls="properties-other">'+
										'Other'+
									'</button>'+
								'</h2>'+
								'<div id="properties-other" class="accordion-collapse collapse show">'+
									'<div class="accordion-body bg-secondary">'+
										'<div v-for="prop in $store.state.fieldTypeMap[$store.state.currentField.nature]">'+
											'<component :is="\'prop-\'+prop.type" :propdef="prop"></component>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'
});
  
  
Vue.component('data-panel',{
  template: '<div id="data-panel" class="card collapse collapse-vertical show">'+
	'<div class="card-header bg-secondary text-light d-flex justify-content-between" @drag="press" @dragend="release" draggable=true><span>Data Panel</span>'+
		'<button class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#dataModal"><i class="bi bi-plus-lg"></i></button>'+
	'</div>'+
	'<div class="card-body" :style="style"><table class="table table-dark table-striped table-hover">'+
		'<thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Type</th><th scope="col">value</th><th scope="col"></th></tr></thead>'+
		'<tbody>'+
			'<tr v-for="(data, i) in $store.state.form.data">'+
				'<th scope="row">{{i}}</th>'+
				'<td>{{data.name}}</td>'+
				'<td>{{data.type}}</td>'+
				'<td>{{data.value}}</td>'+
				'<td>blop</td>'+
			'</tr>'+
		'</tbody>'+
	'</table></div>'+
  '</div>',
  data:function () {
    return {
      height: 100,
	  clientY:null
	}
  },
  methods: {
	  press: function(evt){
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
        '<h5 class="modal-title" id="exampleModalLabel">Create a new data</h5>'+
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
      '</div>'+
      '<div class="modal-body">'+
        '<div class="input-group mb-3">'+
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
		'<json-editor v-if="data.type==\'JSON\'" :data="data"></json-editor>'+
		'<javascript-editor v-if="data.type==\'Javascript\'" :data="data"></javascript-editor>'+
      '</div>'+
      '<div class="modal-footer">'+
        '<button type="button" class="btn btn-primary" @click="addData" data-bs-dismiss="modal">Save</button>'+
        '<button class="btn btn-link" data-bs-dismiss="modal">Cancel</button>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>',
  data:function () {
    return {
		data: {
		  name: "",
		  type:"String",
		  value:"",
		}
	}
  },
  methods: {
	  clear: function() {
		  this.data.name="";
		  this.data.type="String";
		  this.data.value="";
	  },
	  addData: function() {
		  this.$store.state.form.data.push(this.data);
	  },
	  changeType: function() {
		  this.data.value="";
	  }
  },
  mounted(){
	document.getElementById("dataModal").addEventListener('show.bs.modal', this.clear);
  }
});

Vue.component('json-editor',{
  template: '<div><textarea id="jsonEditor">{{data.value}}</textarea></div>',
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
  template: '<div><textarea id="javascriptEditor">{{data.value}}</textarea></div>',
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