import User from './User.model.js';
import Tutorial from './Tutorial.model.js';
import Step from './Step.model.js';
import Category from './Category.model.js';
import Comment from './Comment.model.js';
import Reaction from './Reaction.model.js';


function setupAssociations() {
    // User - Tutorial (1:N)
    User.hasMany(Tutorial);
    Tutorial.belongsTo(User);

    // Category - Tutorial (1:N)
    Category.hasMany(Tutorial);
    Tutorial.belongsTo(Category);

    // Tutorial - Step (1:N)
    Tutorial.hasMany(Step, { onDelete: 'CASCADE' });
    Step.belongsTo(Tutorial);

    // User - Comment (1:N)
    User.hasMany(Comment);
    Comment.belongsTo(User);

    // Tutorial - Comment (1:N)
    Tutorial.hasMany(Comment);
    Comment.belongsTo(Tutorial);

    // Comment - Comment (Self-referential for replies)
    Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parentId' });
    Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parentId' });

    // User - Reaction (1:N)
    User.hasMany(Reaction);
    Reaction.belongsTo(User);

    // Tutorial - Reaction (1:N)
    Tutorial.hasMany(Reaction);
    Reaction.belongsTo(Tutorial);
}


// Unique constraint to prevent multiple reactions from same user on same tutorial
Reaction.addHook('beforeCreate', async (reaction) => {
    const existingReaction = await Reaction.findOne({
        where: {
            userId: reaction.userId,
            tutorialId: reaction.tutorialId
        }
    });
    if (existingReaction) {
        throw new Error('User has already reacted to this tutorial');
    }
});



export default setupAssociations;