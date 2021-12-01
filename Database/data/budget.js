const mongoCollections = require('../config/mongoCollections');
const budgetCollection = mongoCollections.budget;
const users = require('./users');
const categories = require('./category');
let { ObjectId } = require('mongodb');

// async function create(name, amt, budgetType){
//     const budget_collection = await budgetCollection();

//     let newBudget = { 
//         name: name,
//         amt: amt,
//         budgetType: budgetType
//     }; 

//     const insertinfo = await budget_collection.insertOne(newBudget)
//     const newId = insertinfo.insertedId;
//     const new_budget = await budget_collection.findOne({ _id: newId });
//     const newObjId = ObjectId(new_budget._id); 
//     let x = new_budget._id
//     x = newObjId.toString(); 
//     new_budget._id=x;

//     return(new_budget)
// }

// async function getAll(){
//     let list = [];
//     const budget_Collection = await budgetCollection();
//     const budgetList = await budget_Collection.find({}).toArray();

//     for(let i=0; i<budgetList.length; i++){
//         let x = budgetList[i]._id
//         let y=x.toString();
//         budgetList[i]._id = y;
//     }

//     for(let i=0;i<budgetList.length;i++){
//         let ls = {"budget name": budgetList[i].name, "Amt": budgetList[i].amt, "budget_Type": budgetList[i].budgetType};
//         list.push(ls);
//     }
//     return list;
// }

// module.exports = {
//     create,
//     getAll
// }


let exportedMethods = {
    async get(id){
        if (!id) throw 'You must provide an id to search for';
        if (typeof id != 'string') throw "the id must be a string";
        if (id.trim().length === 0) throw "the id is empty spaces";

        let parsedId = ObjectId(id);
        if (!parsedId) throw "cannot parse id";

        const budgetCollection = await budget();
        let budget = await budgetCollection.findOne({_id:parsedId});
        if (budget === null) throw 'No such budget';

        return budget;
    },
    async create(username,budgetname,amount,category,type){
        const budgetCollection = await budget();
        let newBudget = {
            username:username,
            budgetname:budgetname,
            amount:amount,
            category:category,
            type:type
        }
        let insertInfo = await budgetCollection.insertOne(newBudget);
        await users.addBudgetToUser(username,budgetname,amount,category,type);
        await categories.addBudgetToCategory(category,budgetname,amount,type);
        let newId = insertInfo.insertedId;
        let new_budget = await budgetCollection.findOne({_id:newId});
        return new_budget;
    },
    async update(id,updateBudget) {
        let parsedId = ObjectId(id);
        if (!parsedId) throw "cannot parse id";

        const budgetCollection = await budget();
        const updateBudgetInfo = {
            username: updateBudget.username,
            budgetname: updateBudget.budgetname,
            amount: updateBudget.amount,
            category: updateBudget.category,
            type: updateBudget.type
        }

        const updateInfo = await budgetCollection.updateOne(
            {id: parsedId},
            {$set: updateBudgetInfo}
        )
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update restaurant successfully';
        }

        return await this.get(id);
    },
    async delete(id){
        if (!id) throw 'You must provide an id to search for';
        if (typeof id != 'string') throw "the id must be a string";
        if (id.trim().length === 0) throw "the id is empty spaces";

        let parsedId = ObjectId(id);
        if (!parsedId) throw "cannot parse id";

        const budgetCollection = await budget();
        let deleteInfo = await budgetCollection.deleteOne({_id:parsedId});
        if (deleteInfo.deletedCount === 0) throw 'Cannot delete this budget';

        return { deleted: true };
    }
}

module.exports = exportedMethods;