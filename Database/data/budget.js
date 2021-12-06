const mongoCollections = require('../config/mongoCollections');
const budgetCollection = mongoCollections.budget;
const users = require('./users');
const categories = require('./category');
let { ObjectId } = require('mongodb');

let exportedMethods = {
    async get(id){
        if (!id) throw 'You must provide an id to search for';
        if (typeof id != 'string') throw "the id must be a string";
        if (id.trim().length === 0) throw "the id is empty spaces";

        let parsedId = ObjectId(id);
        if (!parsedId) throw "cannot parse id";

        const budget_collection = await budgetCollection();
        let budget = await budget_collection.findOne({_id:parsedId});
        if (budget === null) throw 'No such budget';

        return budget;
    },
    async create(userid,budgetname,amount,category,wallet,type){
        // userid error checking for object id
        if (!budgetname) throw 'You must provide a name for your budget';
        if (!amount ) throw 'You must provide amount';
        if (!category ) throw 'You must provide category for your budget';
        if (!type ) throw 'You must provide what type of budget you want to create';

        if (typeof budgetname !== 'string') throw 'Name is invalid';
        if (typeof amount !== 'string') throw 'Amount is invalid';
        if (typeof category !== 'string') throw 'Category is invalid'
        if (typeof type !== 'string') throw 'Type of budget is invalid'

        if(!budgetname.trim()){
            throw "Budget contains white spaces"
        }
        budgetname = budgetname.trim();

        if(!amount.trim()){
            throw "Amount contains white spaces"
        }
        amount = amount.trim();

        if(!category.trim()){
            throw "Category contains white spaces"
        }
        type = type.trim();

        if(!type.trim()){
            throw "Type contains white spaces"
        }
        type = type.trim();

        const budget_collection = await budgetCollection();
        let newBudget = {
            user:new ObjectId(userid),
            budgetname:budgetname,
            amount:amount,
            category:category,
            wallet:wallet,
            type:type
        }
        let insertInfo = await budget_collection.insertOne(newBudget);
        let newId = insertInfo.insertedId;
        let new_budget = await budget_collection.findOne({_id:newId});
        const newObjId = ObjectId(new_budget._id); 
        let x = new_budget._id
        x = newObjId.toString();
        new_budget._id=x;
        return(new_budget);
    },


    async getBudgetByUserId(userid) {
        //TODO: error check for userid error checking for object id
        if (!userid) throw 'You must provide an userid';
        if (typeof userid != 'string') throw "the userid must be a string";
        if (userid.trim().length === 0) throw "the userid is empty spaces";
        userid = userid.trim();

        const budget_collection = await budgetCollection();
        const budgetList = await budget_collection.find({user:ObjectId(userid)}).toArray();
        return budgetList;
    },

    async update(id,userid,budgetInfo) {

        if (!id) throw 'You must provide an id';
        if (typeof id != 'string') throw "the id must be a string";
        if (id.trim().length === 0) throw "the id is empty spaces";
        id = id.trim();

        const budget_collection = await budgetCollection();
        const updateBudgetInfo = {
            budgetname: budgetInfo.budgetname,
            amount: budgetInfo.amount,
            category: budgetInfo.category,
            wallet:budgetInfo.wallet,
            type: budgetInfo.type
        }

        const updatedInfo = await budget_collection.updateOne(
            {_id:ObjectId(id),user:ObjectId(userid)},
            {$set: updateBudgetInfo}
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update budget successfully';
        }

        let newBudget = await budget_collection.findOne({user:ObjectId(userid),_id:ObjectId(id)});
        return newBudget;
    },


    async delete(budgetid,userid){
        // userid error checking for object id
        if (!budgetid) throw 'You must provide a budgetid';
        if (typeof budgetid != 'string') throw "the userid must be a string";
        if (budgetid.trim().length === 0) throw "the userid is empty spaces";
        budgetid = budgetid.trim();

        if (!userid) throw 'You must provide an userid';
        if (typeof userid != 'string') throw "the userid must be a string";
        if (userid.trim().length === 0) throw "the userid is empty spaces";
        userid = userid.trim();

        const budget_collection = await budgetCollection();
        let budget = await budget_collection.findOne({user:ObjectId(userid),_id:ObjectId(budgetid)});
        if(budget == null) throw 'Budget does not exist';
        let deleteInfo = await budget_collection.deleteOne({user:ObjectId(userid),_id:ObjectId(budgetid)});
        if (deleteInfo.deletedCount === 0) throw 'Cannot delete this budget';

        return { deleted: true };
    }
}

module.exports = exportedMethods;