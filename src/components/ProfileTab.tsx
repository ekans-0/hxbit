import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useSocialProfile } from '../hooks/useSocialProfile';
import { useSocialFeed } from '../hooks/useSocialFeed';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useUserStats } from '../hooks/useUserStats';
import { 
  User, 
  Settings, 
  Users, 
  Trophy, 
  MessageSquare,
  UserPlus,
  Crown,
  Star,
  Zap,
  Target,
  Award,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  Search,
  Heart,
  Share2,
  MoreHorizontal,
  Camera,
  UserCheck,
  UserMinus,
  Upload
} from 'lucide-react';

interface ProfileTabProps {
  userId: string;
}

export function ProfileTab({ userId }: ProfileTabProps) {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile(userId);
  const { 
    currentProfile, 
    searchUsers, 
    followUser, 
    unfollowUser, 
    uploadProfilePicture,
    getFollowers,
    getFollowing 
  } = useSocialProfile(userId);
  const { posts, createPost, likePost, unlikePost, shareAchievement } = useSocialFeed(userId);
  const { globalLeaderboard, friendsLeaderboard, userRank } = useLeaderboard(userId);
  const { userStats } = useUserStats(userId);

  const [activeTab, setActiveTab] = useState<'profile' | 'discover' | 'feed' | 'leaderboard'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    privacy_level: profile?.privacy_level || 'public',
    show_stats: profile?.show_stats || true,
    show_achievements: profile?.show_achievements || true,
    show_activities: profile?.show_activities || true,
  });
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    }
  };

  const handleCreatePost = async () => {
    if (newPost.trim()) {
      await createPost(newPost);
      setNewPost('');
    }
  };

  const handleLikeToggle = async (post: any) => {
    if (post.is_liked && post.user_like_id) {
      await unlikePost(post.id, post.user_like_id);
    } else {
      await likePost(post.id);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadProfilePicture(file);
    }
  };

  const handleFollowToggle = async (targetUser: any) => {
    if (targetUser.is_following) {
      await unfollowUser(targetUser.username);
    } else {
      await followUser(targetUser.username);
    }
    // Refresh search results
    if (searchQuery.trim()) {
      await handleSearch();
    }
  };

  const loadFollowers = async () => {
    const followersList = await getFollowers(userId);
    setFollowers(followersList);
    setShowFollowers(true);
  };

  const loadFollowing = async () => {
    const followingList = await getFollowing(userId);
    setFollowing(followingList);
    setShowFollowing(true);
  };

  const totalStats = userStats ? Object.entries(userStats)
    .filter(([key]) => !['id', 'user_id', 'stat_points', 'created_at', 'updated_at'].includes(key))
    .reduce((sum, [, value]) => sum + (value as number), 0) : 0;

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                  {profile?.profile_picture_url ? (
                    <img 
                      src={profile.profile_picture_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {profile?.display_name || user?.username}
                </h1>
                <p className="text-blue-100 text-lg">@{user?.username}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-300 mr-1" />
                    <span className="font-semibold">Level {user?.level}</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-yellow-300 mr-1" />
                    <span>{user?.total_xp?.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {profile?.bio && (
            <p className="text-blue-100 text-lg mb-4">{profile.bio}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={loadFollowers} className="text-center hover:bg-white/10 rounded-lg p-2 transition-colors">
              <p className="text-2xl font-bold">{profile?.followers_count || 0}</p>
              <p className="text-blue-100 text-sm">Followers</p>
            </button>
            <button onClick={loadFollowing} className="text-center hover:bg-white/10 rounded-lg p-2 transition-colors">
              <p className="text-2xl font-bold">{profile?.following_count || 0}</p>
              <p className="text-blue-100 text-sm">Following</p>
            </button>
            <div className="text-center">
              <p className="text-2xl font-bold">{totalStats}</p>
              <p className="text-blue-100 text-sm">Total Stats</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">#{userRank?.xp_rank || '?'}</p>
              <p className="text-blue-100 text-sm">Global Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={editForm.display_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                placeholder="Your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                placeholder="Your location"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                value={editForm.website}
                onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                placeholder="https://your-website.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Privacy Level
              </label>
              <select
                value={editForm.privacy_level}
                onChange={(e) => setEditForm(prev => ({ ...prev, privacy_level: e.target.value as any }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="public">Public</option>
                <option value="friends">Followers Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSaveProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderDiscoverTab = () => (
    <div className="space-y-8">
      {/* User Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Discover Players</h2>
        <div className="flex space-x-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by username or display name..."
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            {searchResults.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                    {user.profile?.profile_picture_url ? (
                      <img 
                        src={user.profile.profile_picture_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.profile?.display_name || user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Level {user.level}</span>
                      <span>{user.total_xp?.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleFollowToggle(user)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    user.is_following
                      ? 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {user.is_following ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFeedTab = () => (
    <div className="space-y-8">
      {/* Create Post */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Share an Update</h2>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <button
              onClick={() => shareAchievement('level_up', { level: user?.level })}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Share Level Up
            </button>
            <button
              onClick={() => shareAchievement('xp_milestone', { xp: user?.total_xp })}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Share XP Milestone
            </button>
          </div>
          <button
            onClick={handleCreatePost}
            disabled={!newPost.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Post
          </button>
        </div>
      </div>

      {/* Social Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                    {post.user.profile?.profile_picture_url ? (
                      <img 
                        src={post.user.profile.profile_picture_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {post.user.profile?.display_name || post.user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-900 dark:text-white mb-4">{post.content}</p>

              {post.post_type === 'achievement' && (
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <span className="text-yellow-800 dark:text-yellow-200 font-medium">Achievement Unlocked!</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => handleLikeToggle(post)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    post.is_liked 
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                  <span>{post.likes_count}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderLeaderboardTab = () => (
    <div className="space-y-8">
      {/* User Rank Card */}
      {userRank && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Global Ranking</h2>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">#{userRank.xp_rank}</p>
                  <p className="text-yellow-100">XP Rank</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">#{userRank.level_rank}</p>
                  <p className="text-yellow-100">Level Rank</p>
                </div>
              </div>
            </div>
            <Crown className="w-16 h-16 text-yellow-200" />
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
        <div className="border-b border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Global Leaderboard</h2>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {globalLeaderboard.slice(0, 10).map((entry, index) => (
              <div key={entry.id} className={`flex items-center justify-between p-4 rounded-lg ${
                entry.id === userId ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-slate-700'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                    {entry.avatar_url ? (
                      <img 
                        src={entry.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {entry.display_name || entry.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Level {entry.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{entry.total_xp.toLocaleString()} XP</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{entry.completed_tasks} tasks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Followers/Following Modals
  const renderFollowersModal = () => (
    showFollowers && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Followers</h3>
            <button onClick={() => setShowFollowers(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-96">
            {followers.map((follower) => (
              <div key={follower.id} className="flex items-center space-x-3 py-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {follower.profile?.profile_picture_url ? (
                    <img 
                      src={follower.profile.profile_picture_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {follower.profile?.display_name || follower.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@{follower.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );

  const renderFollowingModal = () => (
    showFollowing && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Following</h3>
            <button onClick={() => setShowFollowing(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-96">
            {following.map((followedUser) => (
              <div key={followedUser.id} className="flex items-center space-x-3 py-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {followedUser.profile?.profile_picture_url ? (
                    <img 
                      src={followedUser.profile.profile_picture_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {followedUser.profile?.display_name || followedUser.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@{followedUser.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile & Social
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile, connect with players, and share your achievements
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
        <div className="flex space-x-8 px-6 border-b border-gray-200 dark:border-slate-700">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'discover', label: 'Discover', icon: Search },
            { id: 'feed', label: 'Social Feed', icon: MessageSquare },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 border-b-2 font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'discover' && renderDiscoverTab()}
          {activeTab === 'feed' && renderFeedTab()}
          {activeTab === 'leaderboard' && renderLeaderboardTab()}
        </div>
      </div>

      {/* Modals */}
      {renderFollowersModal()}
      {renderFollowingModal()}
    </div>
  );
}