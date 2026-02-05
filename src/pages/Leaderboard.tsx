import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useXPLeaderboard, useBadgeLeaderboard } from '@/hooks/useLeaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Zap, Award, Crown, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-300 drop-shadow-[0_0_6px_rgba(209,213,219,0.5)]" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600 drop-shadow-[0_0_6px_rgba(217,119,6,0.5)]" />;
    default:
      return <span className="text-muted-foreground font-mono text-sm">#{rank}</span>;
  }
};

const getRankBackground = (rank: number, isCurrentUser: boolean) => {
  if (isCurrentUser) {
    return 'bg-primary/20 border-primary/50';
  }
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/10 to-gray-300/10 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-600/30';
    default:
      return 'bg-card/50 border-border/50';
  }
};

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalXp: number;
  badgeCount: number;
  level: number;
}

function LeaderboardRow({ 
  entry, 
  rank, 
  isCurrentUser,
  primaryStat,
  primaryLabel,
  primaryIcon: PrimaryIcon,
}: { 
  entry: LeaderboardEntry; 
  rank: number; 
  isCurrentUser: boolean;
  primaryStat: number | string;
  primaryLabel: string;
  primaryIcon: React.ElementType;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border transition-all duration-300',
        'hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]',
        getRankBackground(rank, isCurrentUser)
      )}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-10">
        {getRankIcon(rank)}
      </div>

      {/* Avatar */}
      <Avatar className="h-12 w-12 border-2 border-primary/30">
        <AvatarImage src={entry.avatarUrl || undefined} />
        <AvatarFallback className="bg-primary/20 text-primary font-display">
          {entry.displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Name & Level */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-medium truncate',
            isCurrentUser && 'text-primary'
          )}>
            {entry.displayName}
          </span>
          {isCurrentUser && (
            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
              You
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-3">
          <span>Level {entry.level}</span>
          <span className="text-primary/60">•</span>
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {entry.badgeCount} badges
          </span>
        </div>
      </div>

      {/* Primary Stat */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50">
        <PrimaryIcon className="h-5 w-5 text-primary" />
        <div className="text-right">
          <div className="font-bold text-lg text-foreground">{primaryStat}</div>
          <div className="text-xs text-muted-foreground">{primaryLabel}</div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border bg-card/50">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-14 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function EmptyLeaderboard({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Trophy className="h-16 w-16 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground">{message}</h3>
      <p className="text-sm text-muted-foreground/70 mt-1">
        Start learning to appear on the leaderboard!
      </p>
    </div>
  );
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('xp');
  const { user } = useAuth();

  const { data: xpLeaderboard, isLoading: xpLoading } = useXPLeaderboard(20);
  const { data: badgeLeaderboard, isLoading: badgeLoading } = useBadgeLeaderboard(20);

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-10 w-10 text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]" />
        </div>
        <h1 className="text-4xl font-display font-bold tracking-wider">
          <span className="text-gradient">LEADER</span>
          <span className="text-foreground">BOARD</span>
        </h1>
        <p className="text-muted-foreground">
          Top students competing for excellence in the SoloSuccess Academy
        </p>
      </div>

      {/* Leaderboard Card */}
      <Card className="glass-card border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="sr-only">Leaderboard Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="xp" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">XP Leaders</span>
                <span className="sm:hidden">XP</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Badge Collectors</span>
                <span className="sm:hidden">Badges</span>
              </TabsTrigger>
            </TabsList>

            {/* XP Tab */}
            <TabsContent value="xp" className="space-y-3">
              {xpLoading ? (
                <LeaderboardSkeleton />
              ) : !xpLeaderboard || xpLeaderboard.length === 0 ? (
                <EmptyLeaderboard message="No XP leaders yet" />
              ) : (
                xpLeaderboard.map((entry, index) => (
                  <LeaderboardRow
                    key={entry.userId}
                    entry={entry}
                    rank={index + 1}
                    isCurrentUser={entry.userId === user?.id}
                    primaryStat={entry.totalXp.toLocaleString()}
                    primaryLabel="Total XP"
                    primaryIcon={Zap}
                  />
                ))
              )}
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="space-y-3">
              {badgeLoading ? (
                <LeaderboardSkeleton />
              ) : !badgeLeaderboard || badgeLeaderboard.length === 0 ? (
                <EmptyLeaderboard message="No badge collectors yet" />
              ) : (
                badgeLeaderboard.map((entry, index) => (
                  <LeaderboardRow
                    key={entry.userId}
                    entry={entry}
                    rank={index + 1}
                    isCurrentUser={entry.userId === user?.id}
                    primaryStat={entry.badgeCount}
                    primaryLabel="Badges"
                    primaryIcon={Award}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
