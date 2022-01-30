Vue.component('display-comp', {
  template: '<div class="input-group mb-1 half">'+
				'<span :class="\'input-group-text bi bi-\'+icon"></span>'+
				'<input type="number" class="form-control" required v-model="$store.currentField.props[property]" min=1 max=12>'+
			'</div>',
  props: ['icon', 'property']
})

Vue.component('simple-text', {
  template: "<input type='text' class='form-control' v-model='$store.currentField.props[propdef.name]'/>",
  props: ['propdef']
})
Vue.component('simple-number', {
  template: "<input type='number' class='form-control' v-model='$store.currentField.props[propdef.name]'/>",
  props: ['propdef']
})
Vue.component('simple-boolean', {
  template: "<div class='input-group-text'><input class='form-check-input mt-0 p-2 me-2' type='checkbox' v-model='$store.currentField.props[propdef.name]'><label class='form-check-label'>{{propdef.name}}</label></div>",
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
	"<input v-else type='text' class='form-control' v-model='field.propsFn[propdef.name].value'/>"+
  "</div><i v-if='valueType!=littType' class='overlay bi bi-fullscreen' @click='openFnPropModal'></i></div>",
  props: ['propdef', 'fnenabled'],
  data() {
	  return {
		  condition:this.propdef.condition,
		  field:this.$store.currentField,
		  littType:null,
		  valueType:null
	  }
  },
  methods: {
	  fn() {
		if (!this.$store.currentField.propsFn[this.propdef.name]) {
			Vue.set(this.$store.currentField.propsFn, this.propdef.name, {'active':true, 'value':''});
		} else {
			this.$store.currentField.propsFn[this.propdef.name].active=true;
		}
		this.valueType='f(x)';
	  },
	  litteral() {
		this.valueType=this.littType;
		this.$store.currentField.propsFn[this.propdef.name].active=false;
	  },
	  openFnPropModal() {
		  this.$store.currentProp = this.propdef;
		  let modal = new bootstrap.Modal(document.getElementById('fnPropModal'), {});
		  modal.show();
	  }
  },
  watch: {
   	propdef: function(newVal, oldVal) {
		this.condition=this.propdef.condition;
		this.field=this.$store.currentField;
		this.littType=newVal.type=='text'?'abc':newVal.type=='number'?'123':'bool';
		this.valueType=this.$store.currentField.propsFn[this.propdef.name] && this.$store.currentField.propsFn[this.propdef.name].active?'f(x)':this.littType;  
    }
  },
  created() {
	  this.littType=this.propdef.type=='text'?'abc':this.propdef.type=='number'?'123':'bool';
	  this.valueType=this.$store.currentField.propsFn[this.propdef.name] && this.$store.currentField.propsFn[this.propdef.name].active?'f(x)':this.littType;  
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
  template: "<div class='mb-1'><label class='form-label'>{{propdef.name}}</label><select class='form-select' v-model='$store.currentField.props[propdef.name]'><option v-for='(value, i) in propdef.values'>{{value}}</option></select></div>",
  props: ['propdef']
})

Vue.component('prop-binding', {
  template:"<div class='property-field autocomplete'><label class='form-label'>{{propdef.name}}</label>"+
  "<div class='input-group mb-1'><span class='input-group-text'><i class='bi bi-link-45deg'></i></span>"+
    "<input v-model='$store.currentField.binding[propdef.name]' @input='onChange' @keydown.down='onArrowDown' @keydown.up='onArrowUp' @keydown.enter='onEnter' type='text' class='form-control'/>"+
  "</div><ul v-show='isOpen' class='autocomplete-results'>"+
       "<li v-for='(result, i) in results' :key='i' @click='setResult(result)' class='autocomplete-result' :class='{ \"is-active\": i === arrowCounter }'>{{ result.name }}</li>"+
    "</ul></div>",
  props: ['propdef'],
  data() {
    return {
      results: [],
      isOpen: false,
      arrowCounter: -1
    }
  },
  methods: {
	filterResults() {
      this.results = this.$store.form.data.filter(item => item.name.toLowerCase().indexOf(this.$store.currentField.binding[this.propdef.name].toLowerCase()) > -1);
    },
    onChange() {
      this.filterResults();
      this.isOpen = true;
    },
    setResult(result) {
      this.$store.currentField.binding[this.propdef.name] = result.name;
      this.isOpen = false;
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.arrowCounter = -1;
        this.isOpen = false;
      }
    },
    onArrowDown() {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      this.$store.currentField.binding[this.propdef.name] = this.results[this.arrowCounter].name;
      this.arrowCounter = -1;
      this.isOpen = false;
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside);
  }
})