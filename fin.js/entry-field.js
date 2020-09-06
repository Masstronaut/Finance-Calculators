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
    
    border-bottom-color: #616161;
}
.entry-field-container{
    display: block !important;
}

.entry-field-input:focus + .entry-field-label, .entry-field-input:not(:placeholder-shown) + .entry-field-label{
    color: #00897B;
    transition: color 200ms cubic-bezier(0.0,0,0.2,1), transform 200ms cubic-bezier(0.0,0,0.2,1) 0ms;
    transform: translate(0, 1.5px) scale(0.75);
    transform-origin: top left;
    top: 0;
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
    transition: color 200ms cubic-bezier(0.0,0,0.2,1), transform 200ms cubic-bezier(0.0,0,0.2,1) 0ms;
    transform: translate(0, 1.5px) scale(0.75);
    transform-origin: top left;
    top: 0;
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
    transition: color 200ms cubic-bezier(0.0,0,0.2,1) 0ms,transform 200ms cubic-bezier(0.0,0,0.2,1) 0ms;
    top: 0;
    left: 2%;
    position: absolute;
    transform: translate(0, 100%) scale(1);
    display: inline-block;
    transform-origin: top left;
    color:rgba(0, 0, 0, 0.54);
    padding: 0;
    font-size: 1rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.00938em;
    pointer-events: none;
}
.entry-field-input:focus {
    outline: none;
}
.entry-field-container {
    position: relative;
    margin: 10px 10%;
    font-size: 16px;
}
.entry-field-input {
    border: 0;
    padding: 13px 0 2px 2%;
    border-bottom: 2px solid #cccccc;
    font-size: 16px;
    width: 100%;
    border-radius: 3px;
}

.entry-field-input~.entry-field-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #00897B;
    transition: 0.2s width ease-in-out;
}

.entry-field-input:focus~.entry-field-underline {
    width: 100%;
    transition: 0.35s width ease-in-out;
}

</style>
`;

class EntryField extends HTMLElement{
    constructor(){
        // Always call super first in constructor
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