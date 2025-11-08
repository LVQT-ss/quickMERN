export function createPostUrl(post) {
    if (!post || !post.id) return '/posts';

    // Tạo slug từ title
    const titleSlug = (post.title || 'post')
        .toLowerCase()
        .normalize('NFD') // Xử lý tiếng Việt
        .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-') // Thay ký tự đặc biệt bằng -
        .replace(/^-+|-+$/g, '') // Bỏ - đầu cuối
        .slice(0, 50); // Giới hạn 50 ký tự

    // Lấy category từ post object (Categories array hoặc category field)
    let category = 'blog'; // default
    if (post.Categories && post.Categories.length > 0) {
        category = post.Categories[0].name || post.Categories[0].slug || 'blog';
    } else if (post.category_name) {
        category = post.category_name;
    } else if (post.category_slug) {
        category = post.category_slug;
    }

    // Tạo slug cho category
    const categorySlug = category
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `/${categorySlug}/${post.id}-${titleSlug}`;
}

export function extractIdFromUrl(param) {
    if (!param) return null;

    // Lấy phần ID từ "24-tieu-de-bai-viet" hoặc chỉ "24"
    const idStr = param.split('-')[0];
    const id = parseInt(idStr, 10);

    // Validate ID
    if (isNaN(id) || id <= 0) {
        return null;
    }

    return id;
}