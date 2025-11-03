import User from './User.model.js';
import Post from './Blog.model.js';
import PostSection from './PostSection.model.js';
import PostImage from './PostImage.model.js';
import Comment from './Comment.model.js';
import Category from './Category.model.js';
import PostLike from './PostLike.model.js';
import PostCategory from './PostCategory.model.js';


function setupAssociations() {
    // users (1) -> posts (N)
    User.hasMany(Post, { foreignKey: 'user_id' });
    Post.belongsTo(User, { foreignKey: 'user_id' });

    // posts (1) -> post_sections (N)
    Post.hasMany(PostSection, { foreignKey: 'post_id', onDelete: 'CASCADE' });
    PostSection.belongsTo(Post, { foreignKey: 'post_id' });

    // posts (1) -> post_images (N)
    Post.hasMany(PostImage, { foreignKey: 'post_id', onDelete: 'CASCADE' });
    PostImage.belongsTo(Post, { foreignKey: 'post_id' });

    // optional: post_images belongs to section
    PostSection.hasMany(PostImage, { foreignKey: 'section_id', onDelete: 'CASCADE' });
    PostImage.belongsTo(PostSection, { foreignKey: 'section_id' });

    // users (1) -> comments (N)
    User.hasMany(Comment, { foreignKey: 'user_id' });
    Comment.belongsTo(User, { foreignKey: 'user_id' });

    // posts (1) -> comments (N)
    Post.hasMany(Comment, { foreignKey: 'post_id', onDelete: 'CASCADE' });
    Comment.belongsTo(Post, { foreignKey: 'post_id' });

    // self-referential comment replies
    Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parent_id' });
    Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parent_id' });

    // likes: many-to-many via post_likes with composite key
    User.belongsToMany(Post, { through: PostLike, foreignKey: 'user_id', otherKey: 'post_id', as: 'LikedPosts' });
    Post.belongsToMany(User, { through: PostLike, foreignKey: 'post_id', otherKey: 'user_id', as: 'Likers' });

    // categories: many-to-many via post_categories
    Post.belongsToMany(Category, { through: PostCategory, foreignKey: 'post_id', otherKey: 'category_id' });
    Category.belongsToMany(Post, { through: PostCategory, foreignKey: 'category_id', otherKey: 'post_id' });
}


// No per-create hook needed; unique composite index on PostLike enforces 1 like per user/post



export default setupAssociations;