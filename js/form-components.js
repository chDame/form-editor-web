Vue.component('form-content',{
  template: '<div :class="classname"><draggable v-if="!$store.state.preview" :list="content" class="dragArea row" group="form" ghost-class="ghost" :move="moveWidget" @end="endDrag">'+
					'<form-field v-for="(field, i) in content" :key="i" :field="field"></form-field>'+
				'</draggable>'+
				'<div class="row"><form-field v-if="$store.state.preview" v-for="(field, i) in content" :key="i" :field="field"></form-field></div>'+
			'</div>',
  props: ['content', 'classname'],
  methods: {
	moveWidget(evt) {
		if (dropZone!=null) {
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
Vue.component('form-field',{
  template: '<div v-on:click="select($event)" :class="[!field.sizeable ? \'form-field\' : \'form-field col-lg-\'+field.props.lg+\' col-md-\'+field.props.md+\' col-sm-\'+field.props.sm+\' col-\'+field.props.xs]">'+
			'	  <span class="form-field-type">{{ field.display }}</span>'+
			'		<component :is="field.type"'+
			'		   :props="field.props">'+
			'		</component>  '+
			'</div>',
  props: ['field'],
  methods: {
	  select(event) {
		console.log(event);
		if (window.currentFieldDiv) {
			window.currentFieldDiv.classList.remove('currentField');
		}
		window.currentFieldDiv = this.$el;
		window.currentFieldDiv.classList.add('currentField');
		this.$store.state.currentField = this._props.field;
		
		event.stopPropagation();
	  }
	}
});