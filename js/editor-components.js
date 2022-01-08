Vue.component('my-header',{ template: '<nav class="navbar navbar-light bg-dark text-light">'+
		'<div class="container-fluid">'+
			'<a class="navbar-brand text-light" href="#">{{apptitle}}</a>'+
			'<div class="btn-group" role="group" aria-label="Basic outlined example">'+
			  '<template v-if="!$store.state.preview">'+
				'<a data-bs-target="#sidebar" data-bs-toggle="collapse" type="button" class="btn btn-outline-light"><i class="bi bi-boxes"></i></a>'+
				'<a data-bs-target="#sidebar-properties" data-bs-toggle="collapse" type="button" class="btn btn-outline-light"><i class="bi bi-card-list"></i></a>'+
				'<a data-bs-target="#sidebar-properties" data-bs-toggle="collapse" type="button" class="btn btn-outline-light"><i class="bi bi-braces"></i></a>'+
			  '</template>'+
			'</div>'+
			'<div class="form-check">'+
			  '<input class="form-check-input" type="checkbox" v-model="$store.state.preview" id="checkPreview">'+
			  '<label class="form-check-label" for="checkPreview">Preview</label>'+
			'</div>'+
		'</div>'+
	'</nav>',
  props: ['apptitle']});
Vue.component('widget-side-bar',{
  template: '<div id="sidebar" class="collapse collapse-horizontal show border-end">'+
				'<div id="sidebar-nav" class="list-group bg-secondary border-0 rounded-0 text-sm-start min-vh-100">'+
				
					'<div class="accordion" id="widgetAccordions" v-if="customwidgets.length>0">'+
						'<div class="accordion-item">'+
							'<h2 class="accordion-header">'+
								'<button class="accordion-button bg-secondary text-light" type="button" data-bs-toggle="collapse" data-bs-target="#standard-widgets" aria-expanded="true" aria-controls="standard-widgets">Widgets</button>'+
							'</h2>'+
							'<div id="standard-widgets" class="accordion-collapse collapse show" data-bs-parent="#widgetAccordions">'+
								'<div class="bg-secondary">'+
									'<draggable :list="widgets" :group="{ name: \'form\', pull: \'clone\', put: false}" :clone="cloneWidget" :move="moveWidget" @end="endDrag">'+
										'<div v-for="(widget, i) in widgets" :key="i" class="widgetbtn">'+
											' <i :class="\'widgetIcon \'+widget.props.icon"></i>{{ widget.display }}'+
										'</div>'+
									'</draggable>'+
								'</div></div></div>'+
						'<div class="accordion-item">'+
							'<h2 class="accordion-header">'+
								'<button class="accordion-button bg-secondary text-light" type="button" data-bs-toggle="collapse" data-bs-target="#custom-widgets" aria-expanded="true" aria-controls="custom-widgets">Custom Widgets</button>'+
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
  props: ['widgets', 'customwidgets'],
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
		if (window.dropZone!=null) {
			window.dropZone.classList.remove("highlight");
		}
		evt.to.classList.add("highlight");
		window.dropZone = evt.to;
	},
	endDrag(evt) {
		window.dropZone.classList.remove("highlight");
		window.dropZone = null;
	}
  }
});
Vue.component('properties-side-bar',{
  template: '<div id="sidebar-properties" class="collapse collapse-horizontal show border-start">'+
				'<div id="properties-nav" class="card text-white bg-secondary border-0 rounded-0 text-sm-start min-vh-100">'+
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
										'<div v-for="(prop, i) in $store.state.fieldTypeMap[$store.state.currentField.type]" :key="i">'+
											'<component :is="\'prop-\'+prop.type" :propdef="prop"></component>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'
});