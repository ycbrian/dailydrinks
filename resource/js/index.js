// DOM base
const elements = {
    drinkForm: document.querySelector(".drink_form"),
    drinkName: document.getElementById("drink_name"),
    drinkNumber: document.getElementById("drink_number"),
    drinkNote: document.getElementById("drink_note"),
    list: document.querySelector(".list"),
};

let globId = 0;
let update = false;

// Data controller
class Beverage {
    constructor() {
        this.beverage = [];
    };

    addOrder(id, name, number, note) {
        const drinks = { id, name, number, note };
        this.beverage.push(drinks);
        this.persistData();
        return drinks;
    };

    deleteOrder(id) {
        const index = this.beverage.findIndex(el => el.id == id);
        this.beverage.splice(index, 1);
        this.persistData();
    };

    getOrder(id) {
        const index = this.beverage.findIndex(el => el.id == id);
        return this.beverage[index];
    };

    updateData(id, name, number, note){
        const index = this.beverage.findIndex(el => el.id == id);
        this.beverage[index].name=name;
        this.beverage[index].number=number;
        this.beverage[index].note=note;
        this.persistData();
    }

    persistData() {
        localStorage.setItem('beverage', JSON.stringify(this.beverage));
    }

    readsStorage() {
        const storage = JSON.parse(localStorage.getItem('beverage'));

        // Restoring likes from the localStorage
        if (storage) this.beverage = storage;
    }
};


// UI controller
class UIController {
    constructor() {};

    getInput() {
        if(!update) ++globId;
        return {
            id: globId,
            name: elements.drinkName.value,
            number: elements.drinkNumber.value,
            note: elements.drinkNote.value
        }
    };

    clearInput() {
        elements.drinkName.value = '';
        elements.drinkNumber.value = '';
        elements.drinkNote.value = '';
    };

    EditInput(item) {
        elements.drinkName.value = item.name;
        elements.drinkNumber.value = item.number;
        elements.drinkNote.value = item.note;
    }

    renderOrders(item) {
        
        let id;
        if(!update) id = item.id;
        else id = updateID;
        
        const markup = `
        <div class="list_all" data-itemid=${id}>
            <div class="item_head">
                <i class="far fa-trash-alt"></i>
                <p>${item.name}<span><i class="fas fa-times"></i>${item.number}</span></p>
                <button class="list_edit">Edit</button>
            </div>
            <div class="clearfix"></div>
            <p class="list_note">${item.note}</p>
        </div>
        `;

        elements.list.insertAdjacentHTML('beforeend', markup);

    };

    deleteItem(id){
        const item = document.querySelector(`[data-itemid="${id}"]`);
        item.parentElement.removeChild(item);
    }

};



// Global app controller
const list = new Beverage();
const Uicontrol = new UIController();
let updateID;

const OrderControl = () => {
    // get input from UI
    const newOrder = Uicontrol.getInput();
    // clear input
    Uicontrol.clearInput();
    // create new item data
    list.addOrder(newOrder.id, newOrder.name, newOrder.number, newOrder.note);
    // UI update
    Uicontrol.renderOrders(newOrder);
};

const EditControl = () => {
    // get input from UI
    const updateOrder = Uicontrol.getInput();
    // clear input
    Uicontrol.clearInput();
    // update data in storage
    list.updateData(updateID,updateOrder.name,updateOrder.number, updateOrder.note);
    // delete old Data
    Uicontrol.deleteItem(updateID);
    // UI update
    Uicontrol.renderOrders(updateOrder);
}

elements.list.addEventListener('click', e => {
    const id = e.target.closest('.list_all').dataset.itemid;
    if (e.target.matches('.list_all, .fa-trash-alt')) {
        // Delete in data
        list.deleteOrder(id);
        // Delete from UI
        Uicontrol.deleteItem(id);
    }else if(e.target.matches('.list_all, .list_edit')){
        // edit update
        update=true;
        // Get edit data
        const item=list.getOrder(id);
        updateID=item.id;
        // Edit input
        Uicontrol.EditInput(item);
    }
});

elements.drinkForm.addEventListener('submit', e=>{
    e.preventDefault();
    // check if this submit is data update or not
    if(!update) OrderControl();
    else{
        EditControl();
        update=false;
    }
});

window.addEventListener('load',()=>{
    // Restore storage
    list.readsStorage();
    // Render the existing beverage
    list.beverage.forEach(item=>Uicontrol.renderOrders(item));
})
