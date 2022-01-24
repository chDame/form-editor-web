Vue.component('display-comp', {
  template: '<div class="input-group mb-1 half">'+
				'<span :class="\'input-group-text bi bi-\'+icon"></span>'+
				'<input type="number" class="form-control" required v-model="$store.state.currentField.props[property]" min=1 max=12>'+
			'</div>',
  props: ['icon', 'property']
})

Vue.component('simple-text', {
  template: "<input type='text' class='form-control' v-model='$store.state.currentField.props[propdef.name]'/>",
  props: ['propdef']
})
Vue.component('simple-number', {
  template: "<input type='number' class='form-control' v-model='$store.state.currentField.props[propdef.name]'/>",
  props: ['propdef']
})
Vue.component('simple-boolean', {
  template: "<div class='input-group-text'><input class='form-check-input mt-0 p-2 me-2' type='checkbox' v-model='$store.state.currentField.props[propdef.name]'><label class='form-check-label'>{{propdef.name}}</label></div>",
  props: ['propdef']
})

Vue.component('prop-fn', {
  template: "<div v-if='display' class='property-field'><label :class='labelClass' v-if='littType!=\"bool\" || valueType==\"f(x)\"'>{{propdef.name}}</label>"+
	"<div class='input-group mb-1'><span class='input-group-text' v-if='!fnenabled'>{{littType}}</span>"+
	"<button v-else class='btn btn-switch-prop dropdown-toggle' type='button' data-bs-toggle='dropdown'>{{valueType}}</button>"+
	"<ul v-if='fnenabled' class='dropdown-menu'>"+
		"<li><a class='dropdown-item' @click='litteral'>{{littType}}</a></li>"+
		"<li><a class='dropdown-item' @click='fn'>f(x)</a></li>"+
	"</ul><component v-if='valueType==littType' :is='\"simple-\"+propdef.type' :propdef='propdef'/>"+
	"<input v-else type='text' class='form-control' v-model='propValue'/>"+
  "</div><i v-if='valueType!=littType' class='overlay bi bi-fullscreen' @click='openFnPropModal'></i></div>",
  props: ['propdef', 'fnenabled'],
  data() {
	  return {
		  condition:this.propdef.condition,
		  field:this.$store.state.currentField,
		  littType:null,
		  valueType:null
	  }
  },
  methods: {
	  fn() {
		this.valueType='f(x)';
		if (!this.$store.state.currentField.propsFn[this.propdef.name]) {
			this.$store.commit('changePropValue', {"prop": this.propdef, "value": ""});
		} else {
			this.$store.state.currentField.propsFn[this.propdef.name].active=true;
		}
	  },
	  litteral() {
		this.valueType=this.littType;
		this.$store.state.currentField.propsFn[this.propdef.name].active=false;
	  },
	  openFnPropModal() {
		  this.$store.state.currentProp = this.propdef;
		  let modal = new bootstrap.Modal(document.getElementById('fnPropModal'), {});
		  modal.show();
	  }
  },
  created() {
	  this.littType=this.propdef.type=='text'?'abc':this.propdef.type=='number'?'123':'bool';
	  this.valueType=this.$store.state.currentField.propsFn[this.propdef.name] && this.$store.state.currentField.propsFn[this.propdef.name].active?'f(x)':this.littType;  
  },
  computed:{
	propValue: {
		get () {
			return this.$store.state.currentField.propsFn[this.propdef.name].value;
		},
		set (value) {
		  this.$store.commit('changePropValue', {"prop": this.propdef, "value": value});
		}
	},
	display(){
    	with(this){
      	try{
			if (!condition) {
				return true;
			}
        	return eval(condition);
        } catch(error){
        	console.log(error.message);
        }      	
      }
    },
	labelClass(){
		if (this.propdef.required) {
			return 'form-label required';
		}
		return 'form-label';
	}
  }
})
Vue.component('prop-list', {
  template: "<div class='mb-1'><label class='form-label'>{{propdef.name}}</label><select class='form-select' v-model='$store.state.currentField.props[propdef.name]'><option v-for='(value, i) in propdef.values'>{{value}}</option></select></div>",
  props: ['propdef']
})