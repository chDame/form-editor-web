Vue.component('form-content',{
  template: '<div><form-field v-if="$store.preview || readonly" v-for="(field, i) in content" :index="i" :field="field"></form-field>'+
				'<draggable v-if="!$store.preview && !readonly" :list="content" class="dragArea row" group="form" ghost-class="ghost" @change="verifyRow">'+
					'<form-field v-for="(field, i) in content" :field="field" :index="i" @send-deletion="deletion"></form-field>'+
				'</draggable>'+
			'</div>',
  props: {content:Array, readonly:{type:Boolean, default:false}},
  methods: {
	deletion(value) {
		this.content.splice(value, 1);
		this.verifyRow();
	},
	buildModal(modal) {
		if (modal.props.content.length!=2) {
			modal.props.content=[];
			modal.props.content.push({type:'contentWidget', nature:'modal-body-element', display:'Body', sizeable: false, props:{content:[]}});
			modal.props.content.push({type:'contentWidget', nature:'modal-footer-element', display:'Footer', sizeable: false, props:{content:[]}});
		}
	},
	checkSubContent(obj) {
		if (obj.props.content) {
			for (var i=obj.props.content.length-1;i>=0;i--) {
				if(obj.props.content[i].nature=='modal-element') {
					this.buildModal(obj.props.content[i]);
					this.$store.form.content.push(obj.props.content[i]);
					obj.props.content.splice(i, 1);
				} else if(obj.props.content[i].nature!='row-element' && 
							obj.props.content[i].nature!='modal-body-element'&& 
							obj.props.content[i].nature!='modal-footer-element') {
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
			} else if (row.props.content[i].nature=='modal-element') {
				this.buildModal(row.props.content[i]);
				this.$store.form.content.push(row.props.content[i]);
				row.props.content.splice(i, 1);
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
			if(this.$store.form.content[i].nature!='row-element' && this.$store.form.content[i].nature!='modal-element') {
				this.changeToRow(this.$store.form.content[i]);
			} else if (this.$store.form.content[i].nature=='row-element' && this.$store.form.content[i].props.content.length==0) {
				this.$store.form.content.splice(i, 1);
			} else {
				if (this.$store.form.content[i].nature=='modal-element') {
					this.buildModal(this.$store.form.content[i]);
				}
				this.correctRow(this.$store.form.content[i]);
			}
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