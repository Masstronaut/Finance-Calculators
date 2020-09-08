const EntryFieldTemplate = document.createElement('template');
EntryFieldTemplate.innerHTML = `
<style>
.entry-field-label,
.entry-field-input {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: normal;
    transition: all 0.3s ease-in-out;
}

.entry-field-input:hover{
    background: var(--hover-bg-color);
    border-bottom-color: var(--hover-highlight-color, #616161);
}
.entry-field-input:hover + .entry-field-label{
    transition: color 200ms linear 0s;
    color: var(--hover-highlight-color, #616161);
}

.entry-field-input:focus + .entry-field-label, .entry-field-input:not(:placeholder-shown) + .entry-field-label{
    color: var(--primary-focus-color, #00897B);
    transition: color 200ms cubic-bezier(0.0,0,0.2,1), transform 200ms cubic-bezier(0.0,0,0.2,1) 0ms;
    transform: translateY(-106%) scale(0.75);
    transform-origin: top left;
    top: 50%;
    position: absolute;
    display: block;
    padding: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.00938em;
}
.entry-field-input:not(:focus):not(:placeholder-shown) + .entry-field-label{
    color: rgba(0, 0, 0, 0.54);
    transition: color 200ms cubic-bezier(0.0,0,0.2,1), transform 200ms cubic-bezier(0.4,0,0.2,1) 0ms;
    transform-origin: top left;

    position: absolute;
    display: block;
    padding: 0;
    font-size: 1rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.00938em;
}
.entry-field-label{
    transition: color 200ms cubic-bezier(0.0,0,0.2,1) 0ms;
    transition: transform 150ms cubic-bezier(0.4,0,0.2,1) 0ms;
    top: 50%;
    left: 16px;
    position: absolute;
    overflow: hidden;
    transform: translateY(-50%) scale(1);
    display: inline-block;
    transform-origin: top left;
    color:rgba(0, 0, 0, 0.54);
    padding: 0;
    font-size: 1rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.15rem;
    letter-spacing: 0.00938em;
    pointer-events: none;
}
.entry-field-input:focus {
    outline: none;
    background: var(--focus-bg-color);
    transition: background 200ms cubic-bezier(0.4,0,0.2,1) 0ms;
}
.entry-field-container {
    position: relative;
    margin: 10px 10%;
    font-size: 16px;
    display: block !important;
    height: 56px;
}
.entry-field-input {
    display: block;
    box-sizing: border-box;
    align-self: flex-end;
    position: relative;
    border: 0;
    padding: 20px 16px 6px;
    background: var(--entry-bg-color);
    border-bottom: 1px solid var(--primary-accent-color, #9A9A9A);
    font-size: 1rem;
    width: 100%;
    height: 100%;
    border-radius: 4px 4px 0px 0px;
}


.entry-field-underline{
    position: relative;
    display:block;
    width: 100%;
}

.entry-field-underline:before, .entry-field-underline:after{
    height:2px;
    width:0;
    bottom:0px;
    position: absolute;
    background-color: var(--primary-focus-color);
    transition: 0.2s ease-in all;
    content:'';
}
.entry-field-underline:before{
    left:50%;
}
.entry-field-underline:after{
    right: 50%;
}
.entry-field-input:focus ~ .entry-field-underline:before,
.entry-field-input:focus ~ .entry-field-underline:after{
    width:50%;
}


/* hide the spinners on number fields */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button{
    -webkit-appearance: none;
    margin: 0;
}
/* firefox */
input[type="number]{
    -moz-appearance: textfield;
}

</style>
`;

class EntryField extends HTMLElement{
    constructor(){
        // Always call super first in constructor. 
        // super invokes the constructor of the base class.
        super();
        let shadow = this.attachShadow({mode:"open"});
        this.shadow = shadow;
        // Faster to clone than use innerHTML because it avoids additional HTML parse costs.
        this.shadow.appendChild(EntryFieldTemplate.content.cloneNode(true));
        
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "entry-field-container");
        if(this.hasAttribute("title")){
            wrapper.setAttribute("title", this.getAttribute("Title"));
        }
        this.wrapperElement = wrapper;

        const input = wrapper.insertAdjacentElement("beforeend",document.createElement("input"));
        input.setAttribute("type", this.hasAttribute("type") ? this.getAttribute("type") : "text");
        input.setAttribute("id", this.hasAttribute("id") ? this.getAttribute("id") : "");
        input.setAttribute("placeholder"," ");
        
        input.setAttribute("class","entry-field-input");
        this.inputElement = input;
        input.addEventListener("input", e=>{this.value= input.value});
        
        const label = wrapper.insertAdjacentElement("beforeend",document.createElement("label"));
        label.setAttribute("for","entry-field-input");
        label.classList.add("entry-field-label");
        this.labelElement = label;
        
        const underline = wrapper.insertAdjacentElement("beforeend",document.createElement('span'));
        underline.setAttribute("class", "entry-field-underline");
        this.underlineElement = underline;
        
        shadow.appendChild(wrapper); // other elements are inserted into wrapper, so don't need to be appended.
        
    }
    connectedCallback(){
        
        this.labelElement.insertAdjacentHTML("afterbegin", this.getAttribute("label"));
        if(this.hasAttribute("label")){
        }
        if(this.hasAttribute("readonly")){
            this.inputElement.setAttribute("readonly", this.getAttribute("readonly"));
        }

        if(this.hasAttribute("type")){
            this.inputElement.setAttribute("type",this.getAttribute("type"));
        } else{
            this.inputElement.setAttribute("type","text");
        }
        if(this.hasAttribute("tabindex")){
            this.inputElement.setAttribute("tabindex", this.getAttribute("tabindex"));
        }
    }
    static get observedAttributes(){
        return [];
    }
    applyStyle(){

    }
    _upgradeProperty(prop){
        if(this.hasOwnProperty(prop)){
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }
    get value(){
        return this.getAttribute("value");
    }
    set value(newValue){
        this.inputElement.setAttribute("value", newValue);
        this.setAttribute("value", newValue);
    }
    get label(){
        return this.getAttribute("label");
    }
    set label(newValue){
        this.setAttribute("label", newValue);
    }
    get type(){
        return this.getAttribute("type");
    }
    set type(newValue){
        this.inputElement.setAttribute("type", newValue);
        this.setAttribute("type", newValue);
    }
}
customElements.define('entry-field', EntryField);