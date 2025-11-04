import SiteVisit from '../models/SiteVisit.model.js';
import Post from '../models/Blog.model.js';
import sequelize from '../database/db.js';
import { Op } from 'sequelize';

// Track a site visit
export const trackVisit = async (req, res) => {
    try {
        const { page, referrer } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('user-agent');

        await SiteVisit.create({
            ipAddress,
            userAgent,
            page,
            referrer,
            visitDate: new Date()
        });

        res.status(201).json({ message: 'Visit tracked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Increment post view count
export const incrementPostView = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.increment('viewCount');
        
        res.json({ message: 'View count incremented', viewCount: post.viewCount + 1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get site analytics stats
export const getSiteStats = async (req, res) => {
    try {
        // Total visits
        const totalVisits = await SiteVisit.count();

        // Visits today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const visitsToday = await SiteVisit.count({
            where: {
                createdAt: {
                    [Op.gte]: today
                }
            }
        });

        // Visits this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const visitsThisWeek = await SiteVisit.count({
            where: {
                createdAt: {
                    [Op.gte]: weekAgo
                }
            }
        });

        // Visits this month
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const visitsThisMonth = await SiteVisit.count({
            where: {
                createdAt: {
                    [Op.gte]: monthAgo
                }
            }
        });

        // Total post views
        const totalPostViews = await Post.sum('viewCount') || 0;

        // Most viewed posts
        const mostViewedPosts = await Post.findAll({
            where: { status: 'published' },
            order: [['viewCount', 'DESC']],
            limit: 10,
            attributes: ['id', 'title', 'viewCount', 'createdAt']
        });

        // Visits by day (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const visitsByDay = await SiteVisit.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('visit_date')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                visitDate: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('visit_date'))],
            order: [[sequelize.fn('DATE', sequelize.col('visit_date')), 'ASC']],
            raw: true
        });

        // Unique visitors (by IP) today
        const uniqueVisitorsToday = await SiteVisit.count({
            distinct: true,
            col: 'ipAddress',
            where: {
                createdAt: {
                    [Op.gte]: today
                }
            }
        });

        res.json({
            totalVisits,
            visitsToday,
            visitsThisWeek,
            visitsThisMonth,
            uniqueVisitorsToday,
            totalPostViews,
            mostViewedPosts,
            visitsByDay
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get top pages
export const getTopPages = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const topPages = await SiteVisit.findAll({
            attributes: [
                'page',
                [sequelize.fn('COUNT', sequelize.col('id')), 'visitCount']
            ],
            where: {
                page: {
                    [Op.ne]: null
                }
            },
            group: ['page'],
            order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
            limit,
            raw: true
        });

        res.json(topPages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

