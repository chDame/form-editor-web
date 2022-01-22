Vue.component('display-comp', {
  template: '<div class="input-group mb-1 half">'+
				'<span :class="\'input-group-text bi bi-\'+icon"></span>'+
				'<input type="number" class="form-control" required v-model="$store.state.currentField.props[property]" min=1 max=12>'+
			'</div>',
  props: ['icon', 'property']
})
Vue.component('prop-component', {
  template: "<component v-if='display' :is='\"prop-\"+propdef.type' :propdef='propdef' :fnenabled='fnenabled'></component>",
  props: ['propdef', 'fnenabled'],
  data(){
  	return {
    	condition:this.propdef.condition,
		field:this.$store.state.currentField
    }
  },
  computed:{
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
    }
  }
})

Vue.component('prop-text', {
  template: "<div><label :class='labelClass'>{{propdef.name}}</label>"+
	"<div class='input-group mb-1'><span class='input-group-text' v-if='!fnenabled'>abc</span>"+
	"<button v-else class='btn btn-switch-prop dropdown-toggle' type='button' data-bs-toggle='dropdown'>{{valueType}}</button>"+
	"<ul v-if='fnenabled' class='dropdown-menu'>"+
		"<li><a class='dropdown-item' @click='litteral'>abc</a></li>"+
		"<li><a class='dropdown-item' @click='fn'>f(x)</a></li>"+
	"</ul><input v-if='valueType==\"abc\"' type='text' class='form-control' v-model='$store.state.currentField.props[propdef.name]'/>"+
	"<input v-else='valueType==\"abc\"' type='text' class='form-control' v-model='$store.state.currentField.propsFn[propdef.name].value'/></div>"+
  "</div>",
  props: ['propdef', 'fnenabled'],
  data() {
	  return {'valueType':this.$store.state.currentField.propsFn[this.propdef.name] && this.$store.state.currentField.propsFn[this.propdef.name].active?'f(x)':'abc'}
  },
  methods: {
	  fn() {
		this.valueType='f(x)';
		if (!this.$store.state.currentField.propsFn[this.propdef.name]) {
			this.$store.state.currentField.propsFn[this.propdef.name]={"active":true, "value":""};
		} else {
			this.$store.state.currentField.propsFn[this.propdef.name].active=true;
		}
	  },
	  litteral() {
		this.valueType='abc';
		this.$store.state.currentField.propsFn[this.propdef.name].active=false;
	  }
  },
  computed:{
	labelClass(){
		if (this.propdef.required) {
			return 'form-label required';
		}
		return 'form-label';
	}
  }
})
Vue.component('prop-number', {
  template: "<div><label :class='labelClass'>{{propdef.name}}</label>"+
	"<div class='input-group mb-1'><span class='input-group-text' v-if='!fnenabled'>123</span>"+
	"<button v-else class='btn btn-switch-prop dropdown-toggle' type='button' data-bs-toggle='dropdown'>{{valueType}}</button>"+
	"<ul v-if='fnenabled' class='dropdown-menu'>"+
		"<li><a class='dropdown-item' @click='litteral'>123</a></li>"+
		"<li><a class='dropdown-item' @click='fn'>f(x)</a></li>"+
	"</ul><input v-if='valueType==\"123\"' type='number' class='form-control' v-model='$store.state.currentField.props[propdef.name]'/>"+
	"<input v-else='valueType==\"123\"' type='text' class='form-control' v-model='$store.state.currentField.propsFn[propdef.name].value'/></div>"+
  "</div>",
  props: ['propdef', 'fnenabled'],
  data() {
	  return {'valueType':this.$store.state.currentField.propsFn[this.propdef.name] && this.$store.state.currentField.propsFn[this.propdef.name].active?'f(x)':'123'}
  },
  methods: {
	  fn() {
		this.valueType='f(x)';
		if (!this.$store.state.currentField.propsFn[this.propdef.name]) {
			this.$store.state.currentField.propsFn[this.propdef.name]={"active":true, "value":""};
		} else {
			this.$store.state.currentField.propsFn[this.propdef.name].active=true;
		}
	  },
	  litteral() {
		this.valueType='123';
		this.$store.state.currentField.propsFn[this.propdef.name].active=false;
	  }
  },
  computed:{
	labelClass(){
		if (this.propdef.required) {
			return 'form-label required';
		}
		return 'form-label';
	}
  }
})
Vue.component('prop-boolean', {
  template: "<div class='form-check mb-1'><input class='form-check-input' type='checkbox' v-model='$store.state.currentField.props[propdef.name]'><label class='form-check-label'>{{propdef.name}}</label></div>",
  props: ['propdef', 'fnenabled']
})
Vue.component('prop-list', {
  template: "<div class='mb-1'><label class='form-label'>{{propdef.name}}</label><select class='form-select' v-model='$store.state.currentField.props[propdef.name]'><option v-for='(value, i) in propdef.values'>{{value}}</option></select></div>",
  props: ['propdef', 'fnenabled']
})