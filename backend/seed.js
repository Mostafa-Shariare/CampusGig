const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./model/user');
const Gig = require('./model/gigs');
const Post = require('./model/post');

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DBURL || 'mongodb://localhost:27017/campusgig');
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Gig.deleteMany({});
        await Post.deleteMany({});
        console.log('Cleared existing data');

        // Create demo users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = await User.create([
            {
                username: 'john_doe',
                email: 'john@example.com',
                password: hashedPassword,
                bio: 'Full-stack developer and tech enthusiast. Love building web apps!',
                avatar: 'https://i.pravatar.cc/150?img=12',
            },
            {
                username: 'sarah_designer',
                email: 'sarah@example.com',
                password: hashedPassword,
                bio: 'UI/UX Designer with 3 years of experience. Passionate about creating beautiful interfaces.',
                avatar: 'https://i.pravatar.cc/150?img=5',
            },
            {
                username: 'mike_writer',
                email: 'mike@example.com',
                password: hashedPassword,
                bio: 'Content writer and blogger. Specializing in tech and lifestyle articles.',
                avatar: 'https://i.pravatar.cc/150?img=33',
            },
            {
                username: 'emma_marketing',
                email: 'emma@example.com',
                password: hashedPassword,
                bio: 'Digital marketing specialist. Helping businesses grow online.',
                avatar: 'https://i.pravatar.cc/150?img=9',
            },
            {
                username: 'alex_coder',
                email: 'alex@example.com',
                password: hashedPassword,
                bio: 'Computer Science student. Python and JavaScript developer.',
                avatar: 'https://i.pravatar.cc/150?img=15',
            }
        ]);

        console.log(`Created ${users.length} users`);

        // Create demo gigs
        const gigs = await Gig.create([
            {
                title: 'Build a Responsive Website',
                description: 'I will create a modern, responsive website using React and Tailwind CSS. Perfect for portfolios, landing pages, or small business sites.',
                category: 'Tech',
                price: 150,
                image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=500',
                postedBy: users[0]._id
            },
            {
                title: 'Design Your App UI/UX',
                description: 'Professional UI/UX design for mobile and web applications. Includes wireframes, mockups, and prototypes in Figma.',
                category: 'Design',
                price: 200,
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
                postedBy: users[1]._id
            },
            {
                title: 'Write SEO Blog Articles',
                description: 'High-quality, SEO-optimized blog posts and articles. 1000+ words, well-researched content for your website or blog.',
                category: 'Writing',
                price: 50,
                image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500',
                postedBy: users[2]._id
            },
            {
                title: 'Social Media Marketing Package',
                description: 'Complete social media management for one month. Includes content creation, posting schedule, and engagement strategies.',
                category: 'Marketing',
                price: 300,
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500',
                postedBy: users[3]._id
            },
            {
                title: 'Python Automation Scripts',
                description: 'Custom Python scripts for automation tasks. Web scraping, data processing, file management, and more.',
                category: 'Tech',
                price: 100,
                image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500',
                postedBy: users[4]._id
            },
            {
                title: 'Logo Design Package',
                description: 'Professional logo design with 3 concepts and unlimited revisions. Includes source files and brand guidelines.',
                category: 'Design',
                price: 120,
                image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500',
                postedBy: users[1]._id
            },
            {
                title: 'Mobile App Development',
                description: 'Cross-platform mobile app development using React Native. iOS and Android compatible.',
                category: 'Tech',
                price: 500,
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
                postedBy: users[0]._id
            },
            {
                title: 'Content Writing for Websites',
                description: 'Engaging website copy that converts. About pages, service descriptions, and landing page content.',
                category: 'Writing',
                price: 75,
                image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500',
                postedBy: users[2]._id
            }
        ]);

        console.log(`Created ${gigs.length} gigs`);

        // Create demo posts
        const posts = await Post.create([
            {
                title: 'Just launched my new portfolio website!',
                description: 'After weeks of hard work, my portfolio is finally live! Built with React and Three.js for some cool 3D effects. Check it out and let me know what you think!',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
                postedBy: users[0]._id
            },
            {
                title: 'Tips for Creating Better UI Designs',
                description: 'Here are my top 5 tips for creating user-friendly interfaces: 1) Keep it simple, 2) Use consistent spacing, 3) Choose readable fonts, 4) Maintain visual hierarchy, 5) Test with real users!',
                image: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=500',
                postedBy: users[1]._id
            },
            {
                title: 'Looking for collaboration on a startup idea',
                description: 'I have an exciting startup idea in the EdTech space and looking for a technical co-founder. If you\'re interested in education and technology, let\'s connect!',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500',
                postedBy: users[3]._id
            },
            {
                title: 'Free Python Tutorial Series',
                description: 'Starting a free Python tutorial series for beginners! Will cover basics to advanced topics. First video drops next week. Who\'s interested?',
                image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500',
                postedBy: users[4]._id
            },
            {
                title: 'Completed my first freelance project!',
                description: 'Just finished my first freelance writing project through CampusGig! The client was amazing and the experience was great. Excited for more opportunities!',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500',
                postedBy: users[2]._id
            }
        ]);

        console.log(`Created ${posts.length} posts`);

        // Add some followers/following relationships
        users[0].followers.push(users[1]._id, users[2]._id, users[4]._id);
        users[0].following.push(users[1]._id, users[3]._id);
        users[1].followers.push(users[0]._id, users[3]._id);
        users[1].following.push(users[0]._id, users[2]._id);

        await Promise.all(users.map(user => user.save()));
        console.log('Updated user relationships');

        console.log('\n✅ Database seeded successfully!');
        console.log('\nDemo Users (all with password: password123):');
        users.forEach(user => {
            console.log(`- ${user.email} (${user.username})`);
        });

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
