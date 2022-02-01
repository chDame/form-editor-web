Vue.component('form-content',{
  template: '<div :class="classname"><draggable v-if="!$store.preview" :list="content" class="dragArea row" group="form" ghost-class="ghost" @change="verifyRow">'+
					'<form-field v-for="(field, i) in content" :field="field" :index="i" @send-deletion="deletion"></form-field>'+
				'</draggable>'+
				'<form-field v-if="$store.preview" v-for="(field, i) in content" :index="i" :field="field"></form-field>'+
			'</div>',
  props: ['content', 'classname'],
  methods: {
	deletion(value) {
		console.log(value);
		this.content.splice(value, 1);
		this.verifyRow();
	},
	checkSubContent(obj) {
		if (obj.props.content) {
			for (var i=obj.props.content.length-1;i>=0;i--) {
				if(obj.props.content[i].nature!='row-element') {
					this.changeToRow(obj.props.content[i]);
				} else if (obj.props.content[i].nature=='row-element') {
					if (obj.props.content[i].props.content.length==0) {
						obj.props.content.splice(i, 1);
					} else this.correctRow(obj.props.content[i]);
				} else {
					this.checkSubContent(obj.props.content[i]);
				}
			}
		}
	},
	correctRow(row) {
		for (var i=0;i<row.props.content.length;i++) {
			if (row.props.content[i].nature=='row-element') {
				row.props.content = row.props.content.slice(0, i).concat(row.props.content[i].props.content).concat(row.props.content.slice(i+1, row.props.content.length));
				i--;
			}
		}
		for (var i=0;i<row.props.content.length;i++) {
			this.checkSubContent(row.props.content[i]);
		}
		
		//verify sub content
	},
	changeToRow(elt) {
		var clone = JSON.parse(JSON.stringify(elt));
		elt.type='contentWidget';
		elt.nature = 'row-element';
		elt.display = 'Row';
		elt.sizeable = false;
		elt.props = {'id':'row', 'content':[], 'icon' : 'rowwidget','class': ''};
		elt.props.content.push(clone);
	},
	verifyRow() {
		for (var i=this.$store.form.content.length-1;i>=0;i--) {
			if(this.$store.form.content[i].nature!='row-element') {
				this.changeToRow(this.$store.form.content[i]);
			} else if (this.$store.form.content[i].props.content.length==0) {
				this.$store.form.content.splice(i, 1);
			} else this.correctRow(this.$store.form.content[i]);
		}
		if (this.$store.currentField && this.$store.currentField.nature=='row-element') {
			this.$store.currentField = null;
		}
	}
  }
});
Vue.component('form-field',{
  template: '<div v-on:click="select($event)" :class="className">'+
			'	  <span class="form-field-type"><i class="bi bi-trash" v-on:click="deletion()"></i> {{ field.display }}</span>'+
			'		<component :is="field.nature"'+
			'		   :props="field.props">'+
			'		</component>  '+
			'</div>',
  props: ['field', 'index'],
  methods: {
	  select(event) {
		if (this.field.nature!='row-element') {
			this.$store.currentField = this.field;
		}
		event.stopPropagation();
	  },
	  deletion() {
		  console.log(this.index);
		  this.$emit('send-deletion', this.index);
	  }
  },
  computed: {
	className() {
		var className = 'form-field '+this.field.nature;
		if (this.field.sizeable) {
			className+=' col-lg-'+this.field.props.lg+' col-md-'+this.field.props.md+' col-sm-'+this.field.props.sm+' col-'+this.field.props.xs;
		}
		if (this.$store.currentField && this.$store.currentField.props.id == this.field.props.id) {
			className+=' currentField';
		}
		if (this.field.props.class) {
			className=this.field.props.class+' '+className;
		}
		return className;
	}
  }
});