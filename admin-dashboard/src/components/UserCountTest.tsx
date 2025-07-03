import React, { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase';

const UserCountTest: React.FC = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [sampleUsers, setSampleUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Test user count - USING ADMIN CLIENT
        const { count, error: countError } = await supabaseAdmin
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;
        setUserCount(count);

        // Test getting sample users - USING ADMIN CLIENT
        const { data, error: dataError } = await supabaseAdmin
          .from('profiles')
          .select('id, username, email, full_name, created_at')
          .limit(10);

        if (dataError) throw dataError;
        setSampleUsers(data || []);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Testing connection...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-bold text-green-800">✅ Connection Test Results</h3>
      <p className="text-green-700">
        <strong>Total Users Found:</strong> {userCount}
      </p>
      <p className="text-green-700">
        <strong>Sample Users:</strong> {sampleUsers.length} users retrieved
      </p>
      <div className="mt-2 text-sm">
        {sampleUsers.slice(0, 5).map((user, index) => (
          <div key={user.id} className="text-green-600">
            {index + 1}. {user.full_name || user.username || 'No name'} ({user.email})
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCountTest;
