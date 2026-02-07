# Demo Data Reference

## 🎭 Test Users

All users have the password: **password123**

| Email | Username | Role/Bio |
|-------|----------|----------|
| john@example.com | john_doe | Full-stack developer |
| sarah@example.com | sarah_designer | UI/UX Designer |
| mike@example.com | mike_writer | Content writer |
| emma@example.com | emma_marketing | Digital marketing specialist |
| alex@example.com | alex_coder | Computer Science student |

## 📦 Demo Content

- **8 Gigs** across different categories (Tech, Design, Writing, Marketing)
- **5 Posts** in the community feed
- **User relationships** (followers/following)

## 🧪 Testing Scenarios

1. **Login as any user** with password: `password123`
2. **Browse gigs** - See 8 demo gigs with images
3. **View feed** - See 5 community posts
4. **View profiles** - Users have avatars and bios
5. **Create new content** - Add your own gigs/posts

## 🔄 Re-seed Database

To reset the database with fresh demo data:
```bash
cd backend
node seed.js
```

This will clear all existing data and create fresh demo content.
