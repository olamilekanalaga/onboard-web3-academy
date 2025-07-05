import { supabase } from '@/integrations/supabase/client';

/**
 * Fix generic notification messages to show actual usernames
 */
export const fixGenericNotifications = async () => {
  try {
    console.log('🔧 Starting notification fix...');

    // Get all generic follow notifications
    const { data: genericNotifications, error: fetchError } = await supabase
      .from('notifications')
      .select('id, user_id, message, data, type')
      .eq('type', 'follow')
      .or('message.eq.Someone started following you!,message.eq.Someone just followed you!');

    if (fetchError) {
      console.error('Error fetching notifications:', fetchError);
      return;
    }

    if (!genericNotifications || genericNotifications.length === 0) {
      console.log('✅ No generic notifications found to fix');
      return;
    }

    console.log(`📝 Found ${genericNotifications.length} generic notifications to fix`);

    // Process each notification
    for (const notification of genericNotifications) {
      const followerId = notification.data?.follower_id;
      
      if (!followerId) {
        console.log(`⚠️ Skipping notification ${notification.id} - no follower_id`);
        continue;
      }

      // Get follower's profile
      const { data: followerProfile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', followerId)
        .single();

      if (profileError || !followerProfile) {
        console.log(`⚠️ Could not find profile for follower ${followerId}`);
        continue;
      }

      // Create personalized message
      const displayName = followerProfile.full_name || followerProfile.username || 'Someone';
      const newMessage = `${displayName} just followed you!`;

      // Update the notification
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ message: newMessage })
        .eq('id', notification.id);

      if (updateError) {
        console.error(`❌ Error updating notification ${notification.id}:`, updateError);
      } else {
        console.log(`✅ Updated notification: "${newMessage}"`);
      }
    }

    console.log('🎉 Notification fix completed!');
  } catch (error) {
    console.error('❌ Error in fixGenericNotifications:', error);
  }
};

/**
 * Fix all types of generic notifications (can be extended for other notification types)
 */
export const fixAllGenericNotifications = async () => {
  try {
    // Fix follow notifications
    await fixGenericNotifications();
    
    // Can add other notification types here in the future
    // await fixGenericLikeNotifications();
    // await fixGenericCommentNotifications();
    
    console.log('🎉 All notification fixes completed!');
  } catch (error) {
    console.error('❌ Error in fixAllGenericNotifications:', error);
  }
};
